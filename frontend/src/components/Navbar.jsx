import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  
  const handleLogout = () => {
    localStorage.removeItem('usuario')
    navigate('/login')
  }

  const hasPermission = (permission) => {
    return usuario.isAdmin || usuario.permissoes?.includes(permission)
  }

  return (
    <nav style={{
      backgroundColor: '#1f2937',
      padding: '1rem',
      color: 'white'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
            SGC - ONG SEM FOME
          </Link>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            {hasPermission('Beneficiados') && (
              <Link to="/beneficiados" style={{ color: 'white', textDecoration: 'none' }}>
                Beneficiados
              </Link>
            )}
            {hasPermission('Entrada de Produtos') && (
              <Link to="/estoque" style={{ color: 'white', textDecoration: 'none' }}>
                Estoque
              </Link>
            )}
            {hasPermission('Financeiro') && (
              <Link to="/doacoes-financeiras" style={{ color: 'white', textDecoration: 'none' }}>
                Financeiro
              </Link>
            )}
            {hasPermission('Patrocinadores') && (
              <Link to="/patrocinadores" style={{ color: 'white', textDecoration: 'none' }}>
                Patrocinadores
              </Link>
            )}
            <Link to="/voluntarios" style={{ color: 'white', textDecoration: 'none' }}>
              Voluntários
            </Link>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Olá, {usuario.nome} {usuario.isAdmin && '(Admin)'}</span>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  )
}