import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PostList from './pages/posts/PostList';
import PostDetail from './pages/posts/PostDetail';
import PostForm from './pages/posts/PostForm';
import PrivateRoute from './components/PrivateRoute';

function App() {
  useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/posts" element={<PostList />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route
            path="/posts/new"
            element={
              <PrivateRoute>
                <PostForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/posts/:id/edit"
            element={
              <PrivateRoute>
                <PostForm />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;