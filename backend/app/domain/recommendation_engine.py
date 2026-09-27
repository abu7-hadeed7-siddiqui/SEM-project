"""
RecommendationEngine — orchestrates strategy selection, prerequisite checking,
difficulty filtering, scoring, and returns top-N ranked results.
"""
from typing import List, Optional
from app.domain.strategies.recommendation_strategies import (
    RecommendationStrategy, TagOverlapStrategy, PopularityStrategy,
    RecommendationContext
)
from app.domain.models.resource import Resource
from app.domain.models.profile import Profile


DIFFICULTY_ORDER = {'Beginner': 0, 'Intermediate': 1, 'Advanced': 2}


class RecommendationEngine:
    """
    Uses a configured RecommendationStrategy to score and rank resources.
    The engine knows nothing about the internal logic of strategies.
    """

    def __init__(self, strategy: Optional[RecommendationStrategy] = None):
        self._strategy = strategy or TagOverlapStrategy()

    def set_strategy(self, strategy: RecommendationStrategy) -> None:
        self._strategy = strategy

    @property
    def strategy(self) -> RecommendationStrategy:
        return self._strategy

    def _passes_difficulty_filter(self, resource: Resource, profile: Profile) -> bool:
        """
        Exclude resources whose difficulty exceeds the user's selected level.
        A Beginner profile should NOT receive Advanced or Intermediate resources.
        An Intermediate profile may receive Beginner or Intermediate.
        An Advanced profile may receive any difficulty.
        """
        user_level = DIFFICULTY_ORDER.get(profile.difficulty, 0)
        res_level  = DIFFICULTY_ORDER.get(resource.difficulty, 0)
        return res_level <= user_level

    def _passes_prerequisite_check(self, resource: Resource, profile: Profile) -> bool:
        """
        Resource prerequisites must be satisfiable given the user's skill/goal vocabulary.
        For strict prerequisite enforcement: ALL prerequisites must match.
        For lenient enforcement (used here): 50%+ must match.
        """
        prereqs = [p.lower() for p in (resource.prerequisites or [])]
        if not prereqs:
            return True

        all_known = set()
        for s in (profile.skills or []):
            all_known.add(s.lower())
            all_known.update(s.lower().split())
        for g in (profile.goals or []):
            all_known.add(g.lower())
            all_known.update(g.lower().split())

        satisfied = sum(
            1 for p in prereqs
            if any(p in k for k in all_known) or any(k in p for k in all_known)
        )
        # Require at least 50% of prerequisites to be satisfied
        return (satisfied / len(prereqs)) >= 0.5

    def generate(
        self,
        profile: Profile,
        resources: List[Resource],
        top_n: int = 5,
        user_ratings: dict = None,
        enforce_difficulty: bool = True,
        enforce_prerequisites: bool = True
    ) -> dict:
        """
        Generate top_n recommendations.
        Returns dict with keys: items, algorithm_version, is_personalized
        Each item: {resource, score, match_reason}
        """
        context = RecommendationContext(profile, user_ratings or {})
        active_resources = [r for r in resources if r.is_active]

        # Determine if we should use cold-start
        has_profile = bool(profile.skills or profile.goals)
        if not has_profile:
            self._strategy = PopularityStrategy()

        # Filter eligible resources
        eligible = []
        for resource in active_resources:
            if enforce_difficulty and has_profile:
                if not self._passes_difficulty_filter(resource, profile):
                    continue
            if enforce_prerequisites and has_profile:
                if not self._passes_prerequisite_check(resource, profile):
                    continue
            eligible.append(resource)

        # If too few after filtering, relax prerequisites
        if len(eligible) < top_n and enforce_prerequisites:
            eligible = []
            for resource in active_resources:
                if enforce_difficulty and has_profile:
                    if not self._passes_difficulty_filter(resource, profile):
                        continue
                eligible.append(resource)

        # Score all eligible resources
        scored = []
        for resource in eligible:
            score, reason = self._strategy.score(resource, context)
            scored.append({'resource': resource, 'score': score, 'match_reason': reason})

        # Sort descending by score
        scored.sort(key=lambda x: x['score'], reverse=True)

        return {
            'items': scored[:top_n],
            'algorithm_version': self._strategy.version,
            'is_personalized': self._strategy.is_personalized,
        }
