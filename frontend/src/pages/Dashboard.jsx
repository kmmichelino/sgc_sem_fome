export default function Dashboard() {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        Dashboard - SGC
      </h1>
      
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Bem-vindo, {usuario.nome}!</h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <strong>Suas permissões:</strong>
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            {usuario.permissoes?.map((permissao, index) => (
              <li key={index}>{permissao}</li>
            )) || <li>Nenhuma permissão definida</li>}
          </ul>
        </div>

        <p style={{ color: '#6b7280' }}>
          Use o menu de navegação acima para acessar as funcionalidades disponíveis para seu perfil.
        </p>
      </div>
    </div>
  )
}