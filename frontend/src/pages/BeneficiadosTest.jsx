import { useState, useEffect } from 'react'
import { getBeneficiados } from '../services/api'

export default function BeneficiadosTest() {
  const [beneficiados, setBeneficiados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    carregarBeneficiados()
  }, [])

  const carregarBeneficiados = async () => {
    try {
      setLoading(true)
      const data = await getBeneficiados()
      setBeneficiados(data)
      setError(null)
    } catch (error) {
      console.error('Erro ao carregar beneficiados:', error)
      setError('Erro ao carregar beneficiados: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div style={{padding: '20px'}}>Carregando beneficiados...</div>
  }

  if (error) {
    return <div style={{padding: '20px', color: 'red'}}>Erro: {error}</div>
  }

  return (
    <div style={{padding: '20px'}}>
      <h1>Beneficiados - Teste</h1>
      <p>Total de beneficiados: {beneficiados.length}</p>
      
      {beneficiados.length > 0 ? (
        <table style={{width: '100%', border: '1px solid #ccc', marginTop: '20px'}}>
          <thead>
            <tr style={{backgroundColor: '#f5f5f5'}}>
              <th style={{border: '1px solid #ccc', padding: '8px'}}>ID</th>
              <th style={{border: '1px solid #ccc', padding: '8px'}}>Nome</th>
              <th style={{border: '1px solid #ccc', padding: '8px'}}>CPF</th>
              <th style={{border: '1px solid #ccc', padding: '8px'}}>Status</th>
            </tr>
          </thead>
          <tbody>
            {beneficiados.map((beneficiado) => (
              <tr key={beneficiado.id}>
                <td style={{border: '1px solid #ccc', padding: '8px'}}>{beneficiado.id}</td>
                <td style={{border: '1px solid #ccc', padding: '8px'}}>{beneficiado.nome}</td>
                <td style={{border: '1px solid #ccc', padding: '8px'}}>{beneficiado.cpf}</td>
                <td style={{border: '1px solid #ccc', padding: '8px'}}>{beneficiado.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nenhum beneficiado encontrado.</p>
      )}
    </div>
  )
}