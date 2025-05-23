import React, { useState, useEffect } from 'react'
import MarriottCenterHome from '../assets/MarriottCenterHome.jpg'
import TabBar from '../components/TabBar'
import { db } from '../firebase'
import { collection, getDocs, doc, getDoc } from 'firebase/firestore'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom';

interface Quest {
  id: string;
  photoURL: string;
  title: string;
}

function Home() {
  const [quests, setQuests] = useState<Quest[]>([])
  const [completedIds, setCompletedIds] = useState<string[]>([])

  const navigate = useNavigate();

  const now = new Date();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = daysOfWeek[now.getDay()];
  const hour = now.getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
  const [useDayGreeting] = useState(Math.random() < 0.5);
  const greeting = useDayGreeting ? `Happy ${dayName}!` : `Good ${timeOfDay}!`;

  const forYou = quests.filter(q => !completedIds.includes(q.title));
  const completed = quests.filter(q => completedIds.includes(q.title));

  useEffect(() => {
    (async () => {
      const snapshot = await getDocs(collection(db, 'quests'))
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Quest, 'id'>),
      }))
      setQuests(data)

      // fetch user completed quests
      const user = auth.currentUser;
      if (user) {
        const userSnap = await getDoc(doc(db, 'users', user.uid));
        if (userSnap.exists()) {
          setCompletedIds(userSnap.data().completedQuests || []);
        }
      }
    })()
  }, [])

  return (
    <div
      className="flex flex-col bg-black text-white min-h-screen"
      style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, Arial, sans-serif', overflowX: 'hidden' }}
    >
      <style>
        {`
          body {
            margin: 0 !important;
            padding: 0 !important;
          }
          #root {
            margin: 0 !important;
            padding: 0 !important;
          }
        `}
      </style>
      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {/* Header Banner */}
      <div style={{ position: 'relative', width: '100%', height: '20em', overflow: 'hidden' }}>
        <img
          src={MarriottCenterHome}
          alt="BYU Fathers and Sons"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <p
          style={{
            position: 'absolute',
            bottom: '3rem',
            left: '0.7rem',
            margin: 0,
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 400,
            fontFamily: 'Inter, ui-sans-serif, system-ui, Arial, sans-serif',
          }}
        >
          BYU Fathers and Sons
        </p>
        <h1
          style={{
            position: 'absolute',
            bottom: '1rem',
            left: '0.7rem',
            margin: 0,
            color: '#fff',
            fontFamily: 'Inter, ui-sans-serif, system-ui, Arial, sans-serif',
            fontSize: '1.25rem',
            fontWeight: 'bold',
          }}
        >
          {greeting}
        </h1>
      </div>

      {/* For You Section */}
      <div style={{ marginTop: '1rem' }}>
        <h2 className="text-black font-bold text-lg" style={{ paddingLeft: '1rem' }}>For You</h2>
        <div
          className="hide-scrollbar"
          style={{
            marginTop: '0.5rem',
            overflowX: 'auto',
            overflowY: 'hidden',
            display: 'flex',
            paddingLeft: '1rem',
          }}
        >
          {forYou.map(q => (
            <button
              key={q.id}
              onClick={() => navigate(`/quest/${q.id}`)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                flexShrink: 0,
                width: '10rem',
                height: '10rem',
                marginRight: '1rem',
                position: 'relative',
              }}
            >
              <img src={q.photoURL} alt={q.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '1.5rem' }} />
              <div style={{
                position: 'absolute', bottom: 0, left: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                padding: '0.35rem 0.65rem', borderBottomLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem'
              }}>
                <span style={{ color: '#fff', fontSize: '0.875rem', fontWeight: 600 }}>
                  {q.title}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {completed.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h2 className="text-black font-bold text-lg" style={{ paddingLeft: '1rem' }}>Completed</h2>
          <div
            className="hide-scrollbar"
            style={{
              marginTop: '0.5rem',
              overflowX: 'auto',
              overflowY: 'hidden',
              display: 'flex',
              paddingLeft: '1rem',
            }}
          >
            {completed.map(q => (
              <button
                key={q.id}
                onClick={() => navigate(`/quest/${q.id}`)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  flexShrink: 0,
                  width: '10rem',
                  height: '10rem',
                  marginRight: '1rem',
                  position: 'relative',
                  opacity: 0.6,
                }}
              >
                <img src={q.photoURL} alt={q.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '1.5rem', filter: 'grayscale(50%)' }} />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  padding: '0.35rem 0.65rem', borderBottomLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem'
                }}>
                  <span style={{ color: '#fff', fontSize: '0.875rem', fontWeight: 600 }}>
                    {q.title}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-grow" /> 

      {/* Tab Bar */}
      <TabBar />
    </div>
  )
}

export default Home