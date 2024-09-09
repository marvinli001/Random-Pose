import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../styles/Navigation.css';

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
  // 可以添加更多类别...
];

function Navigation() {
  const { id } = useParams();
  const currentId = parseInt(id, 10);
  const navigate = useNavigate();

  // 获取当前类别和相邻的类别
  const currentIndex = categories.findIndex(cat => cat.id === currentId);
  const displayCategories = categories.slice(Math.max(0, currentIndex - 1), currentIndex + 2);

  return (
    <nav className="category-nav">
      {displayCategories.map((category) => (
        <Link
          key={category.id}
          to={`/category/${category.id}`}
          className={`nav-item ${currentId === category.id ? 'active' : ''}`}
        >
          {category.name}
        </Link>
      ))}
    </nav>
  );
}

export default Navigation;