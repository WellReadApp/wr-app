import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { BookOpenIcon, AlertCircleIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Validation states
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  
  // Password validation
  const passwordHasMinLength = password.length >= 8;
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const passwordsDontMatch = confirmPassword.length > 0 && password !== confirmPassword;
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);
  
  // Form validation
  const isFormValid = 
    email && 
    isEmailValid && 
    password && 
    passwordHasMinLength && 
    confirmPassword && 
    passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      await signup(email, password, firstName || undefined, lastName || undefined);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7B8A1] to-[#E87968] flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg">
            <BookOpenIcon size={32} className="text-[#E87968]" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">WellRead</h1>
          <p className="text-white/90 text-sm">Start your growth journey today</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-[#333333] mb-6">Create Account</h2>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircleIcon size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-[#333333] mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E87968] focus:border-transparent transition-all"
                  placeholder="John"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-[#333333] mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E87968] focus:border-transparent transition-all"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-semibold text-[#333333] mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setEmailTouched(true)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  emailTouched && !isEmailValid && email
                    ? 'border-red-300 focus:ring-red-200'
                    : emailTouched && isEmailValid
                    ? 'border-green-300 focus:ring-green-200'
                    : 'border-gray-200 focus:ring-[#E87968] focus:border-transparent'
                }`}
                placeholder="you@example.com"
                required
              />
              {emailTouched && email && !isEmailValid && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <XCircleIcon size={12} />
                  Please enter a valid email address
                </p>
              )}
              {emailTouched && isEmailValid && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircleIcon size={12} />
                  Valid email
                </p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-semibold text-[#333333] mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setPasswordTouched(true)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  passwordTouched && password && !passwordHasMinLength
                    ? 'border-red-300 focus:ring-red-200'
                    : passwordTouched && passwordHasMinLength
                    ? 'border-green-300 focus:ring-green-200'
                    : 'border-gray-200 focus:ring-[#E87968] focus:border-transparent'
                }`}
                placeholder="••••••••"
                required
              />
              <div className="mt-2 space-y-1">
                <div className={`text-xs flex items-center gap-1 transition-colors ${
                  password.length === 0 
                    ? 'text-gray-500' 
                    : passwordHasMinLength 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {password.length === 0 ? (
                    <span className="w-3 h-3 rounded-full border-2 border-gray-400" />
                  ) : passwordHasMinLength ? (
                    <CheckCircleIcon size={12} />
                  ) : (
                    <XCircleIcon size={12} />
                  )}
                  At least 8 characters
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#333333] mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => setConfirmPasswordTouched(true)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                  confirmPassword && passwordsDontMatch
                    ? 'border-red-300 focus:ring-red-200'
                    : confirmPassword && passwordsMatch
                    ? 'border-green-300 focus:ring-green-200'
                    : 'border-gray-200 focus:ring-[#E87968] focus:border-transparent'
                }`}
                placeholder="••••••••"
                required
              />
              {confirmPassword && passwordsDontMatch && (
                <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <XCircleIcon size={12} />
                  Passwords do not match
                </p>
              )}
              {confirmPassword && passwordsMatch && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircleIcon size={12} />
                  Passwords match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full bg-gradient-to-r from-[#F7B8A1] to-[#E87968] text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-[#E87968] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-white/80 text-xs">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
