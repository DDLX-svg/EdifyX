
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import Home from './components/Home.tsx';
import Practice from './components/Practice.tsx';
import AnatomyQuiz from './components/AnatomyQuiz.tsx';
import MedicalQuiz from './components/MedicalQuiz.tsx';
import Admin from './components/Admin.tsx';
import Documents from './components/Documents.tsx';
import Articles from './components/Articles.tsx';
import SubmitArticle from './components/SubmitArticle.tsx';
import ArticleDetail from './components/ArticleDetail.tsx';
import Login from './components/Login.tsx';
import Register from './components/Register.tsx';
import VerifyEmail from './components/VerifyEmail.tsx';
import Leaderboard from './components/Leaderboard.tsx';
import ChallengeQuiz from './components/ChallengeQuiz.tsx';
import Profile from './components/Profile.tsx';
import Guide from './components/Guide.tsx';
import Publications from './components/Publications.tsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.tsx';
import { ToastProvider } from './contexts/ToastContext.tsx';

const AppContent: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">Đang tải ứng dụng...</div>
      </div>
    );
  }

  const canAccessAdmin = currentUser && (currentUser['Danh hiệu'] === 'Admin' || currentUser['Danh hiệu'] === 'Developer');

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          
          {/* Publicly Accessible Routes */}
          <Route path="/documents" element={<Documents />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/guide" element={<Guide />} />

          {/* Protected Routes */}
           <Route 
            path="/articles" 
            element={currentUser ? <Articles /> : <Navigate to="/login" />} 
          />
           <Route 
            path="/articles/submit" 
            element={currentUser ? <SubmitArticle /> : <Navigate to="/login" />} 
          />
           <Route 
            path="/article/:id" 
            element={currentUser ? <ArticleDetail /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/practice" 
            element={currentUser ? <Practice /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/practice/anatomy-station" 
            element={currentUser ? <AnatomyQuiz /> : <Navigate to="/login" />} 
          />
           <Route 
            path="/medical-quiz/:specialty" 
            element={currentUser ? <MedicalQuiz /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/challenge-quiz" 
            element={currentUser ? <ChallengeQuiz /> : <Navigate to="/login" />} 
          />
           <Route 
            path="/profile/:email" 
            element={currentUser ? <Profile /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/publications" 
            element={currentUser ? <Publications /> : <Navigate to="/login" />} 
          />
          <Route
            path="/admin"
            element={canAccessAdmin ? <Admin /> : <Navigate to="/login" />}
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};


const App: React.FC = () => {
  return (
    <HashRouter>
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </HashRouter>
  );
};

export default App;
