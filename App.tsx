import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Practice from './components/Practice';
import AnatomyQuiz from './components/AnatomyQuiz';
import MedicalQuiz from './components/MedicalQuiz';
import Admin from './components/Admin';
import Documents from './components/Documents';
import Articles from './components/Articles';
import SubmitArticle from './components/SubmitArticle';
import ArticleDetail from './components/ArticleDetail';
import Login from './components/Login';
import Register from './components/Register';
import VerifyEmail from './components/VerifyEmail';
import Leaderboard from './components/Leaderboard';
import ChallengeQuiz from './components/ChallengeQuiz';
import Profile from './components/Profile';
import Guide from './components/Guide';
import { AuthProvider, useAuth } from './contexts/AuthContext';

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
          
          {/* Protected Routes */}
          <Route 
            path="/documents" 
            element={currentUser ? <Documents /> : <Navigate to="/login" />} 
          />
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
            path="/leaderboard" 
            element={currentUser ? <Leaderboard /> : <Navigate to="/login" />} 
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
            path="/guide" 
            element={currentUser ? <Guide /> : <Navigate to="/login" />} 
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
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HashRouter>
  );
};

export default App;