"""Domain model: Profile."""
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional, List


@dataclass
class Profile:
    id: Optional[int]
    user_id: int
    skills: List[str] = field(default_factory=list)
    goals: List[str] = field(default_factory=list)
    difficulty: str = 'Beginner'
    completed_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    def is_complete(self) -> bool:
        return bool(self.skills or self.goals)

    def completion_percentage(self) -> int:
        score = 0
        if self.skills:
            score += 40
        if self.goals:
            score += 40
        if self.difficulty:
            score += 20
        return score

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'user_id': self.user_id,
            'skills': self.skills,
            'goals': self.goals,
            'difficulty': self.difficulty,
            'completion_percentage': self.completion_percentage(),
            'is_complete': self.is_complete(),
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
