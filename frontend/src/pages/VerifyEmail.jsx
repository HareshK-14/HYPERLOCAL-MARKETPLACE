import { useEffect, useState, useRef } from 'react';
import API_BASE_URL from '../config/api';
import { useParams, Link, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, ArrowRight, KeyRound, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

const VerifyEmail = () => {
  const { token } = useParams();
  const location = useLocation();
  const [status, setStatus] = useState(token ? 'loading' : 'idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState(token ? 'Verifying your email...' : '');
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpInputsRef = useRef([]);
  const hasFetched = useRef(false);

  // Automatic verification if token is present in URL
  useEffect(() => {
    if (!token || hasFetched.current) return;
    hasFetched.current = true;

    const verifyEmail = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/verify-email/${token}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Verification failed.');
        }

        setStatus('success');
        setMessage(data.message || 'Email verified successfully! You can now log in.');
      } catch (err) {
        setStatus('error');
        setMessage(err.message);
      }
    };

    verifyEmail();
  }, [token]);

  // Handle OTP digit input
  const handleOtpChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, ''); // only allow numbers
    if (!value) {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }

    const newOtp = [...otp];
    // If user pasted a 6-digit code
    if (value.length > 1) {
      const pastedCode = value.substring(0, 6).split('');
      pastedCode.forEach((char, idx) => {
        if (newOtp[idx] !== undefined) {
          newOtp[idx] = char;
        }
      });
      setOtp(newOtp);
      // Focus last input or length of pasted code
      const focusIndex = Math.min(pastedCode.length - 1, 5);
      otpInputsRef.current[focusIndex]?.focus();
      return;
    }

    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value entered
    if (value !== '' && index < 5) {
      otpInputsRef.current[index + 1].focus();
    }
  };

  // Handle Backspace
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        // Empty box backspace -> move focus to previous box and clear it
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        otpInputsRef.current[index - 1].focus();
      } else {
        // Clear current box
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  // Submit OTP Verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setStatus('error');
      setMessage('Please enter a complete 6-digit verification code.');
      return;
    }
    if (!email) {
      setStatus('error');
      setMessage('Please enter your email address.');
      return;
    }

    setStatus('loading');
    setMessage('Verifying your code...');

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'OTP verification failed.');
      }

      setStatus('success');
      setMessage(data.message || 'Email verified successfully! You can now log in.');
    } catch (err) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl shadow-blue-500/5 border border-gray-100 text-center"
      >
        <div className="flex justify-center">
          {status === 'loading' && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            >
              <Loader className="h-16 w-16 text-primary" />
            </motion.div>
          )}
          {status === 'success' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            >
              <CheckCircle className="h-16 w-16 text-green-500" />
            </motion.div>
          )}
          {status === 'error' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            >
              <XCircle className="h-16 w-16 text-red-500" />
            </motion.div>
          )}
          {status === 'idle' && (
            <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center text-primary">
              <KeyRound className="h-8 w-8" />
            </div>
          )}
        </div>

        <div>
          <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
            {status === 'loading' 
              ? 'Verifying...' 
              : status === 'success' 
                ? 'Verification Complete!' 
                : status === 'error' && !token
                  ? 'Verification Failed'
                  : 'Enter Verification Code'}
          </h2>
          <p className="mt-3 text-base text-gray-600">
            {status === 'idle' || (status === 'error' && !token)
              ? 'Please enter the 6-digit OTP code sent to your email to verify your account.'
              : message}
          </p>
        </div>

        {/* OTP Input Form */}
        {(status === 'idle' || (status === 'error' && !token)) && (
          <form onSubmit={handleVerifyOtp} className="mt-8 space-y-6">
            <div className="space-y-4 text-left">
              {/* Email Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-xl relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm bg-gray-50"
                />
              </div>

              {/* Six Digits */}
              <div className="flex justify-between gap-2 mt-4">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="6"
                    ref={(el) => (otpInputsRef.current[index] = el)}
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50"
                  />
                ))}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="inline-flex justify-center items-center gap-2 w-full py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-blue-500/30 transition"
              >
                Verify Code <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        )}

        {status === 'error' && token && (
          <div className="pt-6">
            <Link 
              to="/verify-otp"
              onClick={() => setStatus('idle')}
              className="inline-flex justify-center items-center gap-2 w-full py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-blue-500/30 transition"
            >
              Verify using OTP code <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {status === 'success' && (
          <div className="pt-6">
            <Link 
              to="/login"
              className="inline-flex justify-center items-center gap-2 w-full py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-blue-500/30 transition"
            >
              Continue to Login <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
