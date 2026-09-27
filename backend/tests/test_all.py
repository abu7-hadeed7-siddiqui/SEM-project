"""
LEARNOVA Backend Tests
Run with: python -m pytest tests/ -v
"""
import json
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from app import create_app
from app.domain.models.profile import Profile
from app.domain.models.resource import Resource
from app.domain.recommendation_engine import RecommendationEngine
from app.domain.strategies.recommendation_strategies import (
    TagOverlapStrategy, PopularityStrategy, RecommendationContext
)


@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    with app.test_client() as c:
        yield c


@pytest.fixture
def sample_profile():
    return Profile(
        id=1, user_id=1,
        skills=['Python', 'JavaScript', 'SQL', 'Data Structures'],
        goals=['Learn Data Science', 'Become a Full Stack Developer'],
        difficulty='Intermediate'
    )


@pytest.fixture
def sample_resources():
    return [
        Resource(id=1, title='Python Data Science', description='Learn DS with Python',
                 category='Data Science', tags=['Python', 'Data Science', 'Pandas'],
                 difficulty='Beginner', prerequisites=[], average_rating=4.5, rating_count=100, is_active=True),
        Resource(id=2, title='Machine Learning', description='ML fundamentals',
                 category='AI/ML', tags=['Machine Learning', 'Python', 'scikit-learn'],
                 difficulty='Intermediate', prerequisites=['Python Basics'], average_rating=4.8, rating_count=200, is_active=True),
        Resource(id=3, title='Advanced SQL', description='Advanced SQL tuning',
                 category='Database', tags=['SQL', 'Optimization', 'Indexing'],
                 difficulty='Advanced', prerequisites=['SQL Fundamentals'], average_rating=4.6, rating_count=80, is_active=True),
        Resource(id=4, title='React.js', description='Build modern UIs',
                 category='Frontend', tags=['React', 'JavaScript', 'Frontend'],
                 difficulty='Intermediate', prerequisites=['JavaScript'], average_rating=4.7, rating_count=300, is_active=True),
        Resource(id=5, title='Advanced Deep Learning', description='Advanced NN',
                 category='AI/ML', tags=['Deep Learning', 'Python', 'Neural Networks'],
                 difficulty='Advanced', prerequisites=['Machine Learning', 'Linear Algebra'], average_rating=4.9, rating_count=50, is_active=True),
        Resource(id=6, title='HTML Basics', description='Intro to HTML',
                 category='Web', tags=['HTML', 'CSS', 'Web Development'],
                 difficulty='Beginner', prerequisites=[], average_rating=4.3, rating_count=500, is_active=True),
    ]


# ==================== AUTH TESTS ====================

class TestRegistration:

    def test_successful_registration(self, client):
        import time
        email = f'newuser_{int(time.time())}@test.com'
        resp = client.post('/api/auth/register', json={
            'name': 'Test User', 'email': email, 'password': 'Test@1234'
        })
        assert resp.status_code == 201
        data = resp.get_json()
        assert data['success'] is True
        assert 'token' in data
        assert data['user']['email'] == email

    def test_duplicate_email_rejected(self, client):
        import time
        email = f'dup_{int(time.time())}@test.com'
        client.post('/api/auth/register', json={
            'name': 'User A', 'email': email, 'password': 'Test@1234'
        })
        resp = client.post('/api/auth/register', json={
            'name': 'User B', 'email': email, 'password': 'Test@1234'
        })
        assert resp.status_code == 400
        data = resp.get_json()
        assert data['success'] is False

    def test_invalid_email_rejected(self, client):
        resp = client.post('/api/auth/register', json={
            'name': 'User', 'email': 'not-an-email', 'password': 'Test@1234'
        })
        assert resp.status_code == 400

    def test_weak_password_rejected(self, client):
        resp = client.post('/api/auth/register', json={
            'name': 'User', 'email': 'weak@test.com', 'password': 'weak'
        })
        assert resp.status_code == 400


