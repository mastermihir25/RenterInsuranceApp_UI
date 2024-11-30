import axios from "axios";

// Base API URL
const API_BASE_URL = "http://localhost:5190/api"; // Update with your backend URL

// Axios instance with common headers
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Handle API responses - General method to handle both success and error
const handleResponse = (response) => {
  const { statusCode, data, error } = response.data;

  if (statusCode >= 200 && statusCode < 300) {
    // Successful response
    return data;
  } else {
    // API returned an error
    console.error("API Error:", error);
    throw new Error(error || "Unknown API error");
  }
};

// Generalized API Request Method
const apiRequest = async (method, url, data = null) => {
  try {
    const options = {
      method,
      url,
      data,
    };

    const response = await apiClient(options);
    return handleResponse(response);
  } catch (error) {
    console.error(`Error with ${method} request to ${url}:`, error.message);
    throw error;
  }
};

// Fetch Categories (GET request)
export const fetchCategories = async () => {
  return await apiRequest("GET", "/categories");
};

// Fetch Items (GET request)
export const fetchItems = async () => {
  return await apiRequest("GET", "/items");
};

// Add Item (POST request)
export const addItem = async (item) => {
  return await apiRequest("POST", "/items", item);
};

// Delete Item (DELETE request)
export const deleteItem = async (id) => {
  return await apiRequest("DELETE", `/items/${id}`);
};
