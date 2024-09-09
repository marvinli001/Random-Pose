// src/components/CategoryPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRandomImageForCategory, preloadCategoryImages } from '../services/imageService';
import { debounce } from 'lodash';  // 确保已安装 lodash
import '../styles/CategoryPage.css';

function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChangingImage, setIsChangingImage] = useState(false);

  const loadRandomImage = useCallback(async () => {
    setIsChangingImage(true);
    setError(null);
    try {
      const imageUrl = await getRandomImageForCategory(id);
      if (imageUrl) {
        setCurrentImage(imageUrl);
      } else {
        setError('该分类没有图片或文件不存在');
      }
    } catch (error) {
      console.error('Failed to load image:', error);
      setError('加载图片失败');
    } finally {
      setIsChangingImage(false);
      setLoading(false);
    }
  }, [id]);

  const debouncedLoadRandomImage = debounce(loadRandomImage, 300);

  useEffect(() => {
    setLoading(true);
    loadRandomImage();
    // 预加载该类别的所有图片
    preloadCategoryImages(id).catch(console.error);
  }, [id, loadRandomImage]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => navigate('/')} className="home-button">
          返回主页
        </button>
      </div>
    );
  }

  return (
    <div className="category-page">
      <div className="image-container">
        {currentImage && <img src={currentImage} alt="Random Pose" className="image" />}
        {isChangingImage && <div className="loading-overlay">正在加载新图片...</div>}
      </div>
      <div className="button-container">
        <button onClick={() => navigate('/')} className="home-button">
          返回主页
        </button>
        <button 
          onClick={debouncedLoadRandomImage} 
          className="random-button" 
          disabled={isChangingImage}
        >
          {isChangingImage ? '加载中...' : '随机姿势'}
        </button>
      </div>
    </div>
  );
}

export default CategoryPage;