"""
Recommendation Strategies — Strategy Pattern implementation.

SCORING FORMULA (TagOverlapStrategy):
  score = (skill_overlap / max_skills) * 0.30
        + (goal_overlap / max_goals) * 0.25
        + difficulty_fit * 0.20
        + prerequisite_fit * 0.15
        + rating_signal * 0.10

All weights sum to 1.0. Scores are in [0, 1].
"""

from abc import ABC, abstractmethod
from typing import List
import math


class RecommendationContext:
    """Carries profile and feedback signals into strategy.score()."""
    def __init__(self, profile, user_ratings: dict = None):
        self.profile = profile
        self.user_ratings = user_ratings or {}   # resource_id -> avg rating given by user


class RecommendationStrategy(ABC):
    """Abstract base strategy."""

    @abstractmethod
    def score(self, resource, context: RecommendationContext) -> tuple[float, str]:
        """
        Returns (score: float, match_reason: str).
        score is in [0, 1].
        """
        ...

    @property
    @abstractmethod
    def version(self) -> str:
        """Algorithm identifier stored in DB."""
        ...

    @property
    @abstractmethod
    def is_personalized(self) -> bool:
        ...


class TagOverlapStrategy(RecommendationStrategy):
    """
    Personalized strategy: ranks resources by overlap with
    profile skills/goals, difficulty fit, and prerequisite compatibility.
    """

    version = 'TagOverlapStrategy-v1'
    is_personalized = True

    # Weight configuration
    SKILL_WEIGHT        = 0.30
    GOAL_WEIGHT         = 0.25
    DIFFICULTY_WEIGHT   = 0.20
    PREREQ_WEIGHT       = 0.15
    RATING_WEIGHT       = 0.10

    DIFFICULTY_ORDER = {'Beginner': 0, 'Intermediate': 1, 'Advanced': 2}

    def score(self, resource, context: RecommendationContext) -> tuple[float, str]:
        profile = context.profile
        profile_skills = set(s.lower() for s in (profile.skills or []))
        profile_goals  = set(g.lower() for g in (profile.goals or []))
        resource_tags  = set(t.lower() for t in (resource.tags or []))
        prereqs        = [p.lower() for p in (resource.prerequisites or [])]

        # ---- Skill overlap ----
        skill_intersect = profile_skills & resource_tags
        skill_score = len(skill_intersect) / max(len(resource_tags), 1)
        skill_score = min(skill_score, 1.0)

        # ---- Goal overlap (treat goals as keyword tokens) ----
        goal_tokens = set()
        for g in profile_goals:
            goal_tokens.update(g.split())
        goal_intersect = goal_tokens & resource_tags
        goal_score = len(goal_intersect) / max(len(resource_tags), 1)
        goal_score = min(goal_score, 1.0)

        # ---- Difficulty fit ----
        user_diff = self.DIFFICULTY_ORDER.get(profile.difficulty, 0)
        res_diff  = self.DIFFICULTY_ORDER.get(resource.difficulty, 0)
        diff_gap  = abs(user_diff - res_diff)
        diff_score = max(0.0, 1.0 - diff_gap * 0.5)

        # ---- Prerequisite fit ----
        if not prereqs:
            prereq_score = 1.0
        else:
            satisfied = sum(
                1 for p in prereqs
                if any(p in s.lower() for s in profile_skills)
                or any(p in g.lower() for g in profile_goals)
            )
            prereq_score = satisfied / len(prereqs)

        # ---- Rating signal (normalized 0-1) ----
        rating_signal = (float(resource.average_rating) / 5.0) if resource.average_rating else 0.0

        # ---- Composite score ----
        total = (
            skill_score   * self.SKILL_WEIGHT +
            goal_score    * self.GOAL_WEIGHT +
            diff_score    * self.DIFFICULTY_WEIGHT +
            prereq_score  * self.PREREQ_WEIGHT +
            rating_signal * self.RATING_WEIGHT
        )

        # ---- Build reason string ----
        reasons = []
        if skill_intersect:
            reasons.append(f"Matches skills: {', '.join(list(skill_intersect)[:3]).title()}")
        if goal_intersect:
            top_goals = list(goal_intersect)[:2]
            reasons.append(f"Aligns with goal: {', '.join(top_goals).title()}")
        if resource.average_rating >= 4.5:
            reasons.append("Highly rated by community")
        if prereq_score == 1.0 and prereqs:
            reasons.append("Prerequisites satisfied")
        if not reasons:
            reasons.append("Good match for your learning path")

        match_reason = '. '.join(reasons) + '.'
        return round(total, 4), match_reason


class PopularityStrategy(RecommendationStrategy):
    """
    Cold-start strategy: ranks by popularity score.
    popularity = average_rating * log(rating_count + 1)
    """

    version = 'PopularityStrategy-v1'
    is_personalized = False

    def score(self, resource, context: RecommendationContext) -> tuple[float, str]:
        raw = float(resource.average_rating) * math.log(resource.rating_count + 1)
        # Normalize to 0-1 (max realistic value ~5 * log(1000) ≈ 34.5)
        normalized = min(raw / 35.0, 1.0)
        reason = f"Highly popular resource with {resource.rating_count} ratings."
        return round(normalized, 4), reason
