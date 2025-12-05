import { useState, useEffect } from 'react'
import { registrarEntradaProduto, excluirEntradaProduto, getVoluntarios, getEntradasProdutos } from '../services/api'

export default function EntradaProdutos() {
  const [entradas, setEntradas] = useState([])
  const [voluntarios, setVoluntarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [selectedEntrada, setSelectedEntrada] = useState(null)
  const [editData, setEditData] = useState({})
  const [showUpdateMessage, setShowUpdateMessage] = useState(false)
  const [showCreateMessage, setShowCreateMessage] = useState(false)
  const [showDeleteMessage, setShowDeleteMessage] = useState(false)
  const [formData, setFormData] = useState({
    tipoProduto: '',
    produto: '',
    quantidade: '',
    unidade: '',
    dataEntrada: '',
    responsavel: '',
    parceiro: '',
    tipoDocumento: 'CPF',
    documento: ''
  })

  useEffect(() => {
    carregarEntradas()
    carregarVoluntarios()
    
    // Listener para atualizar voluntários quando um novo for cadastrado
    const handleVoluntariosUpdated = () => {
      carregarVoluntarios()
    }
    
    window.addEventListener('voluntariosUpdated', handleVoluntariosUpdated)
    
    return () => {
      window.removeEventListener('voluntariosUpdated', handleVoluntariosUpdated)
    }
  }, [])

  const carregarVoluntarios = async () => {
    try {
      const data = await getVoluntarios()
      setVoluntarios(data)
    } catch (error) {
      console.error('Erro ao carregar voluntários:', error)
      // Fallback para voluntários padrão
      setVoluntarios([
        { id: 1, nome: 'Ana Silva' },
        { id: 2, nome: 'Carlos Santos' },
        { id: 3, nome: 'Maria Oliveira' }
      ])
    }
  }

  const carregarEntradas = async () => {
    try {
      const data = await getEntradasProdutos()
      setEntradas(data.sort((a, b) => a.produto.localeCompare(b.produto)))
    } catch (error) {
      console.error('Erro ao carregar entradas:', error)
      // Fallback para dados iniciais se a API falhar
      const entradasIniciais = [
        { id: 1, cod_entrada: 1, tipo_produto: 'Alimento não Perecível', produto: 'Arroz', quantidade: '50', unidade: 'KG', data_entrada: '2024-01-15', responsavel: 'João', parceiro: 'Supermercado ABC', documento: '123.456.789-00' },
        { id: 2, cod_entrada: 2, tipo_produto: 'Alimento não Perecível', produto: 'Feijão', quantidade: '30', unidade: 'KG', data_entrada: '2024-01-14', responsavel: 'Maria', parceiro: 'Empresa XYZ', documento: '987.654.321-00' }
      ]
      setEntradas(entradasIniciais.sort((a, b) => a.produto.localeCompare(b.produto)))
    } finally {
      setLoading(false)
    }
  }

  const formatarDocumento = (valor, tipo) => {
    const numeros = valor.replace(/\D/g, '')
    if (tipo === 'CPF') {
      return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    } else {
      return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    }
  }

  const handleDocumentoChange = (e) => {
    const valor = e.target.value
    const numerosSomente = valor.replace(/\D/g, '')
    const maxLength = formData.tipoDocumento === 'CPF' ? 11 : 14
    
    if (numerosSomente.length <= maxLength) {
      const documentoFormatado = formatarDocumento(numerosSomente, formData.tipoDocumento)
      setFormData({...formData, documento: documentoFormatado})
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const dadosEntrada = {
        tipo_produto: formData.tipoProduto,
        produto: formData.produto,
        quantidade: parseInt(formData.quantidade),
        unidade: formData.unidade,
        data_entrada: formData.dataEntrada,
        responsavel: formData.responsavel,
        parceiro: formData.parceiro,
        documento: formData.documento
      }
      
      await registrarEntradaProduto(dadosEntrada)
      await carregarEntradas()
      
      window.dispatchEvent(new Event('entradasUpdated'))
      
      setFormData({
        tipoProduto: '',
        produto: '',
        quantidade: '',
        unidade: '',
        dataEntrada: '',
        responsavel: '',
        parceiro: '',
        tipoDocumento: 'CPF',
        documento: ''
      })
      setShowForm(false)
      setShowCreateMessage(true)
      setTimeout(() => {
        setShowCreateMessage(false)
      }, 3000)
    } catch (error) {
      alert('Erro ao registrar entrada')
    }
  }

  const handleEdit = (entrada) => {
    setEditData({
      tipoProduto: entrada.tipo_produto,
      produto: entrada.produto,
      quantidade: entrada.quantidade,
      unidade: entrada.unidade,
      dataEntrada: entrada.data_entrada,
      responsavel: entrada.responsavel,
      parceiro: entrada.parceiro || '',
      tipoDocumento: 'CPF',
      documento: entrada.documento || ''
    })
    setSelectedEntrada(entrada)
    setShowEdit(true)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      // Como não há API de update, vamos excluir e criar novamente
      await excluirEntradaProduto(selectedEntrada.id)
      
      const dadosEntrada = {
        tipo_produto: editData.tipoProduto,
        produto: editData.produto,
        quantidade: parseInt(editData.quantidade),
        unidade: editData.unidade,
        data_entrada: editData.dataEntrada,
        responsavel: editData.responsavel,
        parceiro: editData.parceiro,
        documento: editData.documento
      }
      
      await registrarEntradaProduto(dadosEntrada)
      await carregarEntradas()
      
      window.dispatchEvent(new Event('entradasUpdated'))
      
      setShowUpdateMessage(true)
      setTimeout(() => {
        setShowUpdateMessage(false)
        setShowEdit(false)
      }, 2000)
    } catch (error) {
      alert('Erro ao atualizar entrada')
    }
  }

  const handleDelete = async () => {
    try {
      await excluirEntradaProduto(selectedEntrada.id)
      await carregarEntradas()
      
      window.dispatchEvent(new Event('entradasUpdated'))
      setShowDelete(false)
      setShowDeleteMessage(true)
      setTimeout(() => {
        setShowDeleteMessage(false)
      }, 3000)
    } catch (error) {
      alert('Erro ao excluir entrada')
    }
  }

  if (loading) {
    return <div style={{padding: '20px'}}>Carregando...</div>
  }

  return (
    <div style={{padding: '20px', maxWidth: '1200px', margin: '0 auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h1 style={{fontSize: '24px', fontWeight: 'bold'}}>Entrada de Produtos</h1>
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
          {showForm ? 'Cancelar' : 'Nova Entrada'}
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
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Data da Entrada:</label>
              <input
                type="date"
                value={formData.dataEntrada}
                onChange={(e) => setFormData({...formData, dataEntrada: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                required
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Responsável:</label>
              <select
                value={formData.responsavel}
                onChange={(e) => setFormData({...formData, responsavel: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                required
              >
                <option value="">Selecione o responsável</option>
                {voluntarios.map((voluntario) => (
                  <option key={voluntario.id} value={voluntario.nome}>
                    {voluntario.nome}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Parceiro/Patrocinador:</label>
              <input
                type="text"
                value={formData.parceiro}
                onChange={(e) => setFormData({...formData, parceiro: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                placeholder="Nome do parceiro ou patrocinador"
                required
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Documento:</label>
              <div style={{display: 'flex', gap: '8px'}}>
                <select
                  value={formData.tipoDocumento}
                  onChange={(e) => setFormData({...formData, tipoDocumento: e.target.value, documento: ''})}
                  style={{padding: '8px', border: '1px solid #ccc', borderRadius: '4px', width: '80px'}}
                >
                  <option value="CPF">CPF</option>
                  <option value="CNPJ">CNPJ</option>
                </select>
                <input
                  type="text"
                  value={formData.documento}
                  onChange={handleDocumentoChange}
                  placeholder={formData.tipoDocumento === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'}
                  style={{flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                  required
                />
              </div>
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
            {entradas.map((entrada) => (
              <tr key={entrada.id}>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>{entrada.cod_entrada}</td>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>{entrada.produto}</td>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>{entrada.tipo_produto}</td>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>{entrada.quantidade} {entrada.unidade}</td>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>{new Date(entrada.data_entrada).toLocaleDateString()}</td>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>{entrada.responsavel}</td>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>
                  <div style={{display: 'flex', gap: '5px', flexWrap: 'wrap'}}>
                    <button
                      onClick={() => {
                        setSelectedEntrada(entrada)
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
                      onClick={() => handleEdit(entrada)}
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
                        setSelectedEntrada(entrada)
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

      {entradas.length === 0 && (
        <p style={{textAlign: 'center', marginTop: '20px', color: '#666'}}>
          Nenhuma entrada cadastrada.
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
            <h2 style={{marginBottom: '20px'}}>Detalhes da Entrada</h2>
            {selectedEntrada && (
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px'}}>
                <div><strong>Código:</strong> {selectedEntrada.cod_entrada}</div>
                <div><strong>Produto:</strong> {selectedEntrada.produto}</div>
                <div><strong>Tipo:</strong> {selectedEntrada.tipo_produto}</div>
                <div><strong>Quantidade:</strong> {selectedEntrada.quantidade} {selectedEntrada.unidade}</div>
                <div><strong>Data:</strong> {new Date(selectedEntrada.data_entrada).toLocaleDateString()}</div>
                <div><strong>Responsável:</strong> {selectedEntrada.responsavel}</div>
                <div><strong>Parceiro:</strong> {selectedEntrada.parceiro}</div>
                <div><strong>Documento:</strong> {selectedEntrada.documento}</div>
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
            <h2 style={{marginBottom: '20px'}}>Editar Entrada</h2>
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
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Data da Entrada:</label>
                  <input
                    type="date"
                    value={editData.dataEntrada}
                    onChange={(e) => setEditData({...editData, dataEntrada: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                    required
                  />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Responsável:</label>
                  <select
                    value={editData.responsavel}
                    onChange={(e) => setEditData({...editData, responsavel: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                    required
                  >
                    <option value="">Selecione o responsável</option>
                    {voluntarios.map((voluntario) => (
                      <option key={voluntario.id} value={voluntario.nome}>
                        {voluntario.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Parceiro/Patrocinador:</label>
                  <input
                    type="text"
                    value={editData.parceiro}
                    onChange={(e) => setEditData({...editData, parceiro: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                    required
                  />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Documento:</label>
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
                  Entrada Atualizada
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
              Tem certeza que deseja excluir a entrada do produto <strong>{selectedEntrada?.produto}</strong>?
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
              Entrada registrada com sucesso!
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
              Entrada excluída com sucesso!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}