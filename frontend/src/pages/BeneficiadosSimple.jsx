import { useState, useEffect } from 'react'
import { getBeneficiados, createBeneficiado, updateBeneficiado, deleteBeneficiado } from '../services/api'

export default function BeneficiadosSimple() {
  const [beneficiados, setBeneficiados] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [selectedBeneficiado, setSelectedBeneficiado] = useState(null)
  const [editData, setEditData] = useState({})
  const [showUpdateMessage, setShowUpdateMessage] = useState(false)
  const [showCreateMessage, setShowCreateMessage] = useState(false)
  const [showDeleteMessage, setShowDeleteMessage] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    endereco: '',
    numero_membros: '1',
    renda_familiar: '',
    observacoes: ''
  })

  useEffect(() => {
    carregarBeneficiados()
  }, [])

  const carregarBeneficiados = async () => {
    try {
      const data = await getBeneficiados()
      setBeneficiados(data)
    } catch (error) {
      console.error('Erro ao carregar beneficiados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createBeneficiado({
        nome: formData.nome,
        cpf: formData.cpf,
        telefone: formData.telefone,
        endereco: formData.endereco,
        numero_membros: parseInt(formData.numero_membros) || 1,
        renda_familiar: formData.renda_familiar ? parseFloat(formData.renda_familiar) : null,
        observacoes: formData.observacoes || null,
        status: 'Ativo'
      })
      await carregarBeneficiados()
      setFormData({
        nome: '',
        cpf: '',
        telefone: '',
        endereco: '',
        numero_membros: '1',
        renda_familiar: '',
        observacoes: ''
      })
      setShowForm(false)
      setShowCreateMessage(true)
      setTimeout(() => {
        setShowCreateMessage(false)
      }, 3000)
    } catch (error) {
      alert('Erro ao cadastrar beneficiado')
    }
  }

  const handleEdit = (beneficiado) => {
    setEditData({
      nome: beneficiado.nome,
      cpf: beneficiado.cpf,
      telefone: beneficiado.telefone,
      endereco: beneficiado.endereco,
      numero_membros: beneficiado.numero_membros.toString(),
      renda_familiar: beneficiado.renda_familiar ? beneficiado.renda_familiar.toString() : '',
      observacoes: beneficiado.observacoes || '',
      status: beneficiado.status
    })
    setSelectedBeneficiado(beneficiado)
    setShowEdit(true)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      await updateBeneficiado(selectedBeneficiado.id, {
        nome: editData.nome,
        cpf: editData.cpf,
        telefone: editData.telefone,
        endereco: editData.endereco,
        numero_membros: parseInt(editData.numero_membros) || 1,
        renda_familiar: editData.renda_familiar ? parseFloat(editData.renda_familiar) : null,
        observacoes: editData.observacoes || null,
        status: editData.status
      })
      await carregarBeneficiados()
      setShowUpdateMessage(true)
      setTimeout(() => {
        setShowUpdateMessage(false)
        setShowEdit(false)
      }, 2000)
    } catch (error) {
      alert('Erro ao atualizar beneficiado')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteBeneficiado(selectedBeneficiado.id)
      await carregarBeneficiados()
      setShowDelete(false)
      setShowDeleteMessage(true)
      setTimeout(() => {
        setShowDeleteMessage(false)
      }, 3000)
    } catch (error) {
      alert('Erro ao excluir beneficiado')
    }
  }

  if (loading) {
    return <div style={{padding: '20px'}}>Carregando...</div>
  }

  return (
    <div style={{padding: '20px', maxWidth: '1200px', margin: '0 auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h1 style={{fontSize: '24px', fontWeight: 'bold'}}>Beneficiados</h1>
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
          {showForm ? 'Cancelar' : 'Novo Beneficiado'}
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
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Nome:</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                required
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>CPF:</label>
              <input
                type="text"
                value={formData.cpf}
                onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                maxLength="14"
                placeholder="000.000.000-00"
                required
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Telefone:</label>
              <input
                type="text"
                value={formData.telefone}
                onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                maxLength="20"
                placeholder="(11) 99999-9999"
                required
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Endereço:</label>
              <input
                type="text"
                value={formData.endereco}
                onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                required
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Membros da Família:</label>
              <input
                type="number"
                value={formData.numero_membros}
                onChange={(e) => setFormData({...formData, numero_membros: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                min="1"
                required
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Renda Familiar:</label>
              <input
                type="number"
                step="0.01"
                value={formData.renda_familiar}
                onChange={(e) => setFormData({...formData, renda_familiar: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
              />
            </div>
            <div style={{gridColumn: '1 / -1'}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Observações:</label>
              <textarea
                value={formData.observacoes}
                onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', minHeight: '80px'}}
                placeholder="Observações adicionais sobre o beneficiado..."
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
            Cadastrar
          </button>
        </form>
      )}

      <div style={{backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{backgroundColor: '#f9fafb'}}>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>ID</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>Nome</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>CPF</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>Telefone</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>Endereço</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>Membros</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>Renda</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>Status</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {beneficiados.map((beneficiado) => (
              <tr key={beneficiado.id}>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>{beneficiado.id}</td>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>{beneficiado.nome}</td>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>{beneficiado.cpf}</td>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>{beneficiado.telefone}</td>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={beneficiado.endereco}>{beneficiado.endereco}</td>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>{beneficiado.numero_membros}</td>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>R$ {beneficiado.renda_familiar ? parseFloat(beneficiado.renda_familiar).toFixed(2) : '0,00'}</td>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    backgroundColor: beneficiado.status === 'Ativo' ? '#dcfce7' : '#fee2e2',
                    color: beneficiado.status === 'Ativo' ? '#166534' : '#991b1b'
                  }}>
                    {beneficiado.status}
                  </span>
                </td>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>
                  <div style={{display: 'flex', gap: '5px', flexWrap: 'wrap'}}>
                    <button
                      onClick={() => {
                        setSelectedBeneficiado(beneficiado)
                        setShowDetails(true)
                      }}
                      style={{
                        backgroundColor: '#f97316',
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
                      onClick={() => handleEdit(beneficiado)}
                      style={{
                        backgroundColor: '#f59e0b',
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
                        setSelectedBeneficiado(beneficiado)
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

      {beneficiados.length === 0 && (
        <p style={{textAlign: 'center', marginTop: '20px', color: '#666'}}>
          Nenhum beneficiado cadastrado.
        </p>
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
            <h2 style={{marginBottom: '20px'}}>Editar Beneficiado</h2>
            <form onSubmit={handleUpdate}>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Nome:</label>
                  <input
                    type="text"
                    value={editData.nome}
                    onChange={(e) => setEditData({...editData, nome: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                    required
                  />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>CPF:</label>
                  <input
                    type="text"
                    value={editData.cpf}
                    onChange={(e) => setEditData({...editData, cpf: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                    maxLength="14"
                    required
                  />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Telefone:</label>
                  <input
                    type="text"
                    value={editData.telefone}
                    onChange={(e) => setEditData({...editData, telefone: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                    maxLength="20"
                    required
                  />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Endereço:</label>
                  <input
                    type="text"
                    value={editData.endereco}
                    onChange={(e) => setEditData({...editData, endereco: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                    required
                  />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Membros da Família:</label>
                  <input
                    type="number"
                    value={editData.numero_membros}
                    onChange={(e) => setEditData({...editData, numero_membros: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Renda Familiar:</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editData.renda_familiar}
                    onChange={(e) => setEditData({...editData, renda_familiar: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Status:</label>
                  <select
                    value={editData.status}
                    onChange={(e) => setEditData({...editData, status: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                    required
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>
                <div style={{gridColumn: '1 / -1'}}>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Observações:</label>
                  <textarea
                    value={editData.observacoes}
                    onChange={(e) => setEditData({...editData, observacoes: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', minHeight: '80px'}}
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
                  Beneficiado Atualizado
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
              Tem certeza que deseja excluir o beneficiado <strong>{selectedBeneficiado?.nome}</strong>?
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

      {/* Modal de Detalhes */}
      {showDetails && selectedBeneficiado && (
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
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
              <h2 style={{margin: 0, fontSize: '20px'}}>Detalhes do Beneficiado</h2>
              <button
                onClick={() => setShowDetails(false)}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '5px 10px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{display: 'grid', gap: '15px'}}>
              <div>
                <strong>ID:</strong> {selectedBeneficiado.id}
              </div>
              <div>
                <strong>Nome:</strong> {selectedBeneficiado.nome}
              </div>
              <div>
                <strong>CPF:</strong> {selectedBeneficiado.cpf}
              </div>
              <div>
                <strong>Telefone:</strong> {selectedBeneficiado.telefone}
              </div>
              <div>
                <strong>Endereço:</strong> {selectedBeneficiado.endereco}
              </div>
              <div>
                <strong>Número de Membros:</strong> {selectedBeneficiado.numero_membros}
              </div>
              <div>
                <strong>Renda Familiar:</strong> R$ {selectedBeneficiado.renda_familiar ? parseFloat(selectedBeneficiado.renda_familiar).toFixed(2) : '0,00'}
              </div>
              <div>
                <strong>Status:</strong> 
                <span style={{
                  marginLeft: '10px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  backgroundColor: selectedBeneficiado.status === 'Ativo' ? '#dcfce7' : '#fee2e2',
                  color: selectedBeneficiado.status === 'Ativo' ? '#166534' : '#991b1b'
                }}>
                  {selectedBeneficiado.status}
                </span>
              </div>
              {selectedBeneficiado.observacoes && (
                <div>
                  <strong>Observações:</strong>
                  <div style={{marginTop: '5px', padding: '10px', backgroundColor: '#f9fafb', borderRadius: '4px'}}>
                    {selectedBeneficiado.observacoes}
                  </div>
                </div>
              )}
              <div>
                <strong>Data de Cadastro:</strong> {selectedBeneficiado.data_cadastro ? new Date(selectedBeneficiado.data_cadastro).toLocaleDateString('pt-BR') : 'N/A'}
              </div>
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
              Beneficiado cadastrado com sucesso!
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
              Beneficiado excluído com sucesso!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}