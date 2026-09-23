import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PostListPage from './pages/PostListPage';
import PostDetailPage from './pages/PostDetailPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#FAF9F5] text-[#2D312E] antialiased">
        <Routes>
          <Route path="/" element={<PostListPage />} />
          <Route path="/posts/:slug" element={<PostDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}