class TestLogin:

    def _register_user(self, client, email, password='Test@1234'):
        client.post('/api/auth/register', json={
            'name': 'Login Test User', 'email': email, 'password': password
        })

    def test_valid_login(self, client):
        import time
        email = f'login_{int(time.time())}@test.com'
        self._register_user(client, email)
        resp = client.post('/api/auth/login', json={'email': email, 'password': 'Test@1234'})
        assert resp.status_code == 200
        assert resp.get_json()['success'] is True
        assert 'token' in resp.get_json()

    def test_wrong_password(self, client):
        import time
        email = f'wrongpw_{int(time.time())}@test.com'
        self._register_user(client, email)
        resp = client.post('/api/auth/login', json={'email': email, 'password': 'Wrong@999'})
        assert resp.status_code == 401
        assert resp.get_json()['success'] is False

    def test_nonexistent_user(self, client):
        resp = client.post('/api/auth/login', json={
            'email': 'nobody@nowhere.com', 'password': 'Test@1234'
        })
        assert resp.status_code == 401

    def test_generic_error_message(self, client):
        """Error message should not reveal whether email or password is wrong."""
        resp = client.post('/api/auth/login', json={
            'email': 'nobody2@nowhere.com', 'password': 'Test@1234'
        })
        data = resp.get_json()
        assert 'Invalid email or password' in data.get('error', '')


# ==================== RECOMMENDATION ENGINE TESTS ====================

class TestTagOverlapStrategy:

    def test_scoring_returns_tuple(self, sample_profile, sample_resources):
        strategy = TagOverlapStrategy()
        context = RecommendationContext(sample_profile)
        score, reason = strategy.score(sample_resources[0], context)
        assert isinstance(score, float)
        assert 0.0 <= score <= 1.0
        assert isinstance(reason, str)
        assert len(reason) > 0

    def test_higher_score_for_matching_resource(self, sample_profile, sample_resources):
        strategy = TagOverlapStrategy()
        context = RecommendationContext(sample_profile)
        # Python Data Science vs Advanced Deep Learning — former should score higher for this profile
        score_python, _ = strategy.score(sample_resources[0], context)  # Python DS
        score_deep, _ = strategy.score(sample_resources[4], context)   # Advanced DL
        # Python DS matches profile better (Python + Intermediate)
        assert score_python > score_deep


class TestPopularityStrategy:

    def test_popularity_scoring(self, sample_profile, sample_resources):
        strategy = PopularityStrategy()
        context = RecommendationContext(sample_profile)
        score, reason = strategy.score(sample_resources[0], context)
        assert 0.0 <= score <= 1.0

    def test_higher_count_means_higher_score(self, sample_profile, sample_resources):
        strategy = PopularityStrategy()
        context = RecommendationContext(sample_profile)
        # Resource with 300 ratings vs 50 ratings (both 4.x rating)
        score_300, _ = strategy.score(sample_resources[3], context)  # React (300 ratings)
        score_50, _ = strategy.score(sample_resources[4], context)   # Deep Learning (50)
        assert score_300 > score_50


class TestRecommendationEngine:

    def test_returns_top_5(self, sample_profile, sample_resources):
        engine = RecommendationEngine()
        result = engine.generate(sample_profile, sample_resources, top_n=5)
        assert 'items' in result
        assert len(result['items']) <= 5

    def test_returns_algorithm_version(self, sample_profile, sample_resources):
        engine = RecommendationEngine()
        result = engine.generate(sample_profile, sample_resources)
        assert 'algorithm_version' in result
        assert result['algorithm_version'] == TagOverlapStrategy.version

    def test_difficulty_filter_enforced(self, sample_resources):
        """Beginner profile should not get Advanced resources."""
        beginner_profile = Profile(
            id=2, user_id=2,
            skills=['HTML', 'CSS'],
            goals=['Learn Web Development'],
            difficulty='Beginner'
        )
        engine = RecommendationEngine()
        result = engine.generate(beginner_profile, sample_resources, top_n=5, enforce_difficulty=True)
        for item in result['items']:
            assert item['resource'].difficulty != 'Advanced'

    def test_cold_start_uses_popularity(self, sample_resources):
        """Empty profile should trigger cold-start (PopularityStrategy)."""
        empty_profile = Profile(id=3, user_id=3, skills=[], goals=[], difficulty='Beginner')
        engine = RecommendationEngine()
        result = engine.generate(empty_profile, sample_resources)
        assert result['is_personalized'] is False
        assert 'Popularity' in result['algorithm_version']

    def test_sorted_descending_by_score(self, sample_profile, sample_resources):
        engine = RecommendationEngine()
        result = engine.generate(sample_profile, sample_resources)
        scores = [item['score'] for item in result['items']]
        assert scores == sorted(scores, reverse=True)

    def test_strategy_can_be_swapped(self, sample_profile, sample_resources):
        engine = RecommendationEngine(strategy=TagOverlapStrategy())
        engine.set_strategy(PopularityStrategy())
        result = engine.generate(sample_profile, sample_resources)
        assert 'Popularity' in result['algorithm_version']


