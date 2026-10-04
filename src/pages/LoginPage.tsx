import React, { useState, useEffect, useCallback } from 'react';
import { Eye, EyeOff, ShieldCheck, AlertCircle, Loader2, LogOut, CheckCircle2, ArrowRight } from 'lucide-react';
import { useShop, UserProfile } from '@/context/ShopContext';
import { useAdmin } from '@/admin/context/AdminContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function LoginPage() {
  const { setCurrentPage, user, setUserProfile, logoutUser } = useShop();
  const { login } = useAdmin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-redirect authenticated customers visiting /login directly to /dashboard
  useEffect(() => {
    if (user && !user.email.toLowerCase().includes('admin')) {
      console.log('[AUTH] User is already authenticated. Redirecting from /login to /dashboard...');
      setCurrentPage('dashboard');
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', '/dashboard');
      }
    }
  }, [user, setCurrentPage]);

  // Helper to handle successful user session (Google OAuth or Email/Password)
  const handleAuthSuccess = useCallback(
    (profile: UserProfile) => {
      console.log('[AUTH] Authentication succeeded for user:', profile.email);
      let finalProfile: UserProfile = profile;

      // Customer retrieval & profile persistence logic
      if (typeof window !== 'undefined') {
        try {
          const registeredUsersStr = localStorage.getItem('maharaj_registered_users');
          let registeredUsers: UserProfile[] = registeredUsersStr ? JSON.parse(registeredUsersStr) : [];

          const existingIndex = registeredUsers.findIndex(
            (u) => u.email.toLowerCase() === profile.email.toLowerCase()
          );

          if (existingIndex >= 0) {
            console.log('[AUTH] Existing customer profile found in records:', registeredUsers[existingIndex]);
            const existingUser = registeredUsers[existingIndex];
            finalProfile = {
              ...existingUser,
              ...profile,
              name: profile.name || existingUser.name,
              avatarUrl: profile.avatarUrl || existingUser.avatarUrl,
            };
            registeredUsers[existingIndex] = finalProfile;
          } else {
            console.log('[AUTH] Creating new customer profile for:', profile.email);
            registeredUsers.push(finalProfile);
          }
          localStorage.setItem('maharaj_registered_users', JSON.stringify(registeredUsers));
        } catch (err) {
          console.error('[AUTH] Error reading/saving customer profile:', err);
        }
      }

      setUserProfile(finalProfile);
      setMsg(`Signing you in as ${finalProfile.name}...`);
      setErrMsg('');

      const isEmailAdmin =
        finalProfile.email.toLowerCase().includes('admin') ||
        finalProfile.email.toLowerCase() === 'admin@maharajjewellery.com';

      setTimeout(() => {
        if (isEmailAdmin) {
          console.log('[AUTH] Admin account detected. Redirecting to Executive Admin Portal...');
          login(finalProfile.email, 'session');
          setCurrentPage('admin');
          if (typeof window !== 'undefined') {
            window.history.pushState({}, '', '/admin');
          }
        } else {
          console.log('[AUTH] Redirecting customer to /dashboard...');
          setCurrentPage('dashboard');
          if (typeof window !== 'undefined') {
            window.history.pushState({}, '', '/dashboard');
          }
        }
      }, 500);
    },
    [login, setCurrentPage, setUserProfile]
  );

  // Check for OAuth errors in URL hash/query on page load
  useEffect(() => {
    let isMounted = true;

    const checkOAuthError = () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const queryParams = new URLSearchParams(window.location.search);
      const errorDesc =
        hashParams.get('error_description') ||
        queryParams.get('error_description') ||
        hashParams.get('error') ||
        queryParams.get('error');

      if (errorDesc) {
        console.warn('[AUTH] OAuth Callback Error:', errorDesc);
        if (isMounted) {
          setErrMsg(`Unable to sign in with Google. ${decodeURIComponent(errorDesc.replace(/\+/g, ' '))}`);
          setIsGoogleLoading(false);
        }
        if (typeof window !== 'undefined') {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };

    checkOAuthError();

    return () => {
      isMounted = false;
    };
  }, []);

  // Initiate real Google OAuth authentication
  const handleGoogleLogin = async () => {
    console.log('[AUTH DEBUG] Google login started');
    const redirectUrl = `${window.location.origin}/auth/callback`;
    console.log('[AUTH DEBUG] redirectTo =', redirectUrl);
    setMsg('');
    setErrMsg('');
    setIsGoogleLoading(true);

    try {
      if (isSupabaseConfigured()) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectUrl,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            },
          },
        });

        if (error) {
          throw error;
        }
      } else {
        setErrMsg('Google OAuth service is missing configuration variables.');
        setIsGoogleLoading(false);
      }
    } catch (err: any) {
      console.error('[AUTH DEBUG] Google OAuth error:', err);
      setErrMsg(err?.message || 'Unable to sign in with Google. Please try again.');
      setIsGoogleLoading(false);
    }
  };

  // Handle Email & Password Sign In
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[AUTH] Email/Password Sign-In form submitted:', email);
    setMsg('');
    setErrMsg('');

    if (!email || !password) {
      setErrMsg('Please enter both email address and password.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const isEmailAdmin =
          email.toLowerCase().includes('admin') || email.toLowerCase() === 'admin@maharajjewellery.com';

        if (isEmailAdmin) {
          console.log('[AUTH] Admin credentials submitted');
          login(email, password);
          setIsSubmitting(false);
          setCurrentPage('admin');
          if (typeof window !== 'undefined') {
            window.history.pushState({}, '', '/admin');
          }
        } else {
          let existingProfile: UserProfile | undefined;
          if (typeof window !== 'undefined') {
            try {
              const registeredUsersStr = localStorage.getItem('maharaj_registered_users');
              if (registeredUsersStr) {
                const registeredUsers: UserProfile[] = JSON.parse(registeredUsersStr);
                existingProfile = registeredUsers.find(
                  (u) => u.email.toLowerCase() === email.toLowerCase()
                );
              }
            } catch {}
          }

          const customerProfile: UserProfile = existingProfile || {
            id: `user_${Date.now()}`,
            name: email.split('@')[0],
            email: email,
            provider: 'email',
          };

          handleAuthSuccess(customerProfile);
          setIsSubmitting(false);
        }
      } catch (err: any) {
        setIsSubmitting(false);
        console.error('[AUTH] Sign-in exception:', err);
        setErrMsg('Unable to sign in. Please try again.');
      }
    }, 400);
  };

  const handleAdminDirectLogin = () => {
    console.log('[AUTH] Accessing Executive Admin Portal directly');
    login('admin@maharajjewellery.com', 'maharaj123');
    setCurrentPage('admin');
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', '/admin');
    }
  };

  return (
    <div className="min-h-[calc(100vh-90px)] w-full bg-[#F7F3EB] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-[420px] space-y-7 text-center bg-[#FFFDF8] p-8 border border-[#171310]/15 shadow-xl">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-wide text-[#171310]">
            Welcome Back
          </h1>
          <p className="font-sans text-sm tracking-wide text-[#171310]/70 font-light">
            Sign in to your Maharaj Jewellery account or Admin Portal.
          </p>
        </div>

        {/* Currently Logged In Account Display */}
        {user && !msg && !errMsg && (
          <div className="p-4 bg-[#FAF7F2] border border-[#C5A15A]/30 text-left space-y-3">
            <div className="flex items-center gap-3">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover border border-[#C5A15A]"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#C5A15A] text-[#FFFDF8] flex items-center justify-center font-bold text-sm uppercase">
                  {user.name.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-sans text-xs font-semibold text-[#171310] truncate">
                  {user.name}
                </p>
                <p className="font-sans text-[11px] text-[#171310]/60 truncate">{user.email}</p>
              </div>
              <button
                type="button"
                onClick={logoutUser}
                className="p-1.5 text-[#171310]/50 hover:text-rose-600 transition-colors"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#171310]/10">
              <p className="font-sans text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                <CheckCircle2 size={13} /> Active Session ({user.provider === 'google' ? 'Google' : 'Email'})
              </p>
              <button
                type="button"
                onClick={() => {
                  setCurrentPage('dashboard');
                  if (typeof window !== 'undefined') window.history.pushState({}, '', '/dashboard');
                }}
                className="font-sans text-xs font-semibold text-[#C5A15A] hover:underline flex items-center gap-1"
              >
                <span>Dashboard</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        )}

        {/* Notifications / Alerts */}
        {msg && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-medium text-left flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{msg}</span>
          </div>
        )}

        {errMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-300 text-rose-900 text-xs font-medium text-left flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errMsg}</span>
          </div>
        )}

        {/* Google Authentication Section */}
        <div className="space-y-5 pt-1">
          {/* Continue with Google Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isSubmitting}
            className="w-full py-3.5 px-4 bg-white border border-[#171310]/20 rounded-md shadow-sm font-sans text-xs sm:text-sm font-medium text-[#171310] hover:bg-[#FAF7F2] hover:border-[#171310]/40 transition-all duration-200 flex items-center justify-center gap-3 focus:outline-none focus:ring-2 focus:ring-[#C5A15A]/50 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isGoogleLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-[#C5A15A]" />
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                {/* Official Google "G" Logo */}
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Divider: OR */}
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-[#171310]/15 w-full"></div>
            <span className="bg-[#FFFDF8] px-4 font-sans text-xs tracking-widest text-[#171310]/50 font-medium uppercase shrink-0">
              OR
            </span>
            <div className="border-t border-[#171310]/15 w-full"></div>
          </div>
        </div>

        {/* Existing Email/Password Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {/* Email Address Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block font-sans text-xs font-medium uppercase tracking-[0.15em] text-[#171310]/80"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-[#FAF7F2] border border-[#171310]/15 rounded-none font-sans text-sm text-[#171310] placeholder-[#171310]/35 focus:outline-none focus:border-[#C5A15A] focus:ring-1 focus:ring-[#C5A15A] transition-colors duration-200"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block font-sans text-xs font-medium uppercase tracking-[0.15em] text-[#171310]/80"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-4 pr-11 py-3 bg-[#FAF7F2] border border-[#171310]/15 rounded-none font-sans text-sm text-[#171310] placeholder-[#171310]/35 focus:outline-none focus:border-[#C5A15A] focus:ring-1 focus:ring-[#C5A15A] transition-colors duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#171310]/50 hover:text-[#C5A15A] focus:outline-none transition-colors duration-200"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={1.5} />
                ) : (
                  <Eye size={18} strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>

          {/* Main Button: SIGN IN */}
          <button
            type="submit"
            disabled={isSubmitting || isGoogleLoading}
            className="w-full mt-2 py-3.5 px-6 bg-[#171310] text-[#F7F3EB] font-sans text-xs font-semibold tracking-[0.2em] uppercase hover:bg-[#C5A15A] transition-colors duration-300 focus:outline-none active:scale-[0.99] rounded-none disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#C5A15A]" />
                <span>Signing you in...</span>
              </>
            ) : (
              <span>SIGN IN</span>
            )}
          </button>
        </form>

        {/* ADMIN DIRECT BUTTON */}
        <div className="pt-4 border-t border-[#171310]/10">
          <button
            type="button"
            onClick={handleAdminDirectLogin}
            className="w-full py-3 px-4 bg-[#F5F1EB] border border-[#C5A15A]/50 text-[#171310] font-sans text-xs font-semibold tracking-[0.15em] uppercase hover:bg-[#C5A15A] hover:text-[#171310] transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-[#C5A15A]" />
            <span>Access Executive Admin Portal</span>
          </button>
        </div>
      </div>
    </div>
  );
}
