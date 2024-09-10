import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories, addCategory, deleteCategory, getCategoryImages, updateCategoryImages } from '../services/adminService';

const AdminPanel = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ id: '', name: '' });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [imageUrls, setImageUrls] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
      } else {
        fetchCategories();
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    setError('');
    if (!newCategory.id.trim() || !newCategory.name.trim()) {
      setError('Category ID and name are required');
      return;
    }
    setLoading(true);
    try {
      await addCategory(newCategory);
      fetchCategories();
      setNewCategory({ id: '', name: '' });
    } catch (err) {
      setError('Failed to add category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    setLoading(true);
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch (err) {
      setError(`Failed to delete category ${id}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategory = async (id) => {
    setLoading(true);
    try {
      const data = await getCategoryImages(id);
      setSelectedCategory(id);
      setImageUrls(data);
    } catch (err) {
      setError(`Failed to load images for category ${id}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateImages = async () => {
    setLoading(true);
    try {
      await updateCategoryImages(selectedCategory, imageUrls);
      alert('Images updated successfully');
    } catch (err) {
      setError('Failed to update images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Manage Categories</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <div>
        <input
          value={newCategory.id}
          onChange={(e) => setNewCategory({...newCategory, id: e.target.value})}
          placeholder="Category ID"
        />
        <input
          value={newCategory.name}
          onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
          placeholder="Category Name"
        />
        <button onClick={handleAddCategory} disabled={loading}>Add Category</button>
      </div>
      <ul>
        {categories.map(category => (
          <li key={category.id}>
            {category.name}
            <button onClick={() => handleSelectCategory(category.id)} disabled={loading}>Edit</button>
            <button onClick={() => handleDeleteCategory(category.id)} disabled={loading}>Delete</button>
          </li>
        ))}
      </ul>
      {selectedCategory && (
        <div>
          <h3>Edit Images for Category {selectedCategory}</h3>
          <textarea
            value={imageUrls}
            onChange={(e) => setImageUrls(e.target.value)}
            rows="10"
            cols="50"
          />
          <button onClick={handleUpdateImages} disabled={loading}>Update Images</button>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;