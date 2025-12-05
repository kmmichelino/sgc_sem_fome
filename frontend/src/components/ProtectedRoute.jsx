import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children, requiredPermission }) {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  
  if (!usuario.id) {
    return <Navigate to="/login" replace />
  }

  // Admin has access to everything
  if (requiredPermission && !usuario.isAdmin && !usuario.permissoes?.includes(requiredPermission)) {
    return (
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: '#fee2e2',
        color: '#dc2626',
        margin: '2rem',
        borderRadius: '8px'
      }}>
        <h2>Acesso Negado</h2>
        <p>Você não tem permissão para acessar esta página.</p>
      </div>
    )
  }

  return children
}