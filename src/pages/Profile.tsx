import React, { useState, useEffect, useRef } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { FiUser, FiMail, FiUsers, FiPlus, FiEdit2 } from 'react-icons/fi';

const ACCENT_BG = 'rgba(0, 71, 186, 0.4)';

export default function Profile() {
  const [userData, setUserData] = useState<{
    name?: string;
    email?: string;
    phone?: string;
    sons?: string[];
    teamName?: string;
    grandpa?: string;
  }>({});
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const db = getFirestore();

  const nameRef = useRef<HTMLInputElement>(null);
  const teamRef = useRef<HTMLInputElement>(null);
  const grandpaRef = useRef<HTMLInputElement>(null);
  // For sons, we'll create an array of refs
  const sonsRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [editingName, setEditingName] = useState(false);
  const [editingTeam, setEditingTeam] = useState(false);
  const [editingGrandpa, setEditingGrandpa] = useState(false);
  const [editingSons, setEditingSons] = useState<boolean[]>([]);
  // Track which son rows are showing delete
  const [showDelete, setShowDelete] = useState<boolean[]>([]);
  // Track pointer down X position for each son row
  const touchStartX = useRef<number[]>([]);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        setUserData(snap.data() as any);
        setEditingSons((snap.data().sons as string[] || []).map(() => false));
        const sonsArray = (snap.data().sons as string[] || []);
        setShowDelete(sonsArray.map(() => false));
        // init touchStartX with zeros
        touchStartX.current = sonsArray.map(() => 0);
      }
      setLoading(false);
    };
    fetchUser();
  }, [auth, db]);

  // Generic field update
  const updateField = async (field: string, value: any) => {
    const user = auth.currentUser;
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { [field]: value });
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const contact =
    userData.email ??
    userData.phone ??
    auth.currentUser?.email ??
    auth.currentUser?.phoneNumber ??
    '';

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'Inter, ui-sans-serif, system-ui, Arial, sans-serif' }}>
        <span style={{ color: '#333' }}>Loading profile…</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'Inter, ui-sans-serif, system-ui, Arial, sans-serif' }}>
      <style>
        {`
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #f5f5f5;
          }
          #root {
            margin: 0 !important;
            padding: 0 !important;
          }
        `}
      </style>
      <div>
        <nav style={{ padding: '1rem', backgroundColor: 'transparent' }}>
          <h1 style={{ margin: 0, color: '#000', fontSize: '1.5rem', fontWeight: 600 }}>Profile</h1>
        </nav>

        {/* Parent Info Section */}
        <div style={{ marginTop: '1rem', marginRight: '1rem', marginBottom: '1rem', marginLeft: '1rem' }}>
          <h2 style={{ margin: 0, marginBottom: '0.5rem', color: '#AAA', fontSize: '0.75rem', textTransform: 'uppercase' }}>Parent Info</h2>
          <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '0.5rem', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderBottom: '1px solid #ccc' }}>
              <div>
                <FiUser color="#0047BA" />
                <input
                  ref={nameRef}
                  type="text"
                  readOnly={!editingName}
                  value={userData.name || ''}
                  onChange={e =>
                    setUserData(prev => ({ ...prev, name: e.target.value }))
                  }
                  autoFocus={editingName}
                  onBlur={e => {
                    updateField('name', e.target.value);
                    setEditingName(false);
                  }}
                  style={{
                    flex: 1,
                    marginLeft: '0.75rem',
                    backgroundColor: editingName ? ACCENT_BG : '#fff',
                    color: editingName ? '#FFFFFF' : '#000000',
                    border: 'none',
                    borderRadius: '0.25rem',
                    padding: '0.1rem',
                    fontSize: '1rem',
                    fontFamily: 'Inter, ui-sans-serif, system-ui, Arial, sans-serif',
                  }}
                />
              </div>
              <FiEdit2
                color="#0047BA"
                onClick={() => {
                  setEditingName(true);
                }}
                style={{ cursor: 'pointer' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderBottom: '1px solid #ccc' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {contact.includes('@') ? (
                  <FiMail color="#0047BA" />
                ) : (
                  <FiUsers color="#0047BA" />
                )}
                <span style={{ paddingLeft: '0.75em' }}>{contact}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sons Section */}
        <div style={{ marginTop: '1rem', marginRight: '1rem', marginBottom: '1rem', marginLeft: '1rem' }}>
          <h2 style={{ margin: 0, marginBottom: '0.5rem', color: '#AAA', fontSize: '0.75rem', textTransform: 'uppercase' }}>Sons</h2>
          <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '0.5rem', overflow: 'hidden' }}>
            {(userData.sons || []).map((son, idx) => (
              <div
                key={idx}
                onTouchStart={e => {
                  touchStartX.current[idx] = e.touches[0].clientX;
                }}
                onTouchEnd={e => {
                  const endX = e.changedTouches[0].clientX;
                  const delta = touchStartX.current[idx] - endX;
                  if (delta > 50 && (userData.sons?.length || 0) > 1) {
                    setShowDelete(prev => prev.map((v,i) => i === idx ? true : v));
                  } else if (delta < -50) {
                    setShowDelete(prev => prev.map((v,i) => i === idx ? false : v));
                  }
                }}
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                {/* Delete button */}
                {showDelete[idx] && (
                  <button
                    onClick={() => {
                      const updated = [...(userData.sons || [])];
                      if (updated.length > 1) {
                        updated.splice(idx, 1);
                        setUserData(prev => ({ ...prev, sons: updated }));
                        setEditingSons(prev => prev.filter((_, i) => i !== idx));
                        setShowDelete(prev => prev.filter((_, i) => i !== idx));
                        touchStartX.current.splice(idx, 1);
                        updateField('sons', updated);
                      }
                    }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      bottom: 0,
                      width: '4rem',
                      backgroundColor: '#f44336',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '1.25rem',
                      zIndex: 1,
                    }}
                  >
                    <FiEdit2 style={{ display: 'none' }} />
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 24 24">
                      <path d="M3 6h18v2H3V6zm2 3h14v13H5V9zm4-7h6v2h-6V2z"/>
                    </svg>
                  </button>
                )}
                {/* Row content slides when delete shown */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid #ccc',
                    backgroundColor: '#fff',
                    transform: showDelete[idx] ? 'translateX(-4rem)' : 'translateX(0)',
                    transition: 'transform 0.2s ease-out',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <FiUsers color="#0047BA" />
                    <input
                      ref={el => { sonsRefs.current[idx] = el; }}
                      type="text"
                      readOnly={!editingSons[idx]}
                      value={son}
                      onChange={e => {
                        const updated = [...(userData.sons || [])];
                        updated[idx] = e.target.value;
                        setUserData(prev => ({ ...prev, sons: updated }));
                      }}
                      autoFocus={editingSons[idx]}
                      onBlur={e => {
                        // Persist entire sons array
                        updateField('sons', userData.sons || []);
                        setEditingSons(prev => prev.map((v,i) => i === idx ? false : v));
                      }}
                      style={{
                        flex: 1,
                        marginLeft: '0.75rem',
                        backgroundColor: editingSons[idx] ? ACCENT_BG : '#fff',
                        color: editingSons[idx] ? '#FFFFFF' : '#000000',
                        border: 'none',
                        borderRadius: '0.25rem',
                        padding: '0.1rem',
                        fontSize: '1rem',
                        fontFamily: 'Inter, ui-sans-serif, system-ui, Arial, sans-serif',
                      }}
                    />
                  </div>
                  <FiEdit2
                    color="#0047BA"
                    onClick={() => {
                      setEditingSons(prev => prev.map((v,i) => i===idx));
                    }}
                    style={{ cursor: 'pointer', marginLeft: '0.5rem' }}
                  />
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                const updated = [...(userData.sons || [])];
                if (updated.length < 8) {
                  updated.push('');
                }
                setUserData(prev => ({ ...prev, sons: updated }));
                setEditingSons(prev => [...prev, false]);
                setShowDelete(prev => [...prev, false]);
                touchStartX.current = [...touchStartX.current, 0];
              }}
              style={{ width: '100%', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', color: '#0047BA', background: 'none', border: 'none', fontSize: '1rem', fontWeight: 500 }}
            >
              <FiPlus color="#0047BA" />
              <span style={{ paddingLeft: '0.5em' }}>Add Son</span>
            </button>
          </div>
        </div>

        {/* Team Name Section */}
        <div style={{ marginTop: '1rem', marginRight: '1rem', marginBottom: '1rem', marginLeft: '1rem' }}>
          <h2 style={{ margin: 0, marginBottom: '0.5rem', color: '#AAA', fontSize: '0.75rem', textTransform: 'uppercase' }}>Team</h2>
          <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '0.5rem', overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '0.75rem 1rem' }}>
            <FiUsers color="#0047BA" />
            <input
              ref={teamRef}
              type="text"
              readOnly={!editingTeam}
              value={userData.teamName || ''}
              onChange={e =>
                setUserData(prev => ({ ...prev, teamName: e.target.value }))
              }
              placeholder="Your team name"
              autoFocus={editingTeam}
              onBlur={e => {
                updateField('teamName', e.target.value);
                setEditingTeam(false);
              }}
              style={{
                flex: 1,
                marginLeft: '0.75rem',
                backgroundColor: editingTeam ? ACCENT_BG : '#fff',
                color: editingTeam ? '#FFFFFF' : '#000000',
                border: 'none',
                borderRadius: '0.25rem',
                padding: '0.1rem',
                fontSize: '1rem',
                fontFamily: 'Inter, ui-sans-serif, system-ui, Arial, sans-serif',
              }}
            />
            <FiEdit2
              color="#0047BA"
              onClick={() => {
                setEditingTeam(true);
              }}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Grandpa Section */}
        <div style={{ margin: '1rem' }}>
          <h2 style={{ margin: 0, marginBottom: '0.5rem', color: '#AAA', fontSize: '0.75rem', textTransform: 'uppercase' }}>Grandpa</h2>
          <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '0.5rem', overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '0.75rem 1rem' }}>
            <FiUser color="#0047BA" />
            <input
              ref={grandpaRef}
              type="text"
              readOnly={!editingGrandpa}
              value={userData.grandpa || ''}
              onChange={e => setUserData(prev => ({ ...prev, grandpa: e.target.value }))}
              placeholder="Your grandpa"
              autoFocus={editingGrandpa}
              onBlur={e => {
                updateField('grandpa', e.target.value);
                setEditingGrandpa(false);
              }}
              style={{
                flex: 1,
                marginLeft: '0.75rem',
                backgroundColor: editingGrandpa ? ACCENT_BG : '#fff',
                color: editingGrandpa ? '#FFFFFF' : '#000000',
                border: 'none',
                borderRadius: '0.25rem',
                padding: '0.1rem',
                fontSize: '1rem',
                fontFamily: 'Inter, ui-sans-serif, system-ui, Arial, sans-serif',
              }}
            />
            <FiEdit2
              color="#0047BA"
              onClick={() => {
                setEditingGrandpa(true);
              }}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      {/* Log Out Button */}
      <div style={{ padding: '1rem' }}>
        <button
          onClick={() => signOut(auth)}
          style={{ width: '100%', padding: '0.75rem', background: 'none', border: '1px solid #f44', borderRadius: '0.25rem', color: '#f44', fontSize: '1rem', fontWeight: 600 }}        >
          Log Out
        </button>
      </div>
    </div>
  );
}