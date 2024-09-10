import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeBranch } from '@fortawesome/free-solid-svg-icons';

const categories = [
  { id: 1, name: '日常' },
  { id: 2, name: '街拍' },
  { id: 3, name: 'Cosplay' },
  { id: 4, name: 'JK' },
  { id: 5, name: '摆姿' },
  { id: 6, name: '汉服' },
  { id: 7, name: '和服' },
  { id: 8, name: '徒步' },
];

const BUILD_VERSION = '60d809b';
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
        BuildVersion: <FontAwesomeIcon icon={faCodeBranch} /> {BUILD_VERSION}
      </div>
    </div>
  );
}

export default HomePage;
