export default function DashboardLoading() {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ width: 200, height: 28, borderRadius: 6, background: 'var(--bg-card)', marginBottom: 8 }} />
        <div style={{ width: 300, height: 16, borderRadius: 4, background: 'var(--bg-card)' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{
            background: 'var(--bg-card)', borderRadius: 12, padding: 20, height: 100,
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ width: 80, height: 14, borderRadius: 4, background: 'var(--bg-elevated)', marginBottom: 12 }} />
            <div style={{ width: 48, height: 28, borderRadius: 4, background: 'var(--bg-elevated)' }} />
          </div>
        ))}
      </div>
    </div>
  )
}
