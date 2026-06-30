function Misal() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#050505',
      color: '#f4ead6',
      padding: '32px 16px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontFamily: 'Georgia, serif', color: '#d9b86b' }}>
        Misal de Boda
      </h1>

      <p>Rafael & Jimena · 11 de julio de 2026</p>

      <a
        href="/misal.pdf"
        target="_blank"
        rel="noreferrer"
        style={{
          display: 'inline-flex',
          margin: '18px auto',
          padding: '14px 24px',
          borderRadius: '999px',
          background: '#d9b86b',
          color: '#111',
          textDecoration: 'none',
          fontWeight: 700
        }}
      >
        Abrir PDF
      </a>

      <iframe
        src="/misal.pdf"
        title="Misal de Boda"
        style={{
          width: 'min(100%, 900px)',
          height: '80vh',
          border: '1px solid rgba(217,184,107,.35)',
          borderRadius: '16px',
          background: 'white'
        }}
      />
    </main>
  )
}

export default Misal