# ==================== PROFILE TESTS ====================

class TestProfileValidation:

    def _get_token(self, client):
        import time, random
        email = f'prof_{int(time.time())}_{random.randint(1000,9999)}@test.com'
        resp = client.post('/api/auth/register', json={
            'name': 'Profile Tester', 'email': email, 'password': 'Test@1234'
        })
        data = resp.get_json()
        assert data.get('success'), f"Registration failed: {data}"
        return data['token']

    def test_profile_requires_skill_or_goal(self, client):
        token = self._get_token(client)
        resp = client.put('/api/profile',
                          json={'skills': [], 'goals': [], 'difficulty': 'Beginner'},
                          headers={'Authorization': f'Bearer {token}'})
        assert resp.status_code == 400

    def test_profile_save_success(self, client):
        token = self._get_token(client)
        resp = client.put('/api/profile',
                          json={'skills': ['Python'], 'goals': ['Learn Data Science'], 'difficulty': 'Intermediate'},
                          headers={'Authorization': f'Bearer {token}'})
        assert resp.status_code == 200
        data = resp.get_json()
        assert data['success'] is True
        assert 'Python' in data['profile']['skills']


# ==================== RATING TESTS ====================

class TestRatings:

    def test_rating_out_of_range_rejected(self):
        from app.services.recommendation_service import RecommendationService
        svc = RecommendationService()
        result = svc.submit_rating(1, 1, 1, 6)
        assert result['success'] is False

        result2 = svc.submit_rating(1, 1, 1, 0)
        assert result2['success'] is False

    def test_valid_rating_accepted(self):
        from app.services.recommendation_service import RecommendationService
        import pymysql
        svc = RecommendationService()
        # Rating 5 passes validation (1-5); DB FK error is expected for nonexistent IDs
        try:
            result = svc.submit_rating(1, 999999, 999999, 5)
            # If no exception: must NOT be a rating range error
            assert result.get('error') != 'Rating must be between 1 and 5.'
        except (pymysql.err.IntegrityError, pymysql.err.OperationalError):
            pass  # Expected: FK constraint violation for fake IDs
        # Rating 6 must fail with validation error (before any DB call)
        result_bad = svc.submit_rating(1, 1, 1, 6)
        assert result_bad['success'] is False
        assert result_bad.get('error') == 'Rating must be between 1 and 5.'


# ==================== ADMIN TESTS ====================

class TestAdminAuthorization:

    def _get_admin_token(self, client):
        resp = client.post('/api/auth/login', json={
            'email': 'admin@learnova.local', 'password': 'Admin@1234'
        })
        return resp.get_json().get('token')

    def _get_student_token(self, client):
        import time
        email = f'student_{int(time.time())}@test.com'
        client.post('/api/auth/register', json={
            'name': 'Regular Student', 'email': email, 'password': 'Test@1234'
        })
        resp = client.post('/api/auth/login', json={'email': email, 'password': 'Test@1234'})
        return resp.get_json()['token']

    def test_admin_stats_accessible_to_admin(self, client):
        token = self._get_admin_token(client)
        if not token:
            pytest.skip('Admin user not seeded')
        resp = client.get('/api/admin/stats', headers={'Authorization': f'Bearer {token}'})
        assert resp.status_code == 200

    def test_admin_routes_blocked_for_learner(self, client):
        token = self._get_student_token(client)
        resp = client.get('/api/admin/stats', headers={'Authorization': f'Bearer {token}'})
        assert resp.status_code == 403

    def test_admin_create_resource(self, client):
        token = self._get_admin_token(client)
        if not token:
            pytest.skip('Admin user not seeded')
        resp = client.post('/api/admin/resources',
                           json={
                               'title': 'Test Course by Admin',
                               'description': 'Created during automated test run.',
                               'category': 'Testing',
                               'tags': ['Testing', 'QA'],
                               'difficulty': 'Beginner',
                               'prerequisites': [],
                           },
                           headers={'Authorization': f'Bearer {token}'})
        assert resp.status_code == 201
        data = resp.get_json()
        assert data['success'] is True
        assert data['resource']['title'] == 'Test Course by Admin'
