// src/pages/Continuity.tsx
import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { auth } from '../firebase';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
  PhoneAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

export default function Continuity() {
  const [step, setStep] = useState<'choice' | 'phone' | 'verify' | 'firstName' | 'lastName' | 'sons'>('choice');
  const [phone, setPhone] = useState('');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [sons, setSons] = useState<string[]>(['']);
  const db = getFirestore();

  // Removed getRedirectResult flow for Google popup

  // Removed getRedirectResult flow for Google popup

  // Removed getRedirectResult flow for Google popup

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    const p1 = digits.slice(0, 3);
    const p2 = digits.slice(3, 6);
    const p3 = digits.slice(6);
    if (p3) return `(${p1}) ${p2}-${p3}`;
    if (p2) return `(${p1}) ${p2}`;
    if (p1) return `(${p1}`;
    return digits;
  };

  const getE164 = (p: string) => '+1' + p.replace(/\D/g, '');

  const startPhone = () => setStep('phone');

  const sendSms = async () => {
    try {
      // Reset and initialize reCAPTCHA
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        { size: 'invisible' }
      );
      const appVerifier = window.recaptchaVerifier;
      await appVerifier.render();
      const phoneE164 = getE164(phone);
      const confirmation = await signInWithPhoneNumber(auth, phoneE164, appVerifier);
      setVerificationId(confirmation.verificationId);
      setStep('verify');
    } catch (error: any) {
      console.error('SMS send error', error);
      alert('Failed to send SMS: ' + error.message);
    }
  };

  const verifyCode = async () => {
    try {
      if (!verificationId) return;
      const credential = PhoneAuthProvider.credential(verificationId, code);
      await signInWithCredential(auth, credential);
      const user = auth.currentUser;
      if (!user) throw new Error('Auth failed');
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        // existing user: just go home
        window.location.href = '/';
        return;
      }
      // new user: create minimal record before asking for names
      await setDoc(userRef, {
        phoneNumber: getE164(phone),
        points: 0,
        isAdmin: false,
      }, { merge: true });
      // now ask for names
      setStep('firstName');
    } catch (error: any) {
      console.error('Verification error', error);
      alert('Failed to verify code: ' + error.message);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        window.location.reload();
      }
    } catch (error: any) {
      console.error('Google sign-in error', error);
      alert('Google sign-in failed: ' + error.message);
    }
  };

  const commonContainerStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '2rem',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    maxWidth: '385px',
  };
  const commonInputStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '0.9rem 1rem',
    borderRadius: '9999px',
    border: '2px solid #0047BA',
    fontSize: '1rem',
    marginBottom: '1rem',
    outline: 'none',
  };
  const commonButtonStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.9rem',
    borderRadius: '9999px',
    border: '2px solid #0047BA',
    backgroundColor: 'transparent',
    color: '#0047BA',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
  };

  const goBack = () => {
    if (step === 'phone') setStep('choice');
    else if (step === 'verify') setStep('phone');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '0.5rem 1rem 4rem',
        fontFamily: 'Inter, ui-sans-serif, system-ui, Arial, sans-serif',
      }}
    >
      {(step === 'phone' || step === 'verify') && (
        <button
          onClick={goBack}
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            background: 'none',
            border: 'none',
            color: '#0047BA',
            fontSize: '1rem',
            fontFamily: 'Inter, ui-sans-serif, system-ui, Arial, sans-serif',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ArrowLeftIcon style={{ width: '1.5rem', height: '1.5rem', color: '#0047BA', marginRight: '0.5rem' }} />
          Back
        </button>
      )}
      <div id="recaptcha-container" />
      {step === 'choice' && (
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #0047BA, #66A7FF)',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            textAlign: 'center',
            margin: 0,
            marginTop: '0.5rem',
          }}
        >
          Welcome to CougarQuest
        </h1>
      )}

      {step === 'choice' && (
        <div
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '385px',
          }}
        >
          <button
            onClick={startPhone}
            style={{
              width: '100%',
              padding: '0.9rem',
              borderRadius: '9999px',
              border: '2px solid #0047BA',
              backgroundColor: 'transparent',
              color: '#0047BA',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              marginBottom: '1rem',
            }}
          >
            Continue with Phone Number
          </button>
          <button
            onClick={signInWithGoogle}
            style={{
              width: '100%',
              padding: '0.9rem',
              borderRadius: '9999px',
              backgroundColor: '#0047BA',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Continue with Google
          </button>
          <a
            href="mailto:support@cougarquest.com"
            style={{
              display: 'block',
              textAlign: 'center',
              color: '#0047BA',
              textDecoration: 'underline',
              marginTop: '1rem',
              fontSize: '0.875rem',
              fontFamily: 'Inter, ui-sans-serif, system-ui, Arial, sans-serif',
            }}
          >
            Need help? Contact support
          </a>
        </div>
      )}

      {step === 'phone' && (
        <div
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '385px',
          }}
        >
          <input
            type="tel"
            inputMode="numeric"
            placeholder="(123) 456-7890"
            value={phone}
            onChange={e => setPhone(formatPhone(e.target.value))}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '0.9rem 1rem',
              borderRadius: '9999px',
              border: '2px solid #0047BA',
              fontSize: '1rem',
              marginBottom: '1rem',
              outline: 'none',
            }}
          />
          <button
            onClick={sendSms}
            style={{
              width: '100%',
              padding: '0.9rem',
              borderRadius: '9999px',
              border: '2px solid #0047BA',
              backgroundColor: 'transparent',
              color: '#0047BA',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Send Code
          </button>
        </div>
      )}

      {step === 'verify' && (
        <div
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '385px',
          }}
        >
          <input
            type="tel"
            inputMode="numeric"
            placeholder="Verification Code"
            value={code}
            onChange={e => setCode(e.target.value)}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '0.9rem 1rem',
              borderRadius: '9999px',
              border: '2px solid #0047BA',
              fontSize: '1rem',
              marginBottom: '1rem',
              outline: 'none',
            }}
          />
          <button
            onClick={verifyCode}
            style={{
              width: '100%',
              padding: '0.9rem',
              borderRadius: '9999px',
              border: '2px solid #0047BA',
              backgroundColor: 'transparent',
              color: '#0047BA',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Verify Code
          </button>
        </div>
      )}

      {step === 'firstName' && (
        <div style={commonContainerStyle}>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            style={commonInputStyle}
          />
          <button onClick={() => setStep('lastName')} style={commonButtonStyle}>
            Next
          </button>
        </div>
      )}

      {step === 'lastName' && (
        <div style={commonContainerStyle}>
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            style={commonInputStyle}
          />
          <button onClick={() => setStep('sons')} style={commonButtonStyle}>
            Next
          </button>
        </div>
      )}

      {step === 'sons' && (
        <div style={commonContainerStyle}>
          {sons.map((son, idx) => (
            <input
              key={idx}
              type="text"
              placeholder={`Son ${idx + 1}`}
              value={son}
              onChange={e => {
                const arr = [...sons];
                arr[idx] = e.target.value;
                setSons(arr);
              }}
              style={commonInputStyle}
            />
          ))}
          {sons.length < 12 && (
            <button onClick={() => setSons([...sons, ''])} style={{ marginBottom: '1rem' }}>
              Add Another
            </button>
          )}
          <button
            onClick={async () => {
              try {
                const user = auth.currentUser;
                if (!user) throw new Error('No authenticated user');
                await setDoc(doc(db, 'users', user.uid), {
                  firstName,
                  lastName,
                  name: `${firstName} ${lastName}`,
                  sons,
                }, { merge: true });
                window.location.href = '/';
              } catch (error: any) {
                console.error('Account creation error', error);
                alert('Failed to create account: ' + error.message);
              }
            }}
            style={commonButtonStyle}
          >
            Create Account
          </button>
        </div>
      )}
    </div>
  );
}