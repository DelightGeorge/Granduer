import axios from 'axios';

// Base API URL - adjust this to match your backend server
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Response data from the server
 */
export const registerUser = async (userData) => {
  try {
    const formData = new FormData();
    
    // Append all user data to FormData
    formData.append('firstname', userData.firstname);
    formData.append('lastname', userData.lastname);
    formData.append('email', userData.email);
    formData.append('phone', userData.phone);
    formData.append('address', userData.address);
    formData.append('password', userData.password);
    formData.append('confirmpassword', userData.confirmpassword);
    
    // Append image if provided
    if (userData.image) {
      formData.append('image', userData.image);
    }

    const response = await axios.post(`${API_URL}/registerUser`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    // Handle error and return a consistent error object
    const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
    throw {
      success: false,
      message: errorMessage,
      error: error.response?.data || error.message
    };
  }
};

/**
 * Login user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} Response data with token
 */
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/loginUser`, {
      email,
      password,
    });

    // Store token in localStorage if login is successful
    if (response.data.success && response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }

    return response.data;
  } catch (error) {
    // Handle error and return a consistent error object
    const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
    throw {
      success: false,
      message: errorMessage,
      error: error.response?.data || error.message
    };
  }
};

/**
 * Update user profile
 * @param {Object} userData - Updated user data
 * @param {string} userData.firstName - User's first name
 * @param {string} userData.lastName - User's last name
 * @param {string} userData.email - User's email
 * @param {string} userData.phone - User's phone number
 * @param {string} userData.address - User's address
 * @returns {Promise<Object>} Updated user data
 */
export const updateUserProfile = async (userData) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('No authentication token found. Please login first.');
    }

    const response = await axios.put(`${API_URL}/update-user`, userData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to update profile.';
    throw {
      success: false,
      message: errorMessage,
      error: error.response?.data || error.message
    };
  }
};

/**
 * Logout user
 * Removes token from localStorage
 */
export const logoutUser = () => {
  localStorage.removeItem('authToken');
};

/**
 * Get stored authentication token
 * @returns {string|null} Authentication token or null
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has a token
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

/**
 * Decode JWT token to get user data
 * @returns {Object|null} Decoded user data or null
 */
export const getDecodedToken = () => {
  const token = getAuthToken();
  if (!token) return null;

  try {
    // Decode JWT token (simple base64 decode for the payload)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

/**
 * Get current user info from token
 * @returns {Object|null} User info or null
 */
export const getCurrentUser = () => {
  const decoded = getDecodedToken();
  return decoded ? {
    uuid: decoded.uuid,
    email: decoded.email,
    firstname: decoded.firstname,
    lastname: decoded.lastname,
  } : null;
};