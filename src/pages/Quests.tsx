// Declare missing type modules
// (Removed declarations for '@react-spring/web' and '@use-gesture/react')
// src/pages/Quests.tsx
import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, doc, getDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { auth, storage, db } from '../firebase';
import { getAuth } from 'firebase/auth';
import { ref as storageRef, uploadBytes } from 'firebase/storage';
// import { motion } from 'framer-motion';

interface Quest {
  id: string;
  title: string;
  description: string;
  photoURL: string;
  googleMapsLink: string;
  address: string;
  createdAt?: any;
  plusCode: string;
}

export default function Quests() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [current, setCurrent] = useState(0);
  const [currentDirection, setDirection] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // use exported auth (redundant, but per instructions)
  const auth = getAuth();

  const uploadPhoto = async (file: File) => {
    const user = auth.currentUser;
    if (!user) return;
    const quest = quests[current];
    const path = `${user.uid}/${quest.id}/photo.png`;
    const storageReference = storageRef(storage, path);
    const data = await file.arrayBuffer();
    try {
      await uploadBytes(storageReference, new Uint8Array(data));
    } catch (err: any) {
      console.error('Storage upload error:', err);
      alert('Upload failed: ' + err.message);
      return;
    }
    // mark complete and award points
    const userDoc = doc(db, 'users', user.uid);
    const elapsed = Date.now() - (quest.createdAt?.toMillis() || Date.now());
    let reward: number;
    if (elapsed <= 12 * 3600 * 1000) {
      reward = 3;
    } else if (elapsed <= 24 * 3600 * 1000) {
      reward = 2;
    } else {
      reward = 1;
    }

    try {
      console.log('Updating Firestore for user', user.uid, 'quest', quest.title);
      await updateDoc(userDoc, {
        completedQuests: arrayUnion(quest.title),
        points: increment(reward),
      });
      console.log('Firestore update successful');
    } catch (error: any) {
      console.error('Error updating Firestore:', error);
      alert('Failed to mark quest complete: ' + error.message);
      return;
    }

    alert('Photo uploaded and quest completed!');
    window.location.reload();
  };

  const handleSubmitPhoto = async () => {
    const file = fileInputRef.current?.files?.[0];
    const user = auth.currentUser;
    if (!file || !user) return;
    console.log('handleSubmitPhoto: file selected for quest', quests[current].title);
    await uploadPhoto(file);
    // update local state if needed, remove card or navigate
  };

  // Fetch quests from Firestore, filter out completed on initial load
  useEffect(() => {
    (async () => {
      // fetch all quests
      const snapshot = await getDocs(collection(db, 'quests'));
      const all = snapshot.docs.map(doc => {
        const data = doc.data() as any;
        return {
          id: doc.id,
          title: data.title,
          description: data.description,
          photoURL: data.photoURL,
          googleMapsLink: data.googleMapsLink,
          address: data.address,
          createdAt: data.createdAt,
          plusCode: data.plusCode || '',
        } as Quest;
      });
      // fetch user completed list
      const user = getAuth().currentUser;
      let completed: string[] = [];
      if (user) {
        const userSnap = await getDoc(doc(db, 'users', user.uid));
        if (userSnap.exists()) {
          completed = userSnap.data().completedQuests || [];
        }
      }
      // filter out completed on initial load
      const filtered = all.filter(q => !completed.includes(q.title));
      setQuests(filtered);
    })();
  }, []);

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (dir: number) => {
    setDirection(dir);
    setCurrent((current + dir + quests.length) % quests.length);
  };

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    const delta = touchEndX.current - touchStartX.current;
    if (delta > 50 && quests.length) {
      setCurrent((current - 1 + quests.length) % quests.length);
    } else if (delta < -50 && quests.length) {
      setCurrent((current + 1) % quests.length);
    }
  };

  if (!quests.length) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, ui-sans-serif, system-ui, Arial, sans-serif',
        }}
      >
        Loading quests…
      </div>
    );
  }

  const prev = quests[(current - 1 + quests.length) % quests.length];
  const curr = quests[current];
  const next = quests[(current + 1) % quests.length];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        paddingTop: '5rem',
        paddingBottom: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'Inter, ui-sans-serif, system-ui, Arial, sans-serif',
      }}
    >
      {/* Carousel */}
      <div
        style={{
          position: 'relative',
          width: '90%',
          maxWidth: '400px',
          paddingTop: '119.5%',
          margin: '0 auto 0.01rem',
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Previous card */}
        <img
          src={prev.photoURL}
          alt=""
          style={{
            position: 'absolute',
            top: '8%',
            left: '2%',
            width: '80%',
            height: '80%',
            borderRadius: '2.5rem',
            boxShadow: '0 8px 16px rgba(0,0,0,0.25)',
            objectFit: 'cover',
            objectPosition: 'center',
            transform: 'rotate(-8deg)',
          }}
        />
        {/* Next card */}
        <img
          src={next.photoURL}
          alt=""
          style={{
            position: 'absolute',
            top: '8%',
            right: '2%',
            width: '80%',
            height: '80%',
            borderRadius: '2.5rem',
            boxShadow: '0 8px 16px rgba(0,0,0,0.25)',
            objectFit: 'cover',
            objectPosition: 'center',
            transform: 'rotate(8deg)',
          }}
        />
        {/* Current card */}
        <img
          src={curr.photoURL}
          alt=""
          style={{
            position: 'absolute',
            top: '3%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            height: '90%',
            borderRadius: '2.5rem',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.5)',
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: 2,
          }}
        />
      </div>

      {/* Quest info */}
      <div style={{ textAlign: 'center', padding: '0 0.25rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.25rem 0' }}>
          {curr.title}
        </h2>
        <p style={{ fontSize: '1rem', color: '#666', margin: 0 }}>
          {curr.description}
        </p>
      </div>

      {/* Map and address */}
      <div
        style={{
          width: '100%',
          maxWidth: '385px',
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: '1rem',
          marginBottom: '1rem',
        }}
      >
        <iframe
          src={`https://www.google.com/maps?q=${encodeURIComponent(curr.plusCode)}&output=embed`}
          style={{
            width: '100%',
            height: '200px',
            border: '1px solid #CCCCCC',
            borderRadius: '1rem',
            boxSizing: 'border-box',
            display: 'block',
          }}
          allowFullScreen
          loading="lazy"
          title="Google Maps"
        />
        <div
          style={{
            marginTop: '0.5rem',
            marginBottom: '5rem',
            color: '#222',
            fontSize: '0.96rem',
            wordBreak: 'break-word',
          }}
        >
          {curr.address}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={() => {
          handleSubmitPhoto();
        }}
      />
      {/* Styled upload button */}
      <button
        onClick={() => {
          fileInputRef.current?.click();
        }}
        style={{
          position: 'fixed',
          bottom: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '385px',
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: '1rem',
          backgroundColor: '#0047BA',
          color: '#FFFFFF',
          fontSize: '1rem',
          fontWeight: 600,
          border: 'none',
          borderRadius: '9999px',
          boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
          cursor: 'pointer',
        }}
      >
        Submit Your Photo
      </button>
    </div>
  );
}