// src/services/imageService.js

let cachedUrls = {};
let preloadedImages = {};

const logError = (message, error) => {
  console.error(message, error);
  // 这里可以添加更复杂的日志记录逻辑，如发送到服务器
};

const preloadImage = (url) => {
  if (!preloadedImages[url]) {
    preloadedImages[url] = new Image();
    preloadedImages[url].src = url;
  }
};

const fetchWithRetry = async (url, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒后重试
    }
  }
};

const fetchImageUrls = async (categoryId) => {
  if (cachedUrls[categoryId]) {
    return cachedUrls[categoryId];
  }
  
  try {
    const response = await fetchWithRetry(`/category${categoryId}.txt`);
    const text = await response.text();
    const urls = text.split('\n').filter(url => url.trim() !== '');
    cachedUrls[categoryId] = urls;
    return urls;
  } catch (error) {
    logError(`Error fetching image URLs for category ${categoryId}:`, error);
    return [];
  }
};

export const getRandomImageForCategory = async (categoryId) => {
  try {
    const urls = await fetchImageUrls(categoryId);
    if (urls.length === 0) {
      logError(`No images found for category ${categoryId}`, new Error('Empty image list'));
      return null;
    }

    const randomIndex = Math.floor(Math.random() * urls.length);
    const selectedUrl = urls[randomIndex];

    // 预加载下一张图片
    const nextIndex = (randomIndex + 1) % urls.length;
    preloadImage(urls[nextIndex]);

    // 预加载选中的图片（如果还没有预加载）
    preloadImage(selectedUrl);

    return selectedUrl;
  } catch (error) {
    logError(`Error getting random image for category ${categoryId}:`, error);
    return null;
  }
};

// 可选：提供一个方法来预加载某个类别的所有图片
export const preloadCategoryImages = async (categoryId) => {
  try {
    const urls = await fetchImageUrls(categoryId);
    urls.forEach(preloadImage);
  } catch (error) {
    logError(`Error preloading images for category ${categoryId}:`, error);
  }
};

// 可选：提供一个方法来清除缓存
export const clearCache = () => {
  cachedUrls = {};
  preloadedImages = {};
};