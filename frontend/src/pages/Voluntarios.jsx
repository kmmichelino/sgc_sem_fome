import { useState, useEffect } from 'react'
import { getVoluntarios, createVoluntario, updateVoluntario, deleteVoluntario } from '../services/api'

export default function Voluntarios() {
  const [voluntarios, setVoluntarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [selectedVoluntario, setSelectedVoluntario] = useState(null)
  const [editData, setEditData] = useState({})
  const [showUpdateMessage, setShowUpdateMessage] = useState(false)
  const [showCreateMessage, setShowCreateMessage] = useState(false)
  const [showDeleteMessage, setShowDeleteMessage] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    nome_usuario: '',
    senha: '',
    turno_disponivel: '',
    responsavel_por: {
      beneficiados: false,
      entradaProdutos: false,
      financeiro: false,
      patrocinadores: false,
      saidaProdutos: false
    }
  })

  useEffect(() => {
    carregarVoluntarios()
  }, [])

  const carregarVoluntarios = async () => {
    try {
      const data = await getVoluntarios()
      setVoluntarios(data.sort((a, b) => a.nome.localeCompare(b.nome)))
    } catch (error) {
      console.error('Erro ao carregar voluntários:', error)
      // Fallback para dados iniciais se a API falhar
      const voluntariosIniciais = [
        { id: 1, nome: 'Ana Silva', cpf: '123.456.789-01', telefone: '(11) 99999-1111', email: 'ana@ong.com', nome_usuario: 'ana.silva', turno_disponivel: 'Manhã', responsavel_por: '["Beneficiados", "Financeiro"]', status: 'Ativo' },
        { id: 2, nome: 'Carlos Santos', cpf: '987.654.321-02', telefone: '(11) 99999-2222', email: 'carlos@ong.com', nome_usuario: 'carlos.santos', turno_disponivel: 'Integral', responsavel_por: '["Entrada de Produtos", "Saída de Produtos"]', status: 'Ativo' },
        { id: 3, nome: 'Maria Oliveira', cpf: '111.222.333-03', telefone: '(11) 99999-3333', email: 'maria@ong.com', nome_usuario: 'maria.oliveira', turno_disponivel: 'Tarde', responsavel_por: '["Patrocinadores"]', status: 'Ativo' }
      ]
      setVoluntarios(voluntariosIniciais.sort((a, b) => a.nome.localeCompare(b.nome)))
    } finally {
      setLoading(false)
    }
  }

  const formatarCPF = (valor) => {
    const numeros = valor.replace(/\D/g, '')
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const handleCPFChange = (e) => {
    const valor = e.target.value
    const numerosSomente = valor.replace(/\D/g, '')
    
    if (numerosSomente.length <= 11) {
      const cpfFormatado = formatarCPF(numerosSomente)
      setFormData({...formData, cpf: cpfFormatado})
    }
  }

  const handleResponsavelChange = (area) => {
    setFormData({
      ...formData,
      responsavel_por: {
        ...formData.responsavel_por,
        [area]: !formData.responsavel_por[area]
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const responsaveis = Object.keys(formData.responsavel_por)
        .filter(key => formData.responsavel_por[key])
        .map(key => {
          const nomes = {
            beneficiados: 'Beneficiados',
            entradaProdutos: 'Entrada de Produtos',
            financeiro: 'Financeiro',
            patrocinadores: 'Patrocinadores',
            saidaProdutos: 'Saída de Produtos'
          }
          return nomes[key]
        })
      
      const dadosVoluntario = {
        nome: formData.nome,
        cpf: formData.cpf,
        telefone: formData.telefone,
        email: formData.email,
        nome_usuario: formData.nome_usuario,
        senha: formData.senha,
        turno_disponivel: formData.turno_disponivel,
        responsavel_por: JSON.stringify(responsaveis),
        status: 'Ativo'
      }
      
      await createVoluntario(dadosVoluntario)
      await carregarVoluntarios()
      
      // Notificar outras páginas que os voluntários foram atualizados
      window.dispatchEvent(new Event('voluntariosUpdated'))
      
      setFormData({
        nome: '',
        cpf: '',
        telefone: '',
        email: '',
        nome_usuario: '',
        senha: '',
        turno_disponivel: '',
        responsavel_por: {
          beneficiados: false,
          entradaProdutos: false,
          financeiro: false,
          patrocinadores: false,
          saidaProdutos: false
        }
      })
      setShowForm(false)
      setShowCreateMessage(true)
      setTimeout(() => {
        setShowCreateMessage(false)
      }, 3000)
    } catch (error) {
      alert('Erro ao cadastrar voluntário')
    }
  }

  const handleEdit = (voluntario) => {
    let responsavelArray = []
    try {
      responsavelArray = JSON.parse(voluntario.responsavel_por || '[]')
    } catch (e) {
      responsavelArray = []
    }
    
    const responsavelObj = {
      beneficiados: responsavelArray.includes('Beneficiados') || false,
      entradaProdutos: responsavelArray.includes('Entrada de Produtos') || false,
      financeiro: responsavelArray.includes('Financeiro') || false,
      patrocinadores: responsavelArray.includes('Patrocinadores') || false,
      saidaProdutos: responsavelArray.includes('Saída de Produtos') || false
    }
    
    setEditData({
      nome: voluntario.nome,
      cpf: voluntario.cpf,
      telefone: voluntario.telefone,
      email: voluntario.email,
      nomeUsuario: voluntario.nome_usuario,
      turnoDisponivel: voluntario.turno_disponivel || '',
      responsavelPor: responsavelObj,
      status: voluntario.status
    })
    setSelectedVoluntario(voluntario)
    setShowEdit(true)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const responsaveis = Object.keys(editData.responsavelPor)
        .filter(key => editData.responsavelPor[key])
        .map(key => {
          const nomes = {
            beneficiados: 'Beneficiados',
            entradaProdutos: 'Entrada de Produtos',
            financeiro: 'Financeiro',
            patrocinadores: 'Patrocinadores',
            saidaProdutos: 'Saída de Produtos'
          }
          return nomes[key]
        })
      
      const dadosAtualizados = {
        nome: editData.nome,
        cpf: editData.cpf,
        telefone: editData.telefone,
        email: editData.email,
        nome_usuario: editData.nomeUsuario,
        turno_disponivel: editData.turnoDisponivel,
        responsavel_por: JSON.stringify(responsaveis),
        status: editData.status
      }
      
      await updateVoluntario(selectedVoluntario.id, dadosAtualizados)
      await carregarVoluntarios()
      
      // Notificar outras páginas que os voluntários foram atualizados
      window.dispatchEvent(new Event('voluntariosUpdated'))
      
      setShowUpdateMessage(true)
      setTimeout(() => {
        setShowUpdateMessage(false)
        setShowEdit(false)
      }, 2000)
    } catch (error) {
      alert('Erro ao atualizar voluntário')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteVoluntario(selectedVoluntario.id)
      await carregarVoluntarios()
      
      // Notificar outras páginas que os voluntários foram atualizados
      window.dispatchEvent(new Event('voluntariosUpdated'))
      setShowDelete(false)
      setShowDeleteMessage(true)
      setTimeout(() => {
        setShowDeleteMessage(false)
      }, 3000)
    } catch (error) {
      alert('Erro ao excluir voluntário')
    }
  }

  if (loading) {
    return <div style={{padding: '20px'}}>Carregando...</div>
  }

  return (
    <div style={{padding: '20px', maxWidth: '1200px', margin: '0 auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h1 style={{fontSize: '24px', fontWeight: 'bold'}}>Voluntários</h1>
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
          {showForm ? 'Cancelar' : 'Novo Voluntário'}
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
                onChange={handleCPFChange}
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
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Nome de Usuário:</label>
              <input
                type="text"
                value={formData.nome_usuario}
                onChange={(e) => setFormData({...formData, nome_usuario: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                required
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Senha:</label>
              <input
                type="password"
                value={formData.senha}
                onChange={(e) => setFormData({...formData, senha: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                required
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Turno Disponível:</label>
              <select
                value={formData.turno_disponivel}
                onChange={(e) => setFormData({...formData, turno_disponivel: e.target.value})}
                style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
              >
                <option value="">Selecione</option>
                <option value="Manhã">Manhã</option>
                <option value="Tarde">Tarde</option>
                <option value="Noite">Noite</option>
                <option value="Diurno">Diurno</option>
                <option value="Noturno">Noturno</option>
                <option value="Integral">Integral</option>
              </select>
            </div>
            <div style={{gridColumn: '1 / -1'}}>
              <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Responsável por:</label>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px'}}>
                <label style={{display: 'flex', alignItems: 'center'}}>
                  <input
                    type="checkbox"
                    checked={formData.responsavel_por.beneficiados}
                    onChange={() => handleResponsavelChange('beneficiados')}
                    style={{marginRight: '8px'}}
                  />
                  Beneficiados
                </label>
                <label style={{display: 'flex', alignItems: 'center'}}>
                  <input
                    type="checkbox"
                    checked={formData.responsavel_por.entradaProdutos}
                    onChange={() => handleResponsavelChange('entradaProdutos')}
                    style={{marginRight: '8px'}}
                  />
                  Entrada de Produtos
                </label>
                <label style={{display: 'flex', alignItems: 'center'}}>
                  <input
                    type="checkbox"
                    checked={formData.responsavel_por.financeiro}
                    onChange={() => handleResponsavelChange('financeiro')}
                    style={{marginRight: '8px'}}
                  />
                  Financeiro
                </label>
                <label style={{display: 'flex', alignItems: 'center'}}>
                  <input
                    type="checkbox"
                    checked={formData.responsavel_por.patrocinadores}
                    onChange={() => handleResponsavelChange('patrocinadores')}
                    style={{marginRight: '8px'}}
                  />
                  Patrocinadores
                </label>
                <label style={{display: 'flex', alignItems: 'center'}}>
                  <input
                    type="checkbox"
                    checked={formData.responsavel_por.saidaProdutos}
                    onChange={() => handleResponsavelChange('saidaProdutos')}
                    style={{marginRight: '8px'}}
                  />
                  Saída de Produtos
                </label>
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
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>Email</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>Status</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '1px solid #e5e7eb'}}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {voluntarios.map((voluntario) => (
              <tr key={voluntario.id}>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>{voluntario.id}</td>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>{voluntario.nome}</td>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>{voluntario.cpf}</td>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>{voluntario.telefone}</td>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={voluntario.email}>{voluntario.email}</td>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    backgroundColor: voluntario.status === 'Ativo' ? '#dcfce7' : '#fee2e2',
                    color: voluntario.status === 'Ativo' ? '#166534' : '#991b1b'
                  }}>
                    {voluntario.status}
                  </span>
                </td>
                <td style={{padding: '12px', borderBottom: '1px solid #e5e7eb'}}>
                  <div style={{display: 'flex', gap: '5px', flexWrap: 'wrap'}}>
                    <button
                      onClick={() => {
                        setSelectedVoluntario(voluntario)
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
                      onClick={() => handleEdit(voluntario)}
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
                        setSelectedVoluntario(voluntario)
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

      {voluntarios.length === 0 && (
        <p style={{textAlign: 'center', marginTop: '20px', color: '#666'}}>
          Nenhum voluntário cadastrado.
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
            <h2 style={{marginBottom: '20px'}}>Detalhes do Voluntário</h2>
            {selectedVoluntario && (
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px'}}>
                <div><strong>Nome:</strong> {selectedVoluntario.nome}</div>
                <div><strong>CPF:</strong> {selectedVoluntario.cpf}</div>
                <div><strong>Telefone:</strong> {selectedVoluntario.telefone}</div>
                <div><strong>Email:</strong> {selectedVoluntario.email}</div>
                <div><strong>Usuário:</strong> {selectedVoluntario.nome_usuario}</div>
                <div><strong>Turno:</strong> {selectedVoluntario.turno_disponivel}</div>
                <div><strong>Status:</strong> {selectedVoluntario.status}</div>
                <div style={{gridColumn: '1 / -1'}}>
                  <strong>Responsável por:</strong> {(() => {
                    try {
                      const areas = JSON.parse(selectedVoluntario.responsavel_por || '[]')
                      return areas.join(', ') || 'Nenhuma área'
                    } catch (e) {
                      return 'Nenhuma área'
                    }
                  })()}
                </div>
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
            <h2 style={{marginBottom: '20px'}}>Editar Voluntário</h2>
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
                    placeholder="000.000.000-00"
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
                    placeholder="(11) 99999-9999"
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
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Nome de Usuário:</label>
                  <input
                    type="text"
                    value={editData.nomeUsuario}
                    onChange={(e) => setEditData({...editData, nomeUsuario: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                    required
                  />
                </div>
                <div>
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Turno Disponível:</label>
                  <select
                    value={editData.turnoDisponivel}
                    onChange={(e) => setEditData({...editData, turnoDisponivel: e.target.value})}
                    style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
                  >
                    <option value="">Selecione</option>
                    <option value="Manhã">Manhã</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noite">Noite</option>
                    <option value="Diurno">Diurno</option>
                    <option value="Noturno">Noturno</option>
                    <option value="Integral">Integral</option>
                  </select>
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
                  <label style={{display: 'block', marginBottom: '5px', fontWeight: '500'}}>Responsável por:</label>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px'}}>
                    <label style={{display: 'flex', alignItems: 'center'}}>
                      <input
                        type="checkbox"
                        checked={editData.responsavelPor?.beneficiados || false}
                        onChange={() => setEditData({
                          ...editData,
                          responsavelPor: {
                            ...editData.responsavelPor,
                            beneficiados: !editData.responsavelPor?.beneficiados
                          }
                        })}
                        style={{marginRight: '8px'}}
                      />
                      Beneficiados
                    </label>
                    <label style={{display: 'flex', alignItems: 'center'}}>
                      <input
                        type="checkbox"
                        checked={editData.responsavelPor?.entradaProdutos || false}
                        onChange={() => setEditData({
                          ...editData,
                          responsavelPor: {
                            ...editData.responsavelPor,
                            entradaProdutos: !editData.responsavelPor?.entradaProdutos
                          }
                        })}
                        style={{marginRight: '8px'}}
                      />
                      Entrada de Produtos
                    </label>
                    <label style={{display: 'flex', alignItems: 'center'}}>
                      <input
                        type="checkbox"
                        checked={editData.responsavelPor?.financeiro || false}
                        onChange={() => setEditData({
                          ...editData,
                          responsavelPor: {
                            ...editData.responsavelPor,
                            financeiro: !editData.responsavelPor?.financeiro
                          }
                        })}
                        style={{marginRight: '8px'}}
                      />
                      Financeiro
                    </label>
                    <label style={{display: 'flex', alignItems: 'center'}}>
                      <input
                        type="checkbox"
                        checked={editData.responsavelPor?.patrocinadores || false}
                        onChange={() => setEditData({
                          ...editData,
                          responsavelPor: {
                            ...editData.responsavelPor,
                            patrocinadores: !editData.responsavelPor?.patrocinadores
                          }
                        })}
                        style={{marginRight: '8px'}}
                      />
                      Patrocinadores
                    </label>
                    <label style={{display: 'flex', alignItems: 'center'}}>
                      <input
                        type="checkbox"
                        checked={editData.responsavelPor?.saidaProdutos || false}
                        onChange={() => setEditData({
                          ...editData,
                          responsavelPor: {
                            ...editData.responsavelPor,
                            saidaProdutos: !editData.responsavelPor?.saidaProdutos
                          }
                        })}
                        style={{marginRight: '8px'}}
                      />
                      Saída de Produtos
                    </label>
                  </div>
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
                  Voluntário Atualizado
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
              Tem certeza que deseja excluir o voluntário <strong>{selectedVoluntario?.nome}</strong>?
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
              Voluntário cadastrado com sucesso!
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
              Voluntário excluído com sucesso!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}