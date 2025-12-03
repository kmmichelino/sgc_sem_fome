import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [erroUsuario, setErroUsuario] = useState('')
  const [erroSenha, setErroSenha] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setErroUsuario('')
    setErroSenha('')

    if (!usuario) {
      setErroUsuario('Preencha este campo')
      return
    }
    if (!senha) {
      setErroSenha('Insira uma senha')
      return
    }
    if (usuario !== 'dev') {
      setErroUsuario('Usuário não cadastrado')
      return
    }
    if (senha !== '1234') {
      setErroSenha('Senha Incorreta')
      return
    }

    onLogin()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-6">SGC - Login</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Usuário</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className={`w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500 ${erroUsuario ? 'border-red-500' : ''}`}
            />
            {erroUsuario && (
              <div className="text-red-500 text-sm mt-1">{erroUsuario}</div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className={`w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500 ${erroSenha ? 'border-red-500' : ''}`}
            />
            {erroSenha && (
              <div className="text-red-500 text-sm mt-1">{erroSenha}</div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white p-3 rounded hover:bg-orange-600 transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}