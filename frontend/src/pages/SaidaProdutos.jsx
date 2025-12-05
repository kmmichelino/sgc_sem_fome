import { useState, useEffect } from 'react'

export default function SaidaProdutos() {
  const [saidas, setSaidas] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [selectedSaida, setSelectedSaida] = useState(null)
  const [editData, setEditData] = useState({})
  const [showUpdateMessage, setShowUpdateMessage] = useState(false)
  const [showCreateMessage, setShowCreateMessage] = useState(false)
  const [showDeleteMessage, setShowDeleteMessage] = useState(false)
  const [formData, setFormData] = useState({
    tipoProduto: '',
    produto: '',
    quantidade: '',
    unidade: '',
    dataSaida: '',
    responsavel: '',
    familiaBeneficiada: '',
    documento: ''
  })

  useEffect(() => {
    carregarSaidas()
  }, [])

  const carregarSaidas = async () => {
    try {
      const saidasSalvas = JSON.parse(localStorage.getItem('saidas') || '[]')
      
      const saidasIniciais = [
        { id: 1, cod_saida: 1, tipo_produto: 'Alimento não Perecível', produto: 'Arroz', quantidade: '5', unidade: 'KG', data_saida: '2024-01-20', responsavel: 'João', familia_beneficiada: 'Família Silva', documento: '123.456.789-00' },
        { id: 2, cod_saida: 2, tipo_produto: 'Higiene Pessoal', produto: 'Sabonete', quantidade: '10', unidade: 'UN', data_saida: '2024-01-19', responsavel: 'Maria', familia_beneficiada: 'Família Santos', documento: '987.654.321-00' },
        { id: 3, cod_saida: 3, tipo_produto: 'Alimento não Perecível', produto: 'Feijão', quantidade: '3', unidade: 'KG', data_saida: '2024-01-18', responsavel: 'Pedro', familia_beneficiada: 'Família Oliveira', documento: '111.222.333-44' },
        { id: 4, cod_saida: 4, tipo_produto: 'Roupas', produto: 'Camiseta', quantidade: '5', unidade: 'UN', data_saida: '2024-01-17', responsavel: 'Ana', familia_beneficiada: 'Família Costa', documento: '555.666.777-88' },
        { id: 5, cod_saida: 5, tipo_produto: 'Alimento Perecível', produto: 'Leite', quantidade: '2', unidade: 'L', data_saida: '2024-01-16', responsavel: 'Carlos', familia_beneficiada: 'Família Ferreira', documento: '999.888.777-66' },
        { id: 6, cod_saida: 6, tipo_produto: 'Higiene Pessoal', produto: 'Pasta de Dente', quantidade: '8', unidade: 'UN', data_saida: '2024-01-15', responsavel: 'Lucia', familia_beneficiada: 'Família Mendes', documento: '444.333.222-11' }
      ]
      
      if (saidasSalvas.length === 0) {
        localStorage.setItem('saidas', JSON.stringify(saidasIniciais))
        setSaidas(saidasIniciais.sort((a, b) => a.produto.localeCompare(b.produto)))
      } else {
        setSaidas(saidasSalvas.sort((a, b) => a.produto.localeCompare(b.produto)))
      }
    } catch (error) {
      console.error('Erro ao carregar saídas:', error)
      const saidasIniciais = [
        { id: 1, cod_saida: 1, tipo_produto: 'Alimento não Perecível', produto: 'Arroz', quantidade: '5', unidade: 'KG', data_saida: '2024-01-20', responsavel: 'João', familia_beneficiada: 'Família Silva', documento: '123.456.789-00' },
        { id: 2, cod_saida: 2, tipo_produto: 'Higiene Pessoal', produto: 'Sabonete', quantidade: '10', unidade: 'UN', data_saida: '2024-01-19', responsavel: 'Maria', familia_beneficiada: 'Família Santos', documento: '987.654.321-00' }
      ]
      setSaidas(saidasIniciais.sort((a, b) => a.produto.localeCompare(b.produto)))
    } finally {
      setLoading(false)
    }
  }

  const formatarCPF = (valor) => {
    const numeros = valor.replace(/\D/g, '')
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const handleDocumentoChange = (e) => {
    const valor = e.target.value
    const numerosSomente = valor.replace(/\D/g, '')
    
    if (numerosSomente.length <= 11) {
      const cpfFormatado = formatarCPF(numerosSomente)
      setFormData({...formData, documento: cpfFormatado})
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const novaSaida = {
        id: Date.now(),
        cod_saida: saidas.length + 1,
        tipo_produto: formData.tipoProduto,
        produto: formData.produto,
        quantidade: formData.quantidade,
        unidade: formData.unidade,
        data_saida: formData.dataSaida,
        responsavel: formData.responsavel,
        familia_beneficiada: formData.familiaBeneficiada,
        documento: formData.documento
      }
      
      const novasSaidas = [...saidas, novaSaida]
      setSaidas(novasSaidas.sort((a, b) => a.produto.localeCompare(b.produto)))
      localStorage.setItem('saidas', JSON.stringify(novasSaidas))
      
      window.dispatchEvent(new Event('saidasUpdated'))
      
      setFormData({
        tipoProduto: '',
        produto: '',
        quantidade: '',
        unidade: '',
        dataSaida: '',
        responsavel: '',
        familiaBeneficiada: '',
        documento: ''
      })
      setShowForm(false)
      setShowCreateMessage(true)
      setTimeout(() => {
        setShowCreateMessage(false)
      }, 3000)
    } catch (error) {
      alert('Erro ao registrar saída')
    }
  }

  const handleEdit = (saida) => {
    setEditData({
      tipoProduto: saida.tipo_produto,
      produto: saida.produto,
      quantidade: saida.quantidade,
      unidade: saida.unidade,
      dataSaida: saida.data_saida,
      responsavel: saida.responsavel,
      familiaBeneficiada: saida.familia_beneficiada || '',
      documento: saida.documento || ''
    })
    setSelectedSaida(saida)
    setShowEdit(true)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const saidasAtualizadas = saidas.map(saida => 
        saida.id === selectedSaida.id 
          ? {
              ...saida,
              tipo_produto: editData.tipoProduto,
              produto: editData.produto,
              quantidade: editData.quantidade,
              unidade: editData.unidade,
              data_saida: editData.dataSaida,
              responsavel: editData.responsavel,
              familia_beneficiada: editData.familiaBeneficiada,
              documento: editData.documento
            }
          : saida
      )
      setSaidas(saidasAtualizadas.sort((a, b) => a.produto.localeCompare(b.produto)))
      localStorage.setItem('saidas', JSON.stringify(saidasAtualizadas))
      
      window.dispatchEvent(new Event('saidasUpdated'))
      
      setShowUpdateMessage(true)
      setTimeout(() => {
        setShowUpdateMessage(false)
        setShowEdit(false)
      }, 2000)
    } catch (error) {
      alert('Erro ao atualizar saída')
    }
  }

  const handleDelete = async () => {
    try {
      const novasSaidas = saidas.filter(saida => saida.id !== selectedSaida.id)
      setSaidas(novasSaidas)
      localStorage.setItem('saidas', JSON.stringify(novasSaidas))
      
      window.dispatchEvent(new Event('saidasUpdated'))
      setShowDelete(false)
      setShowDeleteMessage(true)
      setTimeout(() => {
        setShowDeleteMessage(false)
      }, 3000)
    } catch (error) {
      alert('Erro ao excluir saída')
    }
  }

  if (loading) {
    return <div style={{padding: '20px'}}>Carregando...</div>
  }

  return (
    <div style={{padding: '20px', maxWidth: '1200px', margin: '0 auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h1 style={{fontSize: '24px', fontWeight: 'bold'}}>Saída de Produtos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            backgroundColor: '#f97316',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {showForm ? 'Cancelar' : 'Nova Saída'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px'}}>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Tipo de Produto:</label>
              <select
                value={formData.tipoProduto}
                onChange={(e) => setFormData({...formData, tipoProduto: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                required
              >
                <option value="">Selecione o tipo</option>
                <option value="Alimento Perecível">Alimento Perecível</option>
                <option value="Alimento não Perecível">Alimento não Perecível</option>
                <option value="Higiene Pessoal">Higiene Pessoal</option>
                <option value="Roupas">Roupas</option>
              </select>
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Produto:</label>
              <input
                type="text"
                value={formData.produto}
                onChange={(e) => setFormData({...formData, produto: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                required
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Quantidade:</label>
              <input
                type="text"
                value={formData.quantidade}
                onChange={(e) => setFormData({...formData, quantidade: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                required
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Unidade:</label>
              <select
                value={formData.unidade}
                onChange={(e) => setFormData({...formData, unidade: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                required
              >
                <option value="">Selecione a unidade</option>
                <option value="UN">UN</option>
                <option value="G">G</option>
                <option value="KG">KG</option>
                <option value="L">L</option>
              </select>
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Data de Saída:</label>
              <input
                type="date"
                value={formData.dataSaida}
                onChange={(e) => setFormData({...formData, dataSaida: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                required
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Responsável:</label>
              <input
                type="text"
                value={formData.responsavel}
                onChange={(e) => setFormData({...formData, responsavel: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                required
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Família Beneficiada:</label>
              <input
                type="text"
                value={formData.familiaBeneficiada}
                onChange={(e) => setFormData({...formData, familiaBeneficiada: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                placeholder="Responsável Familiar"
                required
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>CPF:</label>
              <input
                type="text"
                value={formData.documento}
                onChange={handleDocumentoChange}
                placeholder="000.000.000-00"
                style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                maxLength="14"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '15px'
            }}
          >
            Registrar
          </button>
        </form>
      )}

      <div style={{backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{backgroundColor: '#f9fafb'}}>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>Cód.</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>Produto</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>Tipo</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>Quantidade</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>Data</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>Responsável</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {saidas.map((saida) => (
              <tr key={saida.id}>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>{saida.cod_saida}</td>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>{saida.produto}</td>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>{saida.tipo_produto}</td>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>{saida.quantidade} {saida.unidade}</td>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>{new Date(saida.data_saida).toLocaleDateString()}</td>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>{saida.responsavel}</td>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>
                  <div style={{display: 'flex', gap: '5px', flexWrap: 'wrap'}}>
                    <button
                      onClick={() => {
                        setSelectedSaida(saida)
                        setShowDetails(true)
                      }}
                      style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        padding: '4px 8px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '11px'
                      }}
                    >
                      Detalhes
                    </button>
                    <button
                      onClick={() => handleEdit(saida)}
                      style={{
                        backgroundColor: '#6b7280',
                        color: 'white',
                        padding: '4px 8px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '11px'
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setSelectedSaida(saida)
                        setShowDelete(true)
                      }}
                      style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        padding: '4px 8px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '11px'
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {saidas.length === 0 && (
        <p style={{textAlign: 'center', marginTop: '20px', color: '#666'}}>
          Nenhuma saída cadastrada.
        </p>
      )}

      {/* Modal de Detalhes */}
      {showDetails && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h2 style={{marginBottom: '20px'}}>Detalhes da Saída</h2>
            {selectedSaida && (
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px'}}>
                <div><strong>Código:</strong> {selectedSaida.cod_saida}</div>
                <div><strong>Produto:</strong> {selectedSaida.produto}</div>
                <div><strong>Tipo:</strong> {selectedSaida.tipo_produto}</div>
                <div><strong>Quantidade:</strong> {selectedSaida.quantidade} {selectedSaida.unidade}</div>
                <div><strong>Data:</strong> {new Date(selectedSaida.data_saida).toLocaleDateString()}</div>
                <div><strong>Responsável:</strong> {selectedSaida.responsavel}</div>
                <div><strong>Família:</strong> {selectedSaida.familia_beneficiada}</div>
                <div><strong>CPF:</strong> {selectedSaida.documento}</div>
              </div>
            )}
            <div style={{marginTop: '20px', textAlign: 'center'}}>
              <button
                onClick={() => setShowDetails(false)}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}
      {showEdit && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h2 style={{marginBottom: '20px'}}>Editar Saída</h2>
            <form onSubmit={handleUpdate}>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Tipo de Produto:</label>
                  <select
                    value={editData.tipoProduto}
                    onChange={(e) => setEditData({...editData, tipoProduto: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                    required
                  >
                    <option value="">Selecione o tipo</option>
                    <option value="Alimento Perecível">Alimento Perecível</option>
                    <option value="Alimento não Perecível">Alimento não Perecível</option>
                    <option value="Higiene Pessoal">Higiene Pessoal</option>
                    <option value="Roupas">Roupas</option>
                  </select>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Produto:</label>
                  <input
                    type="text"
                    value={editData.produto}
                    onChange={(e) => setEditData({...editData, produto: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                    required
                  />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Quantidade:</label>
                  <input
                    type="text"
                    value={editData.quantidade}
                    onChange={(e) => setEditData({...editData, quantidade: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                    required
                  />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Unidade:</label>
                  <select
                    value={editData.unidade}
                    onChange={(e) => setEditData({...editData, unidade: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                    required
                  >
                    <option value="">Selecione a unidade</option>
                    <option value="UN">UN</option>
                    <option value="G">G</option>
                    <option value="KG">KG</option>
                    <option value="L">L</option>
                  </select>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Data de Saída:</label>
                  <input
                    type="date"
                    value={editData.dataSaida}
                    onChange={(e) => setEditData({...editData, dataSaida: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                    required
                  />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Responsável:</label>
                  <input
                    type="text"
                    value={editData.responsavel}
                    onChange={(e) => setEditData({...editData, responsavel: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                    required
                  />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Família Beneficiada:</label>
                  <input
                    type="text"
                    value={editData.familiaBeneficiada}
                    onChange={(e) => setEditData({...editData, familiaBeneficiada: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                    required
                  />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>CPF:</label>
                  <input
                    type="text"
                    value={editData.documento}
                    onChange={(e) => setEditData({...editData, documento: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                    required
                  />
                </div>
              </div>
              <div style={{marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
                <button
                  type="button"
                  onClick={() => setShowEdit(false)}
                  style={{
                    backgroundColor: '#6b7280',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#10b981',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Salvar
                </button>
              </div>
              {showUpdateMessage && (
                <div style={{
                  marginTop: '15px',
                  textAlign: 'center',
                  color: '#10b981',
                  fontWeight: '500',
                  fontSize: '16px'
                }}>
                  Saída Atualizada
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Modal de Exclusão */}
      {showDelete && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h3 style={{marginBottom: '15px', textAlign: 'center'}}>Confirmar Exclusão</h3>
            <p style={{marginBottom: '20px', textAlign: 'center'}}>
              Tem certeza que deseja excluir a saída do produto <strong>{selectedSaida?.produto}</strong>?
            </p>
            <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
              <button
                onClick={() => setShowDelete(false)}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Cadastro */}
      {showCreateMessage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '48px',
              color: '#10b981',
              marginBottom: '15px'
            }}>
              ✓
            </div>
            <h3 style={{
              marginBottom: '10px',
              color: '#10b981',
              fontSize: '18px'
            }}>
              Sucesso!
            </h3>
            <p style={{
              margin: 0,
              color: '#666',
              fontSize: '16px'
            }}>
              Saída registrada com sucesso!
            </p>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteMessage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '48px',
              color: '#ef4444',
              marginBottom: '15px'
            }}>
              ✓
            </div>
            <h3 style={{
              marginBottom: '10px',
              color: '#ef4444',
              fontSize: '18px'
            }}>
              Excluído!
            </h3>
            <p style={{
              margin: 0,
              color: '#666',
              fontSize: '16px'
            }}>
              Saída excluída com sucesso!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}