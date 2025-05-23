// src/components/DesktopNotice.tsx
import logo from '../assets/image.png';

export default function DesktopNotice() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#0047BA',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: 'Inter, ui-sans-serif, system-ui, Arial, sans-serif',
        zIndex: 9999,
      }}
    >
      <img
        src={logo}
        alt="CougarQuest"
        style={{
          width: '70%',
          maxWidth: '500px',
          height: 'auto',
          objectFit: 'contain',
          display: 'block',
          margin: '0 auto',
        }}
      />
      <p
        style={{
          margin: 0,
          marginTop: '1.5rem',
          padding: 0,
          textAlign: 'center',
          fontSize: '1.25rem',
        }}
      >
        CougarQuest is currently only available on mobile devices.
      </p>
    </div>
  );
}