import { useState, useEffect } from 'react'
import { getPatrocinadores, criarPatrocinador, atualizarPatrocinador, excluirPatrocinador } from '../services/api'

export default function PatrocinadoresSimple() {
  const [patrocinadores, setPatrocinadores] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [selectedPatrocinador, setSelectedPatrocinador] = useState(null)
  const [editData, setEditData] = useState({})
  const [showUpdateMessage, setShowUpdateMessage] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    tipo_documento: 'CPF',
    documento: '',
    rg: '',
    ie: '',
    data_nascimento: '',
    telefone: '',
    email: '',
    status_filiacao: 'Ativa',
    data_filiacao: ''
  })

  useEffect(() => {
    carregarPatrocinadores()
  }, [])

  const carregarPatrocinadores = async () => {
    try {
      const data = await getPatrocinadores()
      setPatrocinadores(data)
    } catch (error) {
      console.error('Erro ao carregar patrocinadores:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await criarPatrocinador({
        nome: formData.nome,
        tipo_documento: formData.tipo_documento,
        documento: formData.documento,
        rg: formData.rg || null,
        ie: formData.ie || null,
        data_nascimento: formData.data_nascimento || null,
        telefone: formData.telefone,
        email: formData.email,
        status_filiacao: 'Ativa',
        data_filiacao: formData.data_filiacao
      })
      await carregarPatrocinadores()
      setFormData({
        nome: '',
        tipo_documento: 'CPF',
        documento: '',
        rg: '',
        ie: '',
        data_nascimento: '',
        telefone: '',
        email: '',
        status_filiacao: 'Ativa',
        data_filiacao: ''
      })
      setShowForm(false)
      alert('Patrocinador cadastrado com sucesso!')
    } catch (error) {
      alert('Erro ao cadastrar patrocinador')
    }
  }

  const handleEdit = (patrocinador) => {
    // Formatar datas para o formato YYYY-MM-DD
    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toISOString().split('T')[0]
    }
    
    setEditData({
      nome: patrocinador.nome,
      tipo_documento: patrocinador.tipo_documento,
      documento: patrocinador.documento,
      rg: patrocinador.rg || '',
      ie: patrocinador.ie || '',
      data_nascimento: formatDate(patrocinador.data_nascimento),
      telefone: patrocinador.telefone,
      email: patrocinador.email,
      status_filiacao: patrocinador.status_filiacao,
      data_filiacao: formatDate(patrocinador.data_filiacao)
    })
    setSelectedPatrocinador(patrocinador)
    setShowEdit(true)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      await atualizarPatrocinador(selectedPatrocinador.id, {
        nome: editData.nome,
        tipo_documento: editData.tipo_documento,
        documento: editData.documento,
        rg: editData.rg || null,
        ie: editData.ie || null,
        data_nascimento: editData.data_nascimento || null,
        telefone: editData.telefone,
        email: editData.email,
        status_filiacao: editData.status_filiacao,
        data_filiacao: editData.data_filiacao
      })
      await carregarPatrocinadores()
      setShowUpdateMessage(true)
      setTimeout(() => {
        setShowUpdateMessage(false)
        setShowEdit(false)
      }, 2000)
    } catch (error) {
      alert('Erro ao atualizar patrocinador')
    }
  }

  const handleDelete = async () => {
    try {
      await excluirPatrocinador(selectedPatrocinador.id)
      await carregarPatrocinadores()
      setShowDelete(false)
      alert('Patrocinador excluído com sucesso!')
    } catch (error) {
      alert('Erro ao excluir patrocinador')
    }
  }

  if (loading) {
    return <div style={{padding: '20px'}}>Carregando...</div>
  }

  return (
    <div style={{padding: '20px', maxWidth: '1200px', margin: '0 auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h1 style={{fontSize: '24px', fontWeight: 'bold'}}>Patrocinadores</h1>
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
          {showForm ? 'Cancelar' : 'Novo Patrocinador'}
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
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Tipo Documento:</label>
              <select
                value={formData.tipo_documento}
                onChange={(e) => setFormData({...formData, tipo_documento: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                required
              >
                <option value="CPF">CPF</option>
                <option value="CNPJ">CNPJ</option>
              </select>
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Documento:</label>
              <input
                type="text"
                value={formData.documento}
                onChange={(e) => setFormData({...formData, documento: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                maxLength="20"
                placeholder={formData.tipo_documento === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'}
                required
              />
            </div>
            {formData.tipo_documento === 'CPF' && (
              <>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>RG:</label>
                  <input
                    type="text"
                    value={formData.rg}
                    onChange={(e) => setFormData({...formData, rg: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                    maxLength="20"
                  />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Data Nascimento:</label>
                  <input
                    type="date"
                    value={formData.data_nascimento}
                    onChange={(e) => setFormData({...formData, data_nascimento: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                  />
                </div>
              </>
            )}
            {formData.tipo_documento === 'CNPJ' && (
              <div>
                <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>IE:</label>
                <input
                  type="text"
                  value={formData.ie}
                  onChange={(e) => setFormData({...formData, ie: e.target.value})}
                  style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                  maxLength="20"
                />
              </div>
            )}
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
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Email:</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                required
              />
            </div>

            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Data Filiação:</label>
              <input
                type="date"
                value={formData.data_filiacao}
                onChange={(e) => setFormData({...formData, data_filiacao: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
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
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>Documento</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>Telefone</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>Email</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>Status</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {patrocinadores.map((patrocinador) => (
              <tr key={patrocinador.id}>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>{patrocinador.id}</td>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>{patrocinador.nome}</td>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>{patrocinador.documento}</td>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>{patrocinador.telefone}</td>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={patrocinador.email}>{patrocinador.email}</td>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    backgroundColor: patrocinador.status_filiacao === 'Ativa' ? '#dcfce7' : '#fee2e2',
                    color: patrocinador.status_filiacao === 'Ativa' ? '#166534' : '#991b1b'
                  }}>
                    {patrocinador.status_filiacao}
                  </span>
                </td>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>
                  <div style={{display: 'flex', gap: '5px', flexWrap: 'wrap'}}>
                    <button
                      onClick={() => {
                        setSelectedPatrocinador(patrocinador)
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
                      onClick={() => handleEdit(patrocinador)}
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
                        setSelectedPatrocinador(patrocinador)
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

      {patrocinadores.length === 0 && (
        <p style={{textAlign: 'center', marginTop: '20px', color: '#666'}}>
          Nenhum patrocinador cadastrado.
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
            <h2 style={{marginBottom: '20px'}}>Editar Patrocinador</h2>
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
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Tipo Documento:</label>
                  <select
                    value={editData.tipo_documento}
                    onChange={(e) => setEditData({...editData, tipo_documento: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                    required
                  >
                    <option value="CPF">CPF</option>
                    <option value="CNPJ">CNPJ</option>
                  </select>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Documento:</label>
                  <input
                    type="text"
                    value={editData.documento}
                    onChange={(e) => setEditData({...editData, documento: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                    maxLength="20"
                    required
                  />
                </div>
                {editData.tipo_documento === 'CPF' && (
                  <>
                    <div>
                      <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>RG:</label>
                      <input
                        type="text"
                        value={editData.rg}
                        onChange={(e) => setEditData({...editData, rg: e.target.value})}
                        style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                        maxLength="20"
                      />
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Data Nascimento:</label>
                      <input
                        type="date"
                        value={editData.data_nascimento}
                        onChange={(e) => setEditData({...editData, data_nascimento: e.target.value})}
                        style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                      />
                    </div>
                  </>
                )}
                {editData.tipo_documento === 'CNPJ' && (
                  <div>
                    <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>IE:</label>
                    <input
                      type="text"
                      value={editData.ie}
                      onChange={(e) => setEditData({...editData, ie: e.target.value})}
                      style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                      maxLength="20"
                    />
                  </div>
                )}
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
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Email:</label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                    required
                  />
                </div>

                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Status:</label>
                  <select
                    value={editData.status_filiacao}
                    onChange={(e) => setEditData({...editData, status_filiacao: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                    required
                  >
                    <option value="Ativa">Ativa</option>
                    <option value="Inativa">Inativa</option>
                  </select>
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Data Filiação:</label>
                  <input
                    type="date"
                    value={editData.data_filiacao}
                    onChange={(e) => setEditData({...editData, data_filiacao: e.target.value})}
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
                  Patrocinador Atualizado
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
              Tem certeza que deseja excluir o patrocinador <strong>{selectedPatrocinador?.nome}</strong>?
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
      {showDetails && selectedPatrocinador && (
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
              <h2 style={{margin: 0, fontSize: '20px'}}>Detalhes do Patrocinador</h2>
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
                <strong>ID:</strong> {selectedPatrocinador.id}
              </div>
              <div>
                <strong>Nome:</strong> {selectedPatrocinador.nome}
              </div>
              <div>
                <strong>Tipo Documento:</strong> {selectedPatrocinador.tipo_documento}
              </div>
              <div>
                <strong>Documento:</strong> {selectedPatrocinador.documento}
              </div>
              {selectedPatrocinador.rg && (
                <div>
                  <strong>RG:</strong> {selectedPatrocinador.rg}
                </div>
              )}
              {selectedPatrocinador.ie && (
                <div>
                  <strong>IE:</strong> {selectedPatrocinador.ie}
                </div>
              )}
              {selectedPatrocinador.data_nascimento && (
                <div>
                  <strong>Data Nascimento:</strong> {new Date(selectedPatrocinador.data_nascimento).toLocaleDateString('pt-BR')}
                </div>
              )}
              <div>
                <strong>Telefone:</strong> {selectedPatrocinador.telefone}
              </div>
              <div>
                <strong>Email:</strong> {selectedPatrocinador.email}
              </div>
              <div>
                <strong>Status Filiação:</strong> 
                <span style={{
                  marginLeft: '10px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  backgroundColor: selectedPatrocinador.status_filiacao === 'Ativa' ? '#dcfce7' : '#fee2e2',
                  color: selectedPatrocinador.status_filiacao === 'Ativa' ? '#166534' : '#991b1b'
                }}>
                  {selectedPatrocinador.status_filiacao}
                </span>
              </div>
              <div>
                <strong>Data Filiação:</strong> {selectedPatrocinador.data_filiacao ? new Date(selectedPatrocinador.data_filiacao).toLocaleDateString('pt-BR') : 'N/A'}
              </div>
              <div>
                <strong>Data de Cadastro:</strong> {selectedPatrocinador.data_cadastro ? new Date(selectedPatrocinador.data_cadastro).toLocaleDateString('pt-BR') : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}