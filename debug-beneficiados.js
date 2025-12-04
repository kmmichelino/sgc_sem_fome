// Usando fetch nativo do Node.js 18+

async function debugBeneficiados() {
  const baseURL = 'http://localhost:4000'
  
  try {
    console.log('🔍 Testando POST /beneficiados...\n')
    
    const dadosTeste = {
      nome: 'Teste Debug',
      cpf: '123.456.789-00',
      telefone: '(11) 99999-9999',
      endereco: 'Rua Teste, 123',
      numero_membros: 3,
      renda_familiar: 1000.50
    }
    
    console.log('Dados enviados:', JSON.stringify(dadosTeste, null, 2))
    
    const response = await fetch(`${baseURL}/beneficiados`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosTeste)
    })
    
    console.log('Status:', response.status)
    console.log('Headers:', Object.fromEntries(response.headers.entries()))
    
    const responseText = await response.text()
    console.log('Response body:', responseText)
    
    if (!response.ok) {
      console.log('❌ Erro:', response.status, response.statusText)
    } else {
      console.log('✅ Sucesso!')
    }
    
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message)
  }
}

debugBeneficiados()