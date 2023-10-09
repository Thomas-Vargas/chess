import { useEffect, useState } from 'react';
import { supabaseClient } from '../config/supabaseClient';

const useUserData = (userId) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data, error } = await supabaseClient
          .from('user_data')
          .select('*')
          .eq('userID', userId);

        if (error) {
          console.error('Error fetching user data:', error);
        } else {
          setUserData(data[0]);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  return userData;
};

export default useUserData;