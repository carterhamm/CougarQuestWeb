import React from 'react';

export default function Privacy() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', padding: '48px 24px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#0047BA', marginBottom: '16px' }}>Privacy Policy</h1>
        <p style={{ fontSize: '16px', marginBottom: '16px' }}>Your privacy is important to us. This privacy policy explains how CougarQuest (“we”, “our”, or “us”) collects, uses, and discloses your information when you use our app.</p>
        <p style={{ fontSize: '16px', marginBottom: '16px', fontStyle: 'italic' }}>
          Please note: CougarQuest is currently in beta. Features may change, and you may encounter occasional bugs or updates as we improve the app.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#0047BA', marginTop: '32px', marginBottom: '8px' }}>Information We Collect</h2>
        <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: '16px' }}>
          <li><strong>Contact Info:</strong> phone number, email address, name – used for authentication and account management.</li>
          <li><strong>Location Data:</strong> precise location to verify quest completion.</li>
          <li><strong>User Content:</strong> photos you upload to complete quests.</li>
          <li><strong>Usage Data:</strong> app interactions, performance and crash logs for analytics and app stability.</li>
        </ul>

        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#0047BA', marginTop: '32px', marginBottom: '8px' }}>How We Use Your Information</h2>
        <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: '16px' }}>
          <li>To authenticate and secure your account.</li>
          <li>To verify quest completion and display your progress.</li>
          <li>To improve app functionality, fix bugs, and optimize performance.</li>
          <li>To personalize your experience (e.g., greeting you by name).</li>
        </ul>

        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#0047BA', marginTop: '32px', marginBottom: '8px' }}>Data Sharing</h2>
        <p style={{ marginBottom: '16px', fontSize: '16px' }}>We do not share your personal data with third parties for advertising or marketing. We may share with service providers (e.g., Firebase) solely to operate our app.</p>

        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#0047BA', marginTop: '32px', marginBottom: '8px' }}>Security</h2>
        <p style={{ marginBottom: '16px', fontSize: '16px' }}>
          Data access is controlled by Firestore Security Rules to ensure privacy and integrity. Authenticated users may create and read their own user profile documents, update their personal data (while being prevented from elevating roles), and view other users’ public information such as display names and points. Only administrators have permission to create, update, and delete quest definitions. All other data operations are denied by default. These rules ensure that only authorized users can access or modify data in accordance with their roles.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#0047BA', marginTop: '32px', marginBottom: '8px' }}>Changes to This Policy</h2>
        <p style={{ marginBottom: '16px', fontSize: '16px' }}>We may update this policy; we will notify you of material changes within the app.</p>

        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#0047BA', marginTop: '32px', marginBottom: '8px' }}>Contact Us</h2>
        <p style={{ fontSize: '16px', marginBottom: '16px' }}>
          If you have any questions, contact us at <a href="mailto:support@cougarquest.com" style={{ color: '#0047BA', textDecoration: 'underline' }}>support@cougarquest.com</a>.
        </p>
      </div>
    </div>
  );
}
