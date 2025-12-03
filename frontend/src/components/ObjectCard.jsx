import { Card, Badge, Button } from 'react-bootstrap'

function ObjectCard({ objeto, onMarcarComoDevolvido }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  const getStatusVariant = (status) => {
    return status === 'Aguardando' ? 'warning' : 'success'
  }

  const defaultImage = 'https://via.placeholder.com/300x200?text=Sem+Imagem'

  return (
    <Card className="object-card h-100 shadow-sm">
      <div className="position-relative">
        <Badge 
          bg={getStatusVariant(objeto.status)} 
          className="status-badge"
        >
          ⏱ {objeto.status}
        </Badge>
        <Card.Img 
          variant="top" 
          src={objeto.url_foto || defaultImage}
          alt={objeto.nome_objeto}
          className="object-image"
          onError={(e) => { e.target.src = defaultImage }}
        />
      </div>
      <Card.Body>
        <Card.Title className="text-primary">
          🔖 {objeto.nome_objeto}
        </Card.Title>
        <Card.Text>
          <strong>📍 Local:</strong> {objeto.local_encontrado}
          <br />
          <strong>📅 Data:</strong> {formatDate(objeto.data_encontrado)}
          <br />
          <strong>👤 Encontrado por:</strong> {objeto.nome_pessoa}
          <br />
          <strong>🏷️ Tipo:</strong> {objeto.tipo_objeto_nome}
        </Card.Text>
        {objeto.observacao && (
          <Card.Text className="text-muted">
            <small>
              <strong>📝 Observação:</strong> {objeto.observacao}
            </small>
          </Card.Text>
        )}
        {objeto.status === 'Aguardando' && onMarcarComoDevolvido && (
          <div className="mt-3">
            <Button
              variant="success"
              size="sm"
              className="w-100"
              onClick={() => onMarcarComoDevolvido(objeto)}
            >
              ✓ Marcar como Devolvido
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

export default ObjectCard
