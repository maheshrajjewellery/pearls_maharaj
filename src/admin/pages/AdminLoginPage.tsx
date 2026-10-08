import React, { useEffect } from 'react';

export const AdminLoginPage: React.FC = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', '/login');
    }
  }, []);

  return null;
};
