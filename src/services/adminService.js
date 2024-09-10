// src/services/adminService.js

const API_BASE_URL = '/api/admin'; // 根据您的后端API调整这个基础URL
const ADMIN_PASSWORD = 'your_temporary_password'; // 请更改为您想要的密码
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

export const login = async (password) => {
    if (password === ADMIN_PASSWORD) {
      // 模拟成功登录
      localStorage.setItem('adminToken', 'dummy_token');
      return { success: true };
    } else {
      throw new Error('Invalid password');
    }
  };

export const getCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
  });
  return handleResponse(response);
};

export const addCategory = async (category) => {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    },
    body: JSON.stringify(category)
  });
  return handleResponse(response);
};

export const deleteCategory = async (id) => {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
  });
  return handleResponse(response);
};

export const getCategoryImages = async (id) => {
  const response = await fetch(`${API_BASE_URL}/categories/${id}/images`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
  });
  return response.text();
};

export const updateCategoryImages = async (id, imageUrls) => {
  const response = await fetch(`${API_BASE_URL}/categories/${id}/images`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
    },
    body: imageUrls
  });
  return handleResponse(response);
};