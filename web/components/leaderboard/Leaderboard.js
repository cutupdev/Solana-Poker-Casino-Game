'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import client from '../../app/pocketbase/pocketbase';

// style
import Style from './Leaderboard.module.css';

// my components
import LeaderboardMember from './LeaderboardMember';

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
  
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const records = await client.collection('users').getFullList({
          sort: '-score',
        });
        setUsers(records);
        console.log(records);
      } catch (err) {
        // setError('Failed to fetch users. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
  
    useEffect(() => {
      fetchUsers();
  
      return () => {
        client.cancelAllRequests();
      }
    }, []);
  
    return (
      <div className={Style.LeaderboardPage}>
        <p className={Style.LeaderboardTitle}>
          {isLoading ? 'Loading...' : 'PokSol Top Achievers'}
        </p>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        {users.length > 0 && (
          <div className={Style.LeaderboardContainer}>
            {users.map((user, index) => (
              <LeaderboardMember 
                key={user.id} 
                position={index + 1} 
                username={user.username} 
                score={user.score} 
                zeroOrOne={index % 2} 
              />
            ))}
          </div>
        )}
      </div>
    );
    
  };
  
  export default Leaderboard;
