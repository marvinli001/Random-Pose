import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import CategoryPage from './components/CategoryPage';
import Navigation from './components/Navigation';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <h1 className="app-title">随机拍照姿势</h1>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:id" element={
            <>
              <Navigation />
              <CategoryPage />
            </>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;