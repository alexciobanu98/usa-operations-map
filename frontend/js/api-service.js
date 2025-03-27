/**
 * API Service for USA Operations Map
 * Handles all API calls to the backend server
 */

const API_BASE_URL = 'http://localhost:5000/api';

// Store the authentication token
let authToken = localStorage.getItem('auth_token');
let refreshToken = localStorage.getItem('refresh_token');
let currentUser = JSON.parse(localStorage.getItem('current_user') || 'null');

/**
 * Set the authentication token
 * @param {string} token - JWT token
 */
function setAuthToken(token) {
    authToken = token;
    localStorage.setItem('auth_token', token);
}

/**
 * Set the refresh token
 * @param {string} token - JWT refresh token
 */
function setRefreshToken(token) {
    refreshToken = token;
    localStorage.setItem('refresh_token', token);
}

/**
 * Set the current user
 * @param {Object} user - User object
 */
function setCurrentUser(user) {
    currentUser = user;
    localStorage.setItem('current_user', JSON.stringify(user));
}

/**
 * Clear authentication data (logout)
 */
function clearAuth() {
    authToken = null;
    refreshToken = null;
    currentUser = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('current_user');
}

/**
 * Check if user is authenticated
 * @returns {boolean} - True if authenticated
 */
function isAuthenticated() {
    return !!authToken;
}

/**
 * Get the current user
 * @returns {Object|null} - Current user or null
 */
function getCurrentUser() {
    return currentUser;
}

/**
 * Make an API request with authentication
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} - Fetch promise
 */
async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Set default headers
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    // Add auth token if available
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    // Make the request
    try {
        const response = await fetch(url, {
            ...options,
            headers
        });
        
        // Check for 401 Unauthorized (token expired)
        if (response.status === 401 && refreshToken) {
            // Try to refresh the token
            const refreshed = await refreshAuthToken();
            if (refreshed) {
                // Retry the original request with new token
                headers['Authorization'] = `Bearer ${authToken}`;
                return fetch(url, {
                    ...options,
                    headers
                }).then(res => res.json());
            } else {
                // Refresh failed, clear auth and redirect to login
                clearAuth();
                window.location.href = '/login.html';
                throw new Error('Authentication expired. Please log in again.');
            }
        }
        
        // Parse JSON response
        const data = await response.json();
        
        // Check for errors
        if (!response.ok) {
            throw new Error(data.error || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

/**
 * Refresh the authentication token
 * @returns {Promise<boolean>} - True if successful
 */
async function refreshAuthToken() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refreshToken}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            setAuthToken(data.access_token);
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Token refresh error:', error);
        return false;
    }
}

/**
 * Login user
 * @param {string} username - Username
 * @param {string} password - Password
 * @returns {Promise<Object>} - User data
 */
async function login(username, password) {
    const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
    });
    
    setAuthToken(data.access_token);
    setRefreshToken(data.refresh_token);
    setCurrentUser(data.user);
    
    return data.user;
}

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - User data
 */
async function register(userData) {
    return apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    });
}

/**
 * Get current user profile
 * @returns {Promise<Object>} - User profile
 */
async function getUserProfile() {
    return apiRequest('/auth/me');
}

/**
 * Update user profile
 * @param {number} userId - User ID
 * @param {Object} userData - User data to update
 * @returns {Promise<Object>} - Updated user
 */
async function updateUserProfile(userId, userData) {
    return apiRequest(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData)
    });
}

/**
 * Change user password
 * @param {number} userId - User ID
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} - Result
 */
async function changePassword(userId, currentPassword, newPassword) {
    return apiRequest(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword
        })
    });
}

/**
 * Get all projects
 * @param {Object} filters - Optional filters (region, status, customer)
 * @returns {Promise<Array>} - Projects
 */
async function getProjects(filters = {}) {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    if (filters.region) queryParams.append('region', filters.region);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.customer) queryParams.append('customer', filters.customer);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/projects?${queryString}` : '/projects';
    
    return apiRequest(endpoint);
}

/**
 * Get a specific project
 * @param {number} projectId - Project ID
 * @returns {Promise<Object>} - Project
 */
async function getProject(projectId) {
    return apiRequest(`/projects/${projectId}`);
}

/**
 * Create a new project
 * @param {Object} projectData - Project data
 * @returns {Promise<Object>} - Created project
 */
async function createProject(projectData) {
    return apiRequest('/projects', {
        method: 'POST',
        body: JSON.stringify(projectData)
    });
}

/**
 * Update a project
 * @param {number} projectId - Project ID
 * @param {Object} projectData - Project data to update
 * @returns {Promise<Object>} - Updated project
 */
async function updateProject(projectId, projectData) {
    return apiRequest(`/projects/${projectId}`, {
        method: 'PUT',
        body: JSON.stringify(projectData)
    });
}

/**
 * Delete a project
 * @param {number} projectId - Project ID
 * @returns {Promise<void>}
 */
async function deleteProject(projectId) {
    return apiRequest(`/projects/${projectId}`, {
        method: 'DELETE'
    });
}

/**
 * Get sites for a project
 * @param {number} projectId - Project ID
 * @returns {Promise<Array>} - Sites
 */
async function getProjectSites(projectId) {
    return apiRequest(`/projects/${projectId}/sites`);
}

/**
 * Add a site to a project
 * @param {number} projectId - Project ID
 * @param {Object} siteData - Site data
 * @returns {Promise<Object>} - Created site
 */
async function addProjectSite(projectId, siteData) {
    return apiRequest(`/projects/${projectId}/sites`, {
        method: 'POST',
        body: JSON.stringify(siteData)
    });
}

/**
 * Get tasks for a project
 * @param {number} projectId - Project ID
 * @returns {Promise<Array>} - Tasks
 */
async function getProjectTasks(projectId) {
    return apiRequest(`/projects/${projectId}/tasks`);
}

/**
 * Add a task to a project
 * @param {number} projectId - Project ID
 * @param {Object} taskData - Task data
 * @returns {Promise<Object>} - Created task
 */
async function addProjectTask(projectId, taskData) {
    return apiRequest(`/projects/${projectId}/tasks`, {
        method: 'POST',
        body: JSON.stringify(taskData)
    });
}

/**
 * Get all users
 * @returns {Promise<Array>} - Users
 */
async function getUsers() {
    return apiRequest('/users');
}

// Export all functions
const ApiService = {
    setAuthToken,
    setRefreshToken,
    setCurrentUser,
    clearAuth,
    isAuthenticated,
    getCurrentUser,
    login,
    register,
    getUserProfile,
    updateUserProfile,
    changePassword,
    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    getProjectSites,
    addProjectSite,
    getProjectTasks,
    addProjectTask,
    getUsers
};

// Make available globally
window.ApiService = ApiService;
