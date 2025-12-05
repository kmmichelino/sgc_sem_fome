// Teste de conexão frontend-backend
const testConnection = async () => {
  try {
    console.log('Testando conexão com o backend...')
    
    const response = await fetch('http://localhost:4000/')
    const data = await response.json()
    
    console.log('✅ Conexão com backend OK')
    console.log('Endpoints disponíveis:', data.endpoints)
    
    // Testar rota de beneficiados
    const beneficiadosResponse = await fetch('http://localhost:4000/beneficiados')
    const beneficiadosData = await beneficiadosResponse.json()
    
    console.log('✅ Rota de beneficiados OK')
    console.log('Beneficiados encontrados:', beneficiadosData.length)
    
  } catch (error) {
    console.error('❌ Erro de conexão:', error)
  }
}

testConnection()