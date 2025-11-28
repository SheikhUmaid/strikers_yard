// useSports.js
import { useState, useEffect } from 'react';
import { fetchSports } from '../services/api'; 

export function useSports() {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSports()
      .then((response) => {
        setSports(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch sports:', err);
        setError('Failed to load sports');
        setLoading(false);
      });
  }, []);

  return { sports, loading, error };
}
