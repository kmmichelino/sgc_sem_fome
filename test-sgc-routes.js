// Usando fetch nativo do Node.js 18+

async function testSGCRoutes() {
  const baseURL = 'http://localhost:4000'
  
  try {
    console.log('🧪 Testando rotas do Sistema SGC...\n')
    
    // Testar rota principal
    console.log('1. Testando rota principal (/)')
    const mainResponse = await fetch(`${baseURL}/`)
    const mainData = await mainResponse.json()
    console.log('✓ Status:', mainResponse.status)
    console.log('✓ Endpoints disponíveis:', Object.keys(mainData.endpoints))
    
    // Testar rota de beneficiados
    console.log('\n2. Testando rota de beneficiados (/beneficiados)')
    const beneficiadosResponse = await fetch(`${baseURL}/beneficiados`)
    if (beneficiadosResponse.ok) {
      const beneficiadosData = await beneficiadosResponse.json()
      console.log('✓ Status:', beneficiadosResponse.status)
      console.log('✓ Beneficiados encontrados:', beneficiadosData.length)
      if (beneficiadosData.length > 0) {
        console.log('✓ Primeiro beneficiado:', beneficiadosData[0].nome)
      }
    } else {
      console.log('❌ Erro:', beneficiadosResponse.status, beneficiadosResponse.statusText)
    }
    
    // Testar rota de movimentações financeiras
    console.log('\n3. Testando rota de movimentações financeiras (/movimentacoes-financeiras)')
    const financeiroResponse = await fetch(`${baseURL}/movimentacoes-financeiras`)
    if (financeiroResponse.ok) {
      const financeiroData = await financeiroResponse.json()
      console.log('✓ Status:', financeiroResponse.status)
      console.log('✓ Movimentações encontradas:', financeiroData.length)
    } else {
      console.log('❌ Erro:', financeiroResponse.status, financeiroResponse.statusText)
    }
    
    // Testar rota de patrocinadores
    console.log('\n4. Testando rota de patrocinadores (/patrocinadores)')
    const patrocinadoresResponse = await fetch(`${baseURL}/patrocinadores`)
    if (patrocinadoresResponse.ok) {
      const patrocinadoresData = await patrocinadoresResponse.json()
      console.log('✓ Status:', patrocinadoresResponse.status)
      console.log('✓ Patrocinadores encontrados:', patrocinadoresData.length)
    } else {
      console.log('❌ Erro:', patrocinadoresResponse.status, patrocinadoresResponse.statusText)
    }
    
    // Testar criação de beneficiado
    console.log('\n5. Testando criação de beneficiado (POST /beneficiados)')
    const novoBeneficiado = {
      nome: 'Teste Sistema SGC',
      cpf: '000.000.000-99',
      telefone: '(11) 99999-0000',
      endereco: 'Rua de Teste, 123',
      numero_membros: 3,
      renda_familiar: 1000.00,
      observacoes: 'Cadastro de teste via API'
    }
    
    const createResponse = await fetch(`${baseURL}/beneficiados`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(novoBeneficiado)
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

testSGCRoutes()