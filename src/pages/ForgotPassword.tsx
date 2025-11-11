import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import { FORGOT_PASSWORD } from '../services/userQueries';
import { BookOpenIcon, AlertCircleIcon, CheckCircleIcon, ArrowLeftIcon } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [forgotPassword, { loading }] = useMutation<{ forgot_password: boolean }>(FORGOT_PASSWORD);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    try {
      await forgotPassword({
        variables: { email },
      });
      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7B8A1] to-[#E87968] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg">
            <BookOpenIcon size={32} className="text-[#E87968]" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">WellRead</h1>
          <p className="text-white/90 text-sm">Reset your password</p>
        </div>

        {/* Forgot Password Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#E87968] mb-6 transition-colors"
          >
            <ArrowLeftIcon size={16} />
            <span className="text-sm font-medium">Back to login</span>
          </Link>

          <h2 className="text-2xl font-bold text-[#333333] mb-2">Forgot Password?</h2>
          <p className="text-gray-600 text-sm mb-6">
            No worries! Enter your email address and we'll send you instructions to reset your password.
          </p>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircleIcon size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircleIcon size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-green-700 font-semibold mb-1">Email sent!</p>
                <p className="text-sm text-green-600">
                  Check your inbox for password reset instructions. If you don't see it, check your spam folder.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-semibold text-[#333333] mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E87968] focus:border-transparent transition-all"
                placeholder="you@example.com"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#F7B8A1] to-[#E87968] text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link to="/login" className="text-[#E87968] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-white/80 text-xs">
            Reset link will be valid for 1 hour
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
