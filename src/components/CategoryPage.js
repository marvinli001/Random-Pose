// src/components/CategoryPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRandomImageForCategory, preloadCategoryImages } from '../services/imageService';
import { debounce } from 'lodash';
import '../styles/CategoryPage.css';

function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState('');
  const [nextImage, setNextImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChangingImage, setIsChangingImage] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const loadRandomImage = useCallback(async () => {
    setIsChangingImage(true);
    setError(null);
    try {
      const imageUrl = await getRandomImageForCategory(id);
      if (imageUrl) {
        setNextImage(imageUrl);
        const img = new Image();
        img.onload = () => {
          setCurrentImage(imageUrl);
          setNextImage('');
          setIsChangingImage(false);
        };
        img.onerror = () => {
          setError('图片加载失败');
          setIsChangingImage(false);
        };
        img.src = imageUrl;
      } else {
        setError('该分类没有图片或文件不存在');
        setIsChangingImage(false);
      }
    } catch (error) {
      console.error('Failed to load image:', error);
      setError('加载图片失败');
      setIsChangingImage(false);
    }
    setLoading(false);
  }, [id]);


  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const debouncedLoadRandomImage = debounce(loadRandomImage, 300);

  useEffect(() => {
    setLoading(true);
    loadRandomImage();
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

  return (
    <div className="category-page">
      <div className={`image-container ${isFullscreen ? 'fullscreen' : ''}`}>
        {currentImage && (
          <img
            src={currentImage}
            alt="Random Pose"
            className={`image ${isChangingImage ? 'fade-out' : ''}`}
            onClick={toggleFullscreen}
          />
        )}
        {nextImage && (
          <img
            src={nextImage}
            alt="Next Random Pose"
            className={`image next-image ${isChangingImage ? 'fade-in' : ''}`}
          />
        )}
        {isChangingImage && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>正在加载新图片...</p>
          </div>
        )}
        {error && <div className="error-overlay">{error}</div>}
        {isFullscreen && (
          <button className="close-fullscreen" onClick={toggleFullscreen}>
            ×
          </button>
        )}
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