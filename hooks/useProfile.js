import { useState, useEffect } from 'react';

export default function useProfile() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      setError(null);
      try {
        const res = await fetch('/api/auth/profile');
        const data = await res.json();
        setProfile(data);
      } catch (e) {
        setError(e);
      }
      setIsLoading(false);
    }

    fetchProfile();
  }, [setProfile, setIsLoading, setError]);

  return { profile, isLoading, error };
}
