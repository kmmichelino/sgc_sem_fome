import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <div className="hero-section">
        <h1 style={{fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem'}}>
          SGC - Sistema de Gerenciamento e Controle
        </h1>
        <p style={{fontSize: '1.2rem', opacity: '0.9'}}>
          ONG SEM FOME - Controle Administrativo
        </p>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem'}}>
        <Link to="/estoque" className="object-card" style={{textDecoration: 'none', color: 'inherit'}}>
          <div style={{padding: '2rem', textAlign: 'center', borderLeft: '4px solid var(--primary-green)'}}>
            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>📦</div>
            <h3 style={{fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem'}}>Consultar Estoque</h3>
            <p style={{color: 'var(--text-light)'}}>Visualize o saldo atual de produtos em estoque</p>
          </div>
        </Link>

        <Link to="/entrada-produtos" className="object-card" style={{textDecoration: 'none', color: 'inherit'}}>
          <div style={{padding: '2rem', textAlign: 'center', borderLeft: '4px solid var(--primary-orange)'}}>
            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>📥</div>
            <h3 style={{fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem'}}>Entrada de Produtos</h3>
            <p style={{color: 'var(--text-light)'}}>Registre a entrada de novos produtos no estoque</p>
          </div>
        </Link>

        <Link to="/doacoes-financeiras" className="object-card" style={{textDecoration: 'none', color: 'inherit'}}>
          <div style={{padding: '2rem', textAlign: 'center', borderLeft: '4px solid var(--secondary-green)'}}>
            <div style={{fontSize: '3rem', marginBottom: '1rem'}}>💰</div>
            <h3 style={{fontSize: '1.3rem', fontWeight: '600', marginBottom: '0.5rem'}}>Doações Financeiras</h3>
            <p style={{color: 'var(--text-light)'}}>Gerencie e registre doações em dinheiro</p>
          </div>
        </Link>
      </div>

      <div className="form-section" style={{textAlign: 'center', maxWidth: '600px', margin: '0 auto'}}>
        <h2 style={{fontSize: '1.8rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--primary-green)'}}>Sobre o Sistema</h2>
        <p style={{color: 'var(--text-light)', lineHeight: '1.6'}}>
          O SGC é um sistema destinado ao controle administrativo e gerenciamento das atividades 
          relacionadas à coleta, organização e distribuição de cestas básicas da ONG SEM FOME.
        </p>
      </div>
    </div>
  )
}