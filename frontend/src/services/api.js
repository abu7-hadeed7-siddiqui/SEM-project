// API Service Layer for LEARNOVA
const API_BASE_URL = '/api';

/**
 * Base request handler with JWT injection and uniform error handling
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('learnova_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({
      success: false,
      error: 'Invalid response from server'
    }));

    if (!response.ok) {
      // If unauthorized or expired token, handle clean logout
      if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
        localStorage.removeItem('learnova_token');
        localStorage.removeItem('learnova_user');
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (err) {
    throw err;
  }
}

export const api = {
  // Authentication
  auth: {
    login: (email, password) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    register: (name, email, password) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      }),
    logout: () =>
      request('/auth/logout', {
        method: 'POST',
      }),
  },

  // User Profile
  profile: {
    get: () => request('/profile'),
    update: (profileData) =>
      request('/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      }),
  },

  // Recommendations
  recommendations: {
    get: (refresh = false) => request(`/recommendations?refresh=${refresh}`),
    generate: () =>
      request('/recommendations/generate', {
        method: 'POST',
      }),
    getHistory: () => request('/recommendations/history'),
    submitRating: (recommendationItemId, resourceId, rating) =>
      request('/recommendations/ratings', {
        method: 'POST',
        body: JSON.stringify({
          recommendation_item_id: recommendationItemId,
          resource_id: resourceId,
          rating,
        }),
      }),
  },

  // Administrator APIs
  admin: {
    getStats: () => request('/admin/stats'),
    getResources: ({ search, category, difficulty, page = 1, perPage = 20 } = {}) => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category && category !== 'All') params.append('category', category);
      if (difficulty && difficulty !== 'All') params.append('difficulty', difficulty);
      params.append('page', page);
      params.append('per_page', perPage);
      return request(`/admin/resources?${params.toString()}`);
    },
    getCategories: () => request('/admin/categories'),
    createResource: (resourceData) =>
      request('/admin/resources', {
        method: 'POST',
        body: JSON.stringify(resourceData),
      }),
    updateResource: (id, resourceData) =>
      request(`/admin/resources/${id}`, {
        method: 'PUT',
        body: JSON.stringify(resourceData),
      }),
    deleteResource: (id) =>
      request(`/admin/resources/${id}`, {
        method: 'DELETE',
      }),
  },
};
