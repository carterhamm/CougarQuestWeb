import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { FiUser, FiMail, FiUsers, FiPlus, FiEdit2 } from 'react-icons/fi';

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

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        setUserData(snap.data() as any);
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
                  type="text"
                  value={userData.name || ''}
                  onChange={e =>
                    setUserData(prev => ({ ...prev, name: e.target.value }))
                  }
                  onBlur={e => updateField('name', e.target.value)}
                  style={{
                    flex: 1,
                    marginLeft: '0.75rem',
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '0.25rem',
                    padding: '0.1rem',
                    color: '#000',
                    fontSize: '1rem',
                    fontFamily: 'Inter, ui-sans-serif, system-ui, Arial, sans-serif'
                  }}
                />
              </div>
              <FiEdit2 color="#0047BA" />
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
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderBottom: '1px solid #ccc' }}
              >
                <div>
                  <FiUsers color="#0047BA" />
                  <input
                    type="text"
                    value={son}
                    onChange={e => {
                      const updated = [...(userData.sons || [])];
                      updated[idx] = e.target.value;
                      setUserData(prev => ({ ...prev, sons: updated }));
                    }}
                    onBlur={() => {
                      updateField('sons', userData.sons || []);
                    }}
                    style={{
                      flex: 1,
                      marginLeft: '0.75rem',
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '0.25rem',
                      padding: '0.1rem',
                      color: '#000',
                      fontSize: '1rem',
                      fontFamily: 'Inter, ui-sans-serif, system-ui, Arial, sans-serif'
                    }}
                  />
                </div>
                <FiEdit2 color="#0047BA" />
              </div>
            ))}
            <button
              onClick={() => {
                const updated = [...(userData.sons || [])];
                if (updated.length < 8) {
                  updated.push('');
                }
                setUserData(prev => ({ ...prev, sons: updated }));
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
              type="text"
              value={userData.teamName || ''}
              onChange={e =>
                setUserData(prev => ({ ...prev, teamName: e.target.value }))
              }
              onBlur={e => updateField('teamName', e.target.value)}
              placeholder="Your team name"
              style={{
                flex: 1,
                marginLeft: '0.75rem',
                backgroundColor: '#fff',
                border: 'none',
                borderRadius: '0.25rem',
                padding: '0.1rem',
                color: '#000',
                fontSize: '1rem',
                fontFamily: 'Inter, ui-sans-serif, system-ui, Arial, sans-serif'
              }}
            />
            <FiEdit2 color="#0047BA" />
          </div>
        </div>

        {/* Grandpa Section */}
        <div style={{ margin: '1rem' }}>
          <h2 style={{ margin: 0, marginBottom: '0.5rem', color: '#AAA', fontSize: '0.75rem', textTransform: 'uppercase' }}>Grandpa</h2>
          <div style={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '0.5rem', overflow: 'hidden', display: 'flex', alignItems: 'center', padding: '0.75rem 1rem' }}>
            <FiUser color="#0047BA" />
            <input
              type="text"
              value={userData.grandpa || ''}
              onChange={e => setUserData(prev => ({ ...prev, grandpa: e.target.value }))}
              onBlur={e => updateField('grandpa', e.target.value)}
              placeholder="Your grandpa"
              style={{
                flex: 1,
                marginLeft: '0.75rem',
                backgroundColor: '#fff',
                border: 'none',
                borderRadius: '0.25rem',
                padding: '0.1rem',
                color: '#000',
                fontSize: '1rem',
                fontFamily: 'Inter, ui-sans-serif, system-ui, Arial, sans-serif'
              }}
            />
            <FiEdit2 color="#0047BA" />
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