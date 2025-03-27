/**
 * API Service for USA Operations Map
 * Handles all API calls to the backend server
 */
class ApiService {
    static API_URL = 'http://localhost:5000/api';
    static TOKEN_KEY = 'auth_token';
    static USER_KEY = 'user_data';
    
    /**
     * Check if user is authenticated
     * @returns {boolean} True if authenticated
     */
    static isAuthenticated() {
        return !!localStorage.getItem(this.TOKEN_KEY);
    }
    
    /**
     * Get the current user data
     * @returns {Object|null} User data or null if not authenticated
     */
    static getCurrentUser() {
        const userData = localStorage.getItem(this.USER_KEY);
        return userData ? JSON.parse(userData) : null;
    }
    
    /**
     * Get the authentication token
     * @returns {string|null} Auth token or null
     */
    static getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    }
    
    /**
     * Set authentication data
     * @param {string} token - JWT token
     * @param {Object} userData - User data object
     */
    static setAuthData(token, userData) {
        localStorage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
    }
    
    /**
     * Clear authentication data (logout)
     */
    static clearAuthData() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }
    
    /**
     * Make an authenticated API request
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Fetch options
     * @returns {Promise} Fetch promise
     */
    static async apiRequest(endpoint, options = {}) {
        const url = `${this.API_URL}${endpoint}`;
        
        // Set default headers
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        // Add auth token if available
        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        try {
            // Make the request
            const response = await fetch(url, {
                ...options,
                headers,
                // Add CORS mode
                mode: 'cors',
                credentials: 'include'
            });
            
            // Parse the JSON response
            const data = await response.json();
            
            // Check if request was successful
            if (!response.ok) {
                // Handle token expiration
                if (response.status === 401) {
                    this.clearAuthData();
                    window.location.href = 'login.html';
                }
                
                // Throw error with message from API
                throw new Error(data.message || 'An error occurred');
            }
            
            return data;
        } catch (error) {
            console.error(`API request failed: ${url}`, error);
            throw error;
        }
    }
    
    /**
     * Login user
     * @param {string} username - Username
     * @param {string} password - Password
     * @returns {Promise<Object>} User data
     */
    static async login(username, password) {
        const data = await this.apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        
        this.setAuthData(data.token, data.user);
        return data.user;
    }
    
    /**
     * Register new user
     * @param {Object} userData - User registration data
     * @returns {Promise<Object>} Registration result
     */
    static async register(userData) {
        return await this.apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }
    
    /**
     * Logout user
     */
    static logout() {
        this.clearAuthData();
        window.location.href = 'login.html';
    }
    
    /**
     * Get current user profile
     * @returns {Promise<Object>} User profile
     */
    static async getUserProfile() {
        const user = this.getCurrentUser();
        if (!user) return null;
        
        return await this.apiRequest(`/users/${user.id}`);
    }
    
    /**
     * Update user profile
     * @param {Object} profileData - Profile data to update
     * @returns {Promise<Object>} Updated profile
     */
    static async updateUserProfile(profileData) {
        const user = this.getCurrentUser();
        if (!user) throw new Error('User not authenticated');
        
        return await this.apiRequest(`/users/${user.id}`, {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }
    
    /**
     * Change user password
     * @param {string} currentPassword - Current password
     * @param {string} newPassword - New password
     * @returns {Promise<Object>} Result
     */
    static async changePassword(currentPassword, newPassword) {
        const user = this.getCurrentUser();
        if (!user) throw new Error('User not authenticated');
        
        return await this.apiRequest(`/users/${user.id}/password`, {
            method: 'PUT',
            body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
        });
    }
    
    /**
     * Get all projects
     * @param {Object} filters - Optional filters
     * @returns {Promise<Array>} Projects list
     */
    static async getProjects(filters = {}) {
        // Convert filters to query string
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, value);
            }
        });
        
        const queryString = queryParams.toString();
        const endpoint = `/projects${queryString ? '?' + queryString : ''}`;
        
        return await this.apiRequest(endpoint);
    }
    
    /**
     * Get project by ID
     * @param {number} projectId - Project ID
     * @returns {Promise<Object>} Project data
     */
    static async getProject(projectId) {
        return await this.apiRequest(`/projects/${projectId}`);
    }
    
    /**
     * Create new project
     * @param {Object} projectData - Project data
     * @returns {Promise<Object>} Created project
     */
    static async createProject(projectData) {
        return await this.apiRequest('/projects', {
            method: 'POST',
            body: JSON.stringify(projectData)
        });
    }
    
    /**
     * Update project
     * @param {number} projectId - Project ID
     * @param {Object} projectData - Project data to update
     * @returns {Promise<Object>} Updated project
     */
    static async updateProject(projectId, projectData) {
        return await this.apiRequest(`/projects/${projectId}`, {
            method: 'PUT',
            body: JSON.stringify(projectData)
        });
    }
    
    /**
     * Delete project
     * @param {number} projectId - Project ID
     * @returns {Promise<Object>} Result
     */
    static async deleteProject(projectId) {
        return await this.apiRequest(`/projects/${projectId}`, {
            method: 'DELETE'
        });
    }
    
    /**
     * Get all sites for a project
     * @param {number} projectId - Project ID
     * @returns {Promise<Array>} Sites list
     */
    static async getProjectSites(projectId) {
        return await this.apiRequest(`/projects/${projectId}/sites`);
    }
    
    /**
     * Get all tasks for a project
     * @param {number} projectId - Project ID
     * @returns {Promise<Array>} Tasks list
     */
    static async getProjectTasks(projectId) {
        return await this.apiRequest(`/projects/${projectId}/tasks`);
    }
    
    /**
     * Get projects by region
     * @param {string} region - Region identifier
     * @returns {Promise<Array>} Projects in region
     */
    static async getProjectsByRegion(region) {
        return await this.apiRequest(`/projects?region=${region}`);
    }
    
    /**
     * Get projects summary by region
     * @returns {Promise<Object>} Projects summary by region
     */
    static async getProjectsSummaryByRegion() {
        return await this.apiRequest('/projects/summary/regions');
    }
    
    /**
     * Get overall metrics
     * @returns {Promise<Object>} Overall metrics
     */
    static async getOverallMetrics() {
        return await this.apiRequest('/projects/metrics');
    }
}

// Export for use in other files
window.ApiService = ApiService;
