import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { storage } from '../firebase';
import { ref as storageRef, uploadBytes } from 'firebase/storage';
import { getFirestore, doc, getDoc, setDoc, arrayUnion, increment } from 'firebase/firestore';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface Quest {
  id: string;
  title: string;
  description: string;
  photoURL: string;
  address: string;
  createdAt: string | { toMillis(): number };
  plusCode: string;
}

export default function Quest() {
  const { id } = useParams<{ id: string }>();
  const [quest, setQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    if (!id) return;
    (async () => {
      const docSnap = await getDoc(doc(db, 'quests', id));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setQuest({
          id: docSnap.id,
          ...(data as Omit<Quest, 'id'>),
          // attach createdAt for reward calc
          createdAt: data.createdAt,
          plusCode: data.plusCode,
        });
      }
      setLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    if (!quest) return;
    (async () => {
      const user = auth.currentUser;
      if (!user) return;
      const userSnap = await getDoc(doc(db, 'users', user.uid));
      if (userSnap.exists()) {
        const data = userSnap.data() as any;
        if (Array.isArray(data.completedQuests) && data.completedQuests.includes(quest.title)) {
          setCompleted(true);
        }
      }
    })();
  }, [quest]);

  // Upload photo to Storage and mark quest complete
  const uploadPhoto = async (file: File) => {
    const user = auth.currentUser;
    if (!user || !quest) return;
    const path = `${user.uid}/${quest.id}/photo.png`;
    const storageReference = storageRef(storage, path);
    const data = await file.arrayBuffer();
    try {
      await uploadBytes(storageReference, new Uint8Array(data));
      // safely compute creation timestamp (fallback to now)
      const createdAtValue = (quest as any).createdAt;
      let createdMs: number = Date.now();
      if (createdAtValue) {
        if (typeof createdAtValue === 'string') {
          createdMs = new Date(createdAtValue).getTime();
        } else if (typeof (createdAtValue as any).toMillis === 'function') {
          createdMs = (createdAtValue as any).toMillis();
        }
      }
      const elapsed = Date.now() - createdMs;
      let reward: number;
      if (elapsed <= 12 * 3600 * 1000) {
        reward = 3;
      } else if (elapsed <= 24 * 3600 * 1000) {
        reward = 2;
      } else {
        reward = 1;
      }
      // award points and mark complete
      const userDoc = doc(db, 'users', user.uid);
      await setDoc(userDoc, {
        completedQuests: arrayUnion(quest.title),
        points: increment(reward),
      }, { merge: true });
      alert('Photo uploaded and quest completed!');
      window.location.href = '/';
    } catch (err: any) {
      console.error('Upload error:', err);
      alert('Upload failed: ' + err.message);
    }
  };

  const handleSubmitPhoto = () => {
    const file = fileInputRef.current?.files?.[0];
    if (file) uploadPhoto(file);
  };

  if (loading || !quest) {
    return (
      <div style={{ minHeight: '100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <span>Loading quest…</span>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'hidden' }}>
      <style>{`
        body, html, #root {
          margin: 0 !important;
          padding: 0 !important;
        }
      `}</style>
      <div style={{
        position: 'relative',
        left: '50%',
        width: '100vw',
        marginLeft: '-50vw',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'Inter, ui-sans-serif, system-ui, Arial, sans-serif',
      }}>
        {/* Quest Image with Title Overlay */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '40vh',
          overflow: 'hidden',
        }}>
          <img
            src={quest.photoURL}
            alt={quest.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <h1 style={{
            position: 'absolute',
            bottom: '-0.7rem',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '95%',
            textAlign: 'center',
            color: '#FFFFFF',
            fontSize: '2rem',
            fontWeight: 700,
            textShadow: '0 3px 6px rgba(0,0,0,0.7)',
          }}>
            {quest.title}
          </h1>
        </div>

        {/* Description */}
        <div style={{
          width: '100%',
          maxWidth: '385px',
          boxSizing: 'border-box',
          padding: '1rem',
          backgroundColor: 'rgba(169, 169, 169, 0.65)',
          border: '0.8px solid #0047BA',
          borderRadius: '1rem',
          marginTop: '1rem',
          textAlign: 'center',
        }}>
          <p style={{
            margin: 0,
            color: '#000000',
            fontSize: '1rem',
          }}>
            {quest.description}
          </p>
        </div>

        {/* Map and Address */}
        <div style={{
          width: '100%',
          maxWidth: '385px',
          marginTop: '1rem',
        }}>
          <iframe
            src={`https://www.google.com/maps?q=${encodeURIComponent(quest.plusCode)}&output=embed`}
            style={{
              width: '100%',
              height: '200px',
              border: '1px solid #0047BA',
              borderRadius: '1rem',
              boxSizing: 'border-box',
              display: 'block',
            }}
            allowFullScreen
            loading="lazy"
            title="Quest Location"
          />
          {/* Address removed */}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleSubmitPhoto}
        />

        {completed ? (
          <button
            style={{
              position: 'fixed',
              bottom: '1rem',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              maxWidth: '385px',
              padding: '1rem',
              backgroundColor: '#FFFFFF',
              color: '#0047BA',
              fontSize: '1rem',
              fontWeight: 600,
              borderWidth: '5px',
              borderStyle: 'solid',
              borderColor: '#0047BA',
              borderRadius: '9999px',
              boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
              cursor: 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            disabled
          >
            Completed <CheckCircleIcon style={{ width: '1.5rem', height: '1.5rem', color: '#0047BA', marginLeft: '0.5rem' }} />
          </button>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              position: 'fixed',
              bottom: '1rem',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              maxWidth: '385px',
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
        )}
      </div>
    </div>
  );
}