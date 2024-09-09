import React, { useEffect } from 'react';

function ImagePreloader({ imageUrls }) {
  useEffect(() => {
    imageUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [imageUrls]);

  return null;
}

export default ImagePreloader;
