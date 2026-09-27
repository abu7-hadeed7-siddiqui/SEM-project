"""Domain model: Resource."""
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional, List


@dataclass
class Resource:
    id: Optional[int]
    title: str
    description: str
    category: str
    tags: List[str] = field(default_factory=list)
    difficulty: str = 'Beginner'
    prerequisites: List[str] = field(default_factory=list)
    url: Optional[str] = None
    average_rating: float = 0.0
    rating_count: int = 0
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    def popularity_score(self) -> float:
        """Popularity signal: weighted average rating × log(count + 1)."""
        import math
        return self.average_rating * math.log(self.rating_count + 1)

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category': self.category,
            'tags': self.tags,
            'difficulty': self.difficulty,
            'prerequisites': self.prerequisites,
            'url': self.url,
            'average_rating': float(self.average_rating),
            'rating_count': self.rating_count,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
