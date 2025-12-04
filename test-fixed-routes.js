// Teste das rotas corrigidas

async function testRoutes() {
  const baseURL = 'http://localhost:4000'
  
  try {
    console.log('🧪 Testando rotas corrigidas...\n')
    
    // Aguardar um pouco para o servidor inicializar
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Testar GET beneficiados
    console.log('1. Testando GET /beneficiados')
    const getResponse = await fetch(`${baseURL}/beneficiados`)
    console.log('Status:', getResponse.status)
    
    if (getResponse.ok) {
      const data = await getResponse.json()
      console.log('✅ GET funcionando - Total:', data.length)
    } else {
      console.log('❌ GET falhou')
    }
    
    // Testar POST beneficiados
    console.log('\n2. Testando POST /beneficiados')
    const postData = {
      nome: 'Teste Rota Corrigida',
      cpf: '111.222.333-44',
      telefone: '(11) 99999-8888',
      endereco: 'Rua Teste Corrigida, 456',
      numero_membros: 2,
      renda_familiar: 1500.00
    }
    
    const postResponse = await fetch(`${baseURL}/beneficiados`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    })
    
    console.log('Status:', postResponse.status)
    const responseText = await postResponse.text()
    console.log('Response:', responseText)
    
    if (postResponse.ok) {
      console.log('✅ POST funcionando!')
    } else {
      console.log('❌ POST ainda com erro')
    }
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message)
  }
}

testRoutes()