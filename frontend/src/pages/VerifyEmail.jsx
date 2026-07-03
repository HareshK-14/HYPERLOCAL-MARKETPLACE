import { useEffect, useState, useRef } from 'react';
import API_BASE_URL from '../config/api';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('Verifying your email...');
  const hasFetched = useRef(false);

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
        </div>

        <div>
          <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
            {status === 'loading' ? 'Verifying Email' : status === 'success' ? 'Verification Complete!' : 'Verification Failed'}
          </h2>
          <p className="mt-3 text-base text-gray-600">
            {message}
          </p>
        </div>

        {status !== 'loading' && (
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
