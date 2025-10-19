'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { LockClosedIcon, UserIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { authService } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log('🔐 Iniciando login...');

    try {
      console.log('📡 Llamando a authService.login...');
      const data = await authService.login(username, password);
      console.log('✅ Login response:', data);

      // Save token FIRST so it's available for the next request
      console.log('💾 Guardando token en localStorage...');
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', data.access_token);
      }
      document.cookie = `token=${data.access_token}; path=/; max-age=${30 * 24 * 60 * 60}`; // 30 days

      console.log('📡 Obteniendo usuario actual...');
      const user = await authService.getCurrentUser();
      console.log('✅ User data:', user);

      // Update Zustand store
      console.log('💾 Actualizando store...');
      login(data.access_token, user);

      console.log('✅ Login completado, redirigiendo...');
      toast.success('ログインに成功しました');

      setTimeout(() => {
        router.push('/dashboard');
      }, 100);
    } catch (error: any) {
      console.error('❌ Error en login:', error);
      console.error('❌ Error response:', error.response);
      toast.error(error.response?.data?.detail || 'ユーザー名またはパスワードが正しくありません');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-500">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-32 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute -bottom-40 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative max-w-md w-full">
        {/* Logo with Glow Effect */}
        <div className="flex justify-center mb-10">
          <div className="relative group">
            <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-purple-600 via-purple-700 to-pink-500 blur-2xl opacity-75 group-hover:opacity-100 transition duration-500" />
            <div className="relative w-32 h-32 bg-white rounded-full flex items-center justify-center transform transition-all duration-500 hover:scale-110 shadow-2xl">
              <div className="w-28 h-28 flex items-center justify-center font-bold text-4xl bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                UNS
              </div>
            </div>
          </div>
        </div>

        {/* Title with Gradient */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-200 via-purple-100 to-pink-200 bg-clip-text text-transparent mb-3">
            UNS-ClaudeJP 3.0
          </h1>
          <p className="text-lg font-medium text-white drop-shadow-lg">
            人材管理インテリジェンスプラットフォーム
          </p>
        </div>

        {/* Glass Login Card */}
        <div className="backdrop-blur-xl bg-white/90 rounded-2xl shadow-2xl p-10 hover:scale-105 transition-all duration-300">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              ログイン
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              アカウント情報を入力してください
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                ユーザー名
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="ユーザー名を入力"
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                パスワード
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="パスワードを入力"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="remember-me" className="ml-2 text-gray-700">
                  ログイン状態を保持
                </label>
              </div>
              <a href="#" className="font-semibold text-purple-600 hover:text-purple-700 transition">
                パスワードを忘れた場合
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  ログイン中...
                </span>
              ) : (
                'ログイン'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg border-2 border-amber-200">
            <p className="text-sm font-semibold text-amber-900 flex items-center gap-2 mb-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              デモアカウント
            </p>
            <div className="space-y-1">
              <p className="text-xs font-medium text-amber-900">
                ユーザー名: <span className="font-mono font-bold">admin</span>
              </p>
              <p className="text-xs font-medium text-amber-900">
                パスワード: <span className="font-mono font-bold">admin123</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-white drop-shadow-md">
            © 2025 UNS企画. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
