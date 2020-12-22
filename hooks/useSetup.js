import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '../context/userContext';

export default function useSetup() {
  const router = useRouter();
  const { state, actions } = useContext(UserContext);
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
            actions.setUser(data);
            if (!data.name) {
              router.replace('/name');
            }
          }
        }
      } catch (e) {
        setErrors(e);
      }
      setIsLoading(false);
    }

    if (!state.user) {
      fetchUser();
    }
  }, [state, actions, router, setIsLoading, setErrors]);

  return { isLoading, errors };
}
