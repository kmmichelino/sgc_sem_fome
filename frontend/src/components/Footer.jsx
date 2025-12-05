function Footer() {
  return (
    <footer className="text-white py-4 mt-auto" style={{backgroundColor: '#6b7280'}}>
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm" style={{color: 'white'}}>
          © {new Date().getFullYear()} SGC - Sistema de Gerenciamento e Controle - ONG SEM FOME
        </p>
      </div>
    </footer>
  )
}

export default Footer