// src/pages/Leaderboard.tsx
import React, { useState, useEffect } from 'react'
import { auth, db } from '../firebase'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'

interface UserData {
  uid: string
  displayName?: string
  points: number
}

export default function Leaderboard() {
  const [topUsers, setTopUsers] = useState<UserData[]>([])
  const [userRank, setUserRank] = useState<number | null>(null)
  const [userPoints, setUserPoints] = useState<number>(0)

  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(collection(db, 'users'), orderBy('points', 'desc'))
      const snapshot = await getDocs(q)
      const users = snapshot.docs.map(doc => {
        const data = doc.data();
        const teamName = (data.teamName as string || '').trim();
        let displayName = '';
        if (teamName) {
          displayName = teamName;
        } else {
          const firstName = (data.firstName as string || '').trim();
          const fallbackName = (data.name as string || '').trim();
          // Sons names array
          const sons = (data.sons as string[] || []).map(s => s.trim()).filter(s => s);
          const allNames = firstName ? [firstName, ...sons] : (fallbackName ? [fallbackName] : []);
          if (allNames.length === 0) {
            displayName = '';
          } else if (allNames.length === 1) {
            displayName = allNames[0];
          } else if (allNames.length === 2) {
            displayName = `${allNames[0]} and ${allNames[1]}`;
          } else {
            const head = allNames.slice(0, -1).join(', ');
            const last = allNames[allNames.length - 1];
            displayName = `${head}, and ${last}`;
          }
        }
        // Default fallback if no name could be constructed
        if (!displayName) {
          displayName = 'Unnamed user';
        }
        const points = data.points as number || 0;
        return {
          uid: doc.id,
          displayName,
          points,
        };
      });
      setTopUsers(users.slice(0, 10))
      const current = auth.currentUser
      if (current) {
        const all = users
        const idx = all.findIndex(u => u.uid === current.uid)
        if (idx !== -1) {
          setUserRank(idx + 1)
          setUserPoints(all[idx].points)
        }
      }
    }
    fetchUsers()
  }, [])

  return (
    <div style={{ overflowX: 'hidden' }}>
      <style>{`
        body, html, #root {
          margin: 0 !important;
          padding: 0 !important;
        }
      `}</style>
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#F2F2F7',
          padding: '4.5rem 1rem 1rem',
          fontFamily: 'Inter, ui-sans-serif, system-ui, Arial, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
      {/* User Tile */}
      <div
        style={{
          width: '385px',
          boxSizing: 'border-box',
          backgroundColor: '#FFFFFF',
          borderRadius: '1rem',
          padding: '1rem 0',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          margin: '0 auto 1rem',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '1.25rem', color: '#666666', marginBottom: '0.5rem' }}>
          Your Rank
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0047BA' }}>
          {userRank ?? '-'}
        </div>
        <div style={{ fontSize: '1rem', color: '#666666', marginTop: '0.5rem' }}>
          Points: <span style={{ fontWeight: 'bold', color: '#0047BA' }}>{userPoints}</span>
        </div>
      </div>

      {/* Top 10 List */}
      <div
        style={{
          width: '385px',
          boxSizing: 'border-box',
          margin: '0 auto',
          backgroundColor: '#FFFFFF',
          borderRadius: '1rem',
          padding: '0.5rem 0',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        }}
      >
        {topUsers.map((user, i) => {
          const isCurrentUser = auth.currentUser?.uid === user.uid;
          return (
            <div
              key={user.uid}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderBottom: i < topUsers.length - 1 ? '1px solid #E5E5EA' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    width: '1.5rem',
                    fontWeight: isCurrentUser ? 'bold' : 'normal',
                    color: isCurrentUser ? '#0047BA' : '#0047BA',
                    marginRight: '0.75rem',
                    textAlign: 'center',
                  }}
                >
                  {i + 1}
                </div>
                <div
                  style={{
                    fontSize: '1rem',
                    color: isCurrentUser ? '#0047BA' : '#333333',
                    fontWeight: isCurrentUser ? 'bold' : 'normal',
                  }}
                >
                  {user.displayName || 'Unnamed user'}
                </div>
              </div>
              <div
                style={{
                  fontSize: '1rem',
                  color: isCurrentUser ? '#0047BA' : '#333333',
                  fontWeight: isCurrentUser ? 'bold' : 'normal',
                }}
              >
                {user.points}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  </div>
  )
}