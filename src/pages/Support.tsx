export default function Support() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', padding: '48px 24px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#0047BA', marginBottom: '16px' }}>Support</h1>
        <p style={{ fontSize: '16px', marginBottom: '16px' }}>
          Need help with CougarQuest? Have feedback, a bug to report, or a question about the app? We'd love to hear from you.
        </p>
        <p style={{ fontSize: '16px', marginBottom: '16px' }}>
          Email us at{' '}
          <a
            href="mailto:support@cougarquest.com"
            style={{ color: '#0047BA', textDecoration: 'underline' }}
          >
            support@cougarquest.com
          </a>{' '}
          and we'll get back to you as soon as we can.
        </p>
      </div>
    </div>
  );
}
