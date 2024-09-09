import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getImagesForCategory } from '../src/services/imageService';
import ImagePreloader from './ImagePreloader';
import '../../styles/CategoryPage.css';

function CategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState('');
  const [nextImage, setNextImage] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState([]);

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      try {
        const fetchedImages = await getImagesForCategory(id);
        setImages(fetchedImages);
        if (fetchedImages.length > 0) {
          setCurrentImage(fetchedImages[0]);
          setPreloadedImages(fetchedImages.slice(1));
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Failed to load images:', error);
      } finally {
        setLoading(false);
      }
    };
    loadImages();
  }, [id, navigate]);

  const getRandomImage = useCallback(() => {
    if (images.length > 0) {
      let newImage;
      do {
        const randomIndex = Math.floor(Math.random() * images.length);
        newImage = images[randomIndex];
      } while (newImage === currentImage && images.length > 1);

      setNextImage(newImage);
      setTransitioning(true);
      setTimeout(() => {
        setCurrentImage(newImage);
        setNextImage('');
        setTransitioning(false);
        
        const remainingImages = images.filter(img => img !== newImage && img !== currentImage);
        setPreloadedImages(remainingImages);
      }, 500);
    }
  }, [images, currentImage]);

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
      <div className="image-container">
        <img
          src={currentImage}
          alt="Current Pose"
          className={`image ${transitioning ? 'fade-out' : ''}`}
        />
        {nextImage && (
          <img
            src={nextImage}
            alt="Next Pose"
            className={`image next-image ${transitioning ? 'fade-in' : ''}`}
          />
        )}
      </div>
      <button onClick={getRandomImage} className="random-button" disabled={transitioning}>
        随机姿势
      </button>
      <ImagePreloader imageUrls={preloadedImages} />
    </div>
  );
}

export default CategoryPage;