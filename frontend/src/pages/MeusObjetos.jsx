import { useState, useEffect } from 'react'
import { Container, Table, Button, Spinner, Alert, Badge, Modal, Form, Row, Col } from 'react-bootstrap'
import { getAchados, deleteAchado, updateAchado, getTiposObjetos } from '../services/api'

function MeusObjetos() {
  const [objetos, setObjetos] = useState([])
  const [tiposObjetos, setTiposObjetos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [objetoToDelete, setObjetoToDelete] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [objetoToEdit, setObjetoToEdit] = useState(null)
  const [editFormData, setEditFormData] = useState({})
  const [editErrors, setEditErrors] = useState({})
  const [editLoading, setEditLoading] = useState(false)

  useEffect(() => {
    loadObjetos()
    loadTiposObjetos()
  }, [])

  const loadObjetos = async () => {
    try {
      setLoading(true)
      const data = await getAchados()
      setObjetos(data)
      setError(null)
    } catch (err) {
      console.error('Erro ao carregar objetos:', err)
      setError('Erro ao carregar objetos. Verifique se o backend está rodando.')
    } finally {
      setLoading(false)
    }
  }

  const loadTiposObjetos = async () => {
    try {
      const data = await getTiposObjetos()
      setTiposObjetos(data)
    } catch (err) {
      console.error('Erro ao carregar tipos de objetos:', err)
    }
  }

  const handleDeleteClick = (objeto) => {
    setObjetoToDelete(objeto)
    setShowModal(true)
  }

  const handleEditClick = (objeto) => {
    const dataEncontrado = objeto.data_encontrado.split('T')[0]
    setObjetoToEdit(objeto)
    setEditFormData({
      nome_objeto: objeto.nome_objeto,
      local_encontrado: objeto.local_encontrado,
      data_encontrado: dataEncontrado,
      observacao: objeto.observacao || '',
      tipo_objeto_id: objeto.tipo_objeto_id.toString(),
      url_foto: objeto.url_foto || '',
      nome_pessoa: objeto.nome_pessoa,
      status: objeto.status
    })
    setEditErrors({})
    setShowEditModal(true)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (editErrors[name]) {
      setEditErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateEditForm = () => {
    const newErrors = {}

    if (!editFormData.nome_objeto?.trim()) {
      newErrors.nome_objeto = 'O nome do objeto é obrigatório'
    }

    if (!editFormData.local_encontrado?.trim()) {
      newErrors.local_encontrado = 'O local onde foi encontrado é obrigatório'
    }

    if (!editFormData.data_encontrado) {
      newErrors.data_encontrado = 'A data em que o objeto foi encontrado é obrigatória'
    } else {
      const dataEncontrado = new Date(editFormData.data_encontrado)
      const hoje = new Date()
      hoje.setHours(0, 0, 0, 0)

      if (dataEncontrado > hoje) {
        newErrors.data_encontrado = 'A data não pode ser no futuro'
      }
    }

    if (!editFormData.tipo_objeto_id) {
      newErrors.tipo_objeto_id = 'Escolha o tipo do objeto'
    }

    if (!editFormData.nome_pessoa?.trim()) {
      newErrors.nome_pessoa = 'O nome da pessoa que encontrou é obrigatório'
    }

    if (editFormData.url_foto && !isValidUrl(editFormData.url_foto)) {
      newErrors.url_foto = 'URL da foto inválida'
    }

    setEditErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleConfirmEdit = async () => {
    if (!objetoToEdit || !validateEditForm()) {
      setError('Por favor, corrija os erros no formulário')
      return
    }

    try {
      setEditLoading(true)
      setError(null)

      const dataToSend = {
        ...editFormData,
        tipo_objeto_id: parseInt(editFormData.tipo_objeto_id)
      }

      await updateAchado(objetoToEdit.id, dataToSend)

      setSuccess(`Objeto "${editFormData.nome_objeto}" atualizado com sucesso!`)
      setShowEditModal(false)
      setObjetoToEdit(null)
      loadObjetos()
    } catch (err) {
      console.error('Erro ao atualizar objeto:', err)
      setError(err.response?.data?.error || 'Erro ao atualizar objeto. Tente novamente.')
    } finally {
      setEditLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!objetoToDelete) return

    try {
      await deleteAchado(objetoToDelete.id)
      setSuccess(`Objeto "${objetoToDelete.nome_objeto}" excluído com sucesso!`)
      setShowModal(false)
      setObjetoToDelete(null)
      loadObjetos()
    } catch (err) {
      console.error('Erro ao excluir objeto:', err)
      setError('Erro ao excluir objeto. Tente novamente.')
      setShowModal(false)
    }
  }

  const handleMarcarComoDevolvido = async (objeto) => {
    try {
      const formatDate = (dateString) => {
        if (!dateString) return null
        const date = new Date(dateString)
        return date.toISOString().split('T')[0]
      }

      const dataToSend = {
        nome_objeto: objeto.nome_objeto,
        local_encontrado: objeto.local_encontrado,
        data_encontrado: formatDate(objeto.data_encontrado),
        observacao: objeto.observacao || '',
        tipo_objeto_id: objeto.tipo_objeto_id,
        url_foto: objeto.url_foto || '',
        nome_pessoa: objeto.nome_pessoa,
        status: 'Devolvido'
      }
      await updateAchado(objeto.id, dataToSend)
      setSuccess(`Objeto "${objeto.nome_objeto}" marcado como devolvido!`)
      loadObjetos()
    } catch (err) {
      console.error('Erro ao marcar como devolvido:', err)
      setError('Erro ao marcar objeto como devolvido. Tente novamente.')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  const getStatusBadge = (status) => {
    return status === 'Aguardando' ?
      <Badge bg="warning" text="dark">⏱ Aguardando</Badge> :
      <Badge bg="success">✓ Devolvido</Badge>
  }

  return (
    <>
      <div className="hero-section">
        <Container>
          <h1 className="display-4 text-center mb-3">
            📋 Meus Objetos Cadastrados
          </h1>
          <p className="lead text-center">
            "O objeto é meu" - Visualize e gerencie todos os objetos cadastrados
          </p>
        </Container>
      </div>

      <Container className="py-5">
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Carregando objetos...</p>
          </div>
        ) : objetos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3>Nenhum objeto cadastrado</h3>
            <p>Ainda não há objetos cadastrados no sistema.</p>
          </div>
        ) : (
          <div className="form-section">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3>Total de objetos: {objetos.length}</h3>
            </div>

            <div className="table-responsive">
              <Table striped bordered hover>
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Tipo</th>
                    <th>Local</th>
                    <th>Data Encontrado</th>
                    <th>Encontrado por</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {objetos.map((objeto) => (
                    <tr key={objeto.id}>
                      <td>{objeto.id}</td>
                      <td>
                        <strong>{objeto.nome_objeto}</strong>
                        {objeto.url_foto && (
                          <a
                            href={objeto.url_foto}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ms-2"
                            title="Ver foto"
                          >
                            🖼️
                          </a>
                        )}
                      </td>
                      <td>{objeto.tipo_objeto_nome}</td>
                      <td>{objeto.local_encontrado}</td>
                      <td>{formatDate(objeto.data_encontrado)}</td>
                      <td>{objeto.nome_pessoa}</td>
                      <td>{getStatusBadge(objeto.status)}</td>
                      <td>
                        <div className="d-flex gap-2 flex-wrap">
                          {objeto.status === 'Aguardando' && (
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleMarcarComoDevolvido(objeto)}
                              title="Marcar como devolvido"
                            >
                              ✓ Devolvido
                            </Button>
                          )}
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleEditClick(objeto)}
                          >
                            ✏️ Editar
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteClick(objeto)}
                          >
                            🗑️ Excluir
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {objetos.some(obj => obj.observacao) && (
              <div className="mt-4">
                <h5>Observações dos objetos:</h5>
                {objetos.filter(obj => obj.observacao).map((objeto) => (
                  <Alert key={objeto.id} variant="info">
                    <strong>{objeto.nome_objeto}:</strong> {objeto.observacao}
                  </Alert>
                ))}
              </div>
            )}
          </div>
        )}
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>⚠️ Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {objetoToDelete && (
            <>
              <p>Tem certeza que deseja excluir o objeto?</p>
              <Alert variant="warning" className="mb-0">
                <strong>Nome:</strong> {objetoToDelete.nome_objeto}<br />
                <strong>Local:</strong> {objetoToDelete.local_encontrado}<br />
                <strong>Tipo:</strong> {objetoToDelete.tipo_objeto_nome}
              </Alert>
              <p className="mt-3 text-danger">
                <strong>Esta ação não pode ser desfeita!</strong>
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Confirmar Exclusão
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>✏️ Editar Objeto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {objetoToEdit && (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome do objeto *</Form.Label>
                    <Form.Control
                      type="text"
                      name="nome_objeto"
                      value={editFormData.nome_objeto || ''}
                      onChange={handleEditChange}
                      isInvalid={!!editErrors.nome_objeto}
                    />
                    <Form.Control.Feedback type="invalid">
                      {editErrors.nome_objeto}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Local onde foi encontrado *</Form.Label>
                    <Form.Control
                      type="text"
                      name="local_encontrado"
                      value={editFormData.local_encontrado || ''}
                      onChange={handleEditChange}
                      isInvalid={!!editErrors.local_encontrado}
                    />
                    <Form.Control.Feedback type="invalid">
                      {editErrors.local_encontrado}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Data encontrado *</Form.Label>
                    <Form.Control
                      type="date"
                      name="data_encontrado"
                      value={editFormData.data_encontrado || ''}
                      onChange={handleEditChange}
                      max={new Date().toISOString().split('T')[0]}
                      isInvalid={!!editErrors.data_encontrado}
                    />
                    <Form.Control.Feedback type="invalid">
                      {editErrors.data_encontrado}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Tipo do objeto *</Form.Label>
                    <Form.Select
                      name="tipo_objeto_id"
                      value={editFormData.tipo_objeto_id || ''}
                      onChange={handleEditChange}
                      isInvalid={!!editErrors.tipo_objeto_id}
                    >
                      <option value="">Selecione...</option>
                      {tiposObjetos.map((tipo) => (
                        <option key={tipo.id} value={tipo.id}>
                          {tipo.nome}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {editErrors.tipo_objeto_id}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nome da pessoa que encontrou *</Form.Label>
                    <Form.Control
                      type="text"
                      name="nome_pessoa"
                      value={editFormData.nome_pessoa || ''}
                      onChange={handleEditChange}
                      isInvalid={!!editErrors.nome_pessoa}
                    />
                    <Form.Control.Feedback type="invalid">
                      {editErrors.nome_pessoa}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status *</Form.Label>
                    <Form.Select
                      name="status"
                      value={editFormData.status || 'Aguardando'}
                      onChange={handleEditChange}
                    >
                      <option value="Aguardando">Aguardando</option>
                      <option value="Devolvido">Devolvido</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>URL da foto (opcional)</Form.Label>
                    <Form.Control
                      type="url"
                      name="url_foto"
                      value={editFormData.url_foto || ''}
                      onChange={handleEditChange}
                      isInvalid={!!editErrors.url_foto}
                    />
                    <Form.Control.Feedback type="invalid">
                      {editErrors.url_foto}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Observações (opcional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="observacao"
                  value={editFormData.observacao || ''}
                  onChange={handleEditChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)} disabled={editLoading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmEdit} disabled={editLoading}>
            {editLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Atualizando...
              </>
            ) : (
              '✅ Salvar Alterações'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default MeusObjetos
