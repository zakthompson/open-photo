import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function useSetup() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      setErrors(null);
      try {
        const res = await fetch('/api/auth/setup');
        if (res.status === 401) {
          router.replace('/api/auth/login');
        } else {
          const data = await res.json();
          if (!data._id) {
            setErrors(data);
          } else {
            setUser(data);
          }
        }
      } catch (e) {
        setErrors(e);
      }
      setIsLoading(false);
    }

    fetchUser();
  }, [router, setUser, setIsLoading, setErrors]);

  return { user, isLoading, errors };
}
