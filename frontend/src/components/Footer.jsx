function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 ml-64 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} SGC - Sistema de Gerenciamento e Controle - ONG SEM FOME
        </p>
      </div>
    </footer>
  )
}

export default Footer