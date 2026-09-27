"""Domain models: Recommendation and Rating."""
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional, List


@dataclass
class RecommendationItem:
    id: Optional[int]
    recommendation_id: int
    resource_id: int
    rank: int
    score: float
    match_reason: str = ''
    resource: Optional[object] = None
    rating: Optional[int] = None
    rating_id: Optional[int] = None
    created_at: Optional[datetime] = None

    def to_dict(self) -> dict:
        d = {
            'id': self.id,
            'recommendation_id': self.recommendation_id,
            'resource_id': self.resource_id,
            'rank': self.rank,
            'score': float(self.score),
            'match_reason': self.match_reason,
            'rating': self.rating,
            'rating_id': self.rating_id,
        }
        if self.resource:
            d['resource'] = self.resource.to_dict() if hasattr(self.resource, 'to_dict') else self.resource
        return d


@dataclass
class Recommendation:
    id: Optional[int]
    user_id: int
    algorithm_version: str = 'TagOverlapStrategy-v1'
    is_personalized: bool = True
    generated_at: Optional[datetime] = None
    items: List[RecommendationItem] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'user_id': self.user_id,
            'algorithm_version': self.algorithm_version,
            'is_personalized': bool(self.is_personalized),
            'generated_at': self.generated_at.isoformat() if self.generated_at else None,
            'items': [item.to_dict() for item in self.items],
        }


@dataclass
class Rating:
    id: Optional[int]
    user_id: int
    resource_id: int
    recommendation_item_id: int
    rating: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'user_id': self.user_id,
            'resource_id': self.resource_id,
            'recommendation_item_id': self.recommendation_item_id,
            'rating': self.rating,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
