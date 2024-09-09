import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

const categories = [
  { id: 1, name: '日常' },
  { id: 2, name: '街拍' },
  { id: 3, name: 'Cosplay' },
  { id: 4, name: 'JK' },
  { id: 5, name: '摆姿' },
  { id: 6, name: '人像' },
  { id: 7, name: '汉服' },
  { id: 8, name: '和服' },
  { id: 9, name: '徒步' },
];

const BUILD_VERSION = 'v103562';
function HomePage() {
  return (
    <div className="home-page">
      <p>选择一个类别开始：</p>
      <div className="category-grid">
        {categories.map(category => (
          <Link key={category.id} to={`/category/${category.id}`} className="category-item">
            {category.name}
          </Link>
        ))}
      </div>
      <div className="version-info">
        Build: {BUILD_VERSION}
      </div>
    </div>
  );
}

export default HomePage;
