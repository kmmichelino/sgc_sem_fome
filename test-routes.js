// Usando fetch nativo do Node.js 18+

async function testRoutes() {
  const baseURL = 'http://localhost:4000'
  
  try {
    console.log('🧪 Testando rotas do sistema SGC...\n')
    
    // Testar rota principal
    console.log('1. Testando rota principal (/)')
    const mainResponse = await fetch(`${baseURL}/`)
    const mainData = await mainResponse.json()
    console.log('✓ Status:', mainResponse.status)
    console.log('✓ Endpoints disponíveis:', Object.keys(mainData.endpoints))
    
    // Testar rota de tipos de objetos
    console.log('\n2. Testando rota de tipos de objetos (/tipos-objetos)')
    const tiposResponse = await fetch(`${baseURL}/tipos-objetos`)
    if (tiposResponse.ok) {
      const tiposData = await tiposResponse.json()
      console.log('✓ Status:', tiposResponse.status)
      console.log('✓ Tipos encontrados:', tiposData.length)
      console.log('✓ Primeiros tipos:', tiposData.slice(0, 3).map(t => t.nome))
    } else {
      console.log('❌ Erro:', tiposResponse.status, tiposResponse.statusText)
    }
    
    // Testar rota de achados
    console.log('\n3. Testando rota de achados (/achados)')
    const achadosResponse = await fetch(`${baseURL}/achados`)
    if (achadosResponse.ok) {
      const achadosData = await achadosResponse.json()
      console.log('✓ Status:', achadosResponse.status)
      console.log('✓ Achados encontrados:', achadosData.length)
    } else {
      console.log('❌ Erro:', achadosResponse.status, achadosResponse.statusText)
    }
    
    // Testar criação de achado
    console.log('\n4. Testando criação de achado (POST /achados)')
    const novoAchado = {
      nome_objeto: 'Teste - Carteira Preta',
      local_encontrado: 'Sala de Testes',
      data_encontrado: '2024-01-20',
      observacao: 'Teste de cadastro via API',
      tipo_objeto_id: 4, // Carteira
      nome_pessoa: 'Testador Sistema'
    }
    
    const createResponse = await fetch(`${baseURL}/achados`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(novoAchado)
    })
    
    if (createResponse.ok) {
      const createData = await createResponse.json()
      console.log('✓ Status:', createResponse.status)
      console.log('✓ Mensagem:', createData.message)
      console.log('✓ ID criado:', createData.id)
    } else {
      const errorData = await createResponse.json()
      console.log('❌ Erro:', createResponse.status)
      console.log('❌ Detalhes:', errorData)
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar rotas:', error.message)
  }
}

testRoutes()