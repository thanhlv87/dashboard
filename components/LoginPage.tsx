import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/user-not-found') {
        setError('Không tìm thấy tài khoản với email này');
      } else if (err.code === 'auth/wrong-password') {
        setError('Mật khẩu không đúng');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email không hợp lệ');
      } else {
        setError('Đăng nhập thất bại. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background-dark">
      <div className="w-full max-w-md p-8">
        <div className="bg-surface border border-border-color rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="size-16 text-primary">
              <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z"></path>
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white text-center mb-2">
            Quản Lý Tổng Hợp
          </h1>
          <p className="text-text-muted text-center mb-8">
            Đăng nhập để tiếp tục
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-red-400 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 pl-12 rounded-lg bg-surface-light border border-border-color text-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  placeholder="your.email@example.com"
                  disabled={loading}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-muted">
                  email
                </span>
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pl-12 rounded-lg bg-surface-light border border-border-color text-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-muted">
                  lock
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-primary text-background-dark font-bold text-sm hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-muted text-sm">
              Quên mật khẩu?{' '}
              <button className="text-primary hover:underline">
                Khôi phục
              </button>
            </p>
          </div>
        </div>

        <p className="text-text-muted text-center text-sm mt-6">
          Version 1.0.0 • Firebase Powered
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
