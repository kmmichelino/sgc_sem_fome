import { useState, useEffect } from 'react'
import { Container, Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { getTiposObjetos, createAchado } from '../services/api'

function CadastrarObjeto() {
  const navigate = useNavigate()
  const [tiposObjetos, setTiposObjetos] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingTipos, setLoadingTipos] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [validated, setValidated] = useState(false)

  const [formData, setFormData] = useState({
    nome_objeto: '',
    local_encontrado: '',
    data_encontrado: '',
    observacao: '',
    tipo_objeto_id: '',
    url_foto: '',
    nome_pessoa: ''
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    loadTiposObjetos()
  }, [])

  const loadTiposObjetos = async () => {
    try {
      setLoadingTipos(true)
      const data = await getTiposObjetos()
      setTiposObjetos(data)
    } catch (err) {
      console.error('Erro ao carregar tipos de objetos:', err)
      setError('Erro ao carregar tipos de objetos. Verifique se o backend está rodando.')
    } finally {
      setLoadingTipos(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nome_objeto.trim()) {
      newErrors.nome_objeto = 'O nome do objeto é obrigatório'
    }

    if (!formData.local_encontrado.trim()) {
      newErrors.local_encontrado = 'O local onde foi encontrado é obrigatório'
    }

    if (!formData.data_encontrado) {
      newErrors.data_encontrado = 'A data em que o objeto foi encontrado é obrigatória'
    } else {
      const dataEncontrado = new Date(formData.data_encontrado)
      const hoje = new Date()
      hoje.setHours(0, 0, 0, 0)

      if (dataEncontrado > hoje) {
        newErrors.data_encontrado = 'A data não pode ser no futuro'
      }
    }

    if (!formData.tipo_objeto_id) {
      newErrors.tipo_objeto_id = 'Escolha o tipo do objeto'
    }

    if (!formData.nome_pessoa.trim()) {
      newErrors.nome_pessoa = 'O nome da pessoa que encontrou é obrigatório'
    }

    if (formData.url_foto && !isValidUrl(formData.url_foto)) {
      newErrors.url_foto = 'URL da foto inválida'
    }

    setErrors(newErrors)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    setValidated(true)

    if (!validateForm()) {
      setError('Por favor, corrija os erros no formulário')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const dataToSend = {
        ...formData,
        tipo_objeto_id: parseInt(formData.tipo_objeto_id)
      }

      await createAchado(dataToSend)

      setSuccess(true)

      // Resetar formulário
      setFormData({
        nome_objeto: '',
        local_encontrado: '',
        data_encontrado: '',
        observacao: '',
        tipo_objeto_id: '',
        url_foto: '',
        nome_pessoa: ''
      })
      setValidated(false)

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/')
      }, 2000)

    } catch (err) {
      console.error('Erro ao cadastrar objeto:', err)
      setError(err.response?.data?.error || 'Erro ao cadastrar objeto. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (loadingTipos) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Carregando formulário...</p>
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-5">
      <div className="form-section">
        <h2 className="mb-4 text-center">📝 Registrar Objeto Encontrado</h2>
        <p className="text-center text-muted mb-4">
          Preencha o formulário abaixo para cadastrar um objeto encontrado
        </p>

        {success && (
          <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
            ✅ Objeto cadastrado com sucesso! Redirecionando para a vitrine...
          </Alert>
        )}

        {error && (
          <Alert variant="danger" onClose={() => setError(null)} dismissible>
            ❌ {error}
          </Alert>
        )}

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="nome_objeto">
                <Form.Label>Nome do objeto *</Form.Label>
                <Form.Control
                  type="text"
                  name="nome_objeto"
                  value={formData.nome_objeto}
                  onChange={handleChange}
                  placeholder="Ex: Chaves, Carteira, Celular..."
                  required
                  isInvalid={!!errors.nome_objeto}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.nome_objeto}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="local_encontrado">
                <Form.Label>Local onde foi encontrado *</Form.Label>
                <Form.Control
                  type="text"
                  name="local_encontrado"
                  value={formData.local_encontrado}
                  onChange={handleChange}
                  placeholder="Ex: Bloco Z, Biblioteca, Cantina..."
                  required
                  isInvalid={!!errors.local_encontrado}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.local_encontrado}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="data_encontrado">
                <Form.Label>Data na qual o objeto foi encontrado *</Form.Label>
                <Form.Control
                  type="date"
                  name="data_encontrado"
                  value={formData.data_encontrado}
                  onChange={handleChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                  isInvalid={!!errors.data_encontrado}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.data_encontrado}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="tipo_objeto_id">
                <Form.Label>Escolha o tipo do objeto *</Form.Label>
                <Form.Select
                  name="tipo_objeto_id"
                  value={formData.tipo_objeto_id}
                  onChange={handleChange}
                  required
                  isInvalid={!!errors.tipo_objeto_id}
                >
                  <option value="">Selecione...</option>
                  {tiposObjetos.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nome}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.tipo_objeto_id}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="nome_pessoa">
                <Form.Label>Nome da pessoa que encontrou *</Form.Label>
                <Form.Control
                  type="text"
                  name="nome_pessoa"
                  value={formData.nome_pessoa}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  required
                  isInvalid={!!errors.nome_pessoa}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.nome_pessoa}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="url_foto">
                <Form.Label>URL da foto do objeto (opcional)</Form.Label>
                <Form.Control
                  type="url"
                  name="url_foto"
                  value={formData.url_foto}
                  onChange={handleChange}
                  placeholder="https://exemplo.com/foto.jpg"
                  isInvalid={!!errors.url_foto}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.url_foto}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4" controlId="observacao">
            <Form.Label>Observações (opcional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="observacao"
              value={formData.observacao}
              onChange={handleChange}
              placeholder="Informações adicionais sobre o objeto..."
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Button
                variant="outline-secondary"
                onClick={() => navigate('/')}
                disabled={loading}
                size="lg"
                className="w-100"
              >
                ← Voltar para Vitrine
              </Button>
            </Col>
            <Col md={6}>
              <Button
                variant="primary"
                type="submit"
                size="lg"
                disabled={loading}
                className="w-100"
              >
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Cadastrando...
                  </>
                ) : (
                  '✅ Cadastrar Objeto'
                )}
              </Button>
            </Col>
          </Row>
        </Form>

        <div className="mt-4 p-3 bg-light rounded">
          <p className="mb-0">
            <strong>⚠️ Campos obrigatórios (*)</strong>
          </p>
          <small className="text-muted">
            Todos os campos marcados com * devem ser preenchidos. As mensagens de validação serão exibidas caso os campos estejam inválidos.
          </small>
        </div>
      </div>
    </Container>
  )
}

export default CadastrarObjeto
