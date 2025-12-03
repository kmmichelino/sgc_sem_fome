import { useState, useEffect } from 'react'
import { getSaldoEstoque } from '../services/api'

export default function Estoque() {
  const [estoque, setEstoque] = useState({})
  const [loading, setLoading] = useState(true)
  const [dadosGrafico, setDadosGrafico] = useState([])
  const [dadosGraficoSaidas, setDadosGraficoSaidas] = useState([])

  useEffect(() => {
    carregarEstoque()
    
    // Escutar mudanças nas entradas
    const handleStorageChange = () => {
      carregarEstoque()
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('entradasUpdated', handleStorageChange)
    window.addEventListener('saidasUpdated', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('entradasUpdated', handleStorageChange)
      window.removeEventListener('saidasUpdated', handleStorageChange)
    }
  }, [])

  const carregarEstoque = () => {
    try {
      // Buscar dados das entradas do localStorage
      const entradasSalvas = JSON.parse(localStorage.getItem('entradas') || '[]')
      
      // Usar apenas os dados salvos ou vazio se não houver
      const entradasIniciais = []
      
      const entradas = entradasSalvas.length > 0 ? entradasSalvas : entradasIniciais
      
      // Agrupar por tipo de produto
      const agrupado = entradas.reduce((acc, entrada) => {
        const quantidade = parseFloat(entrada.quantidade) || 0
        acc[entrada.tipo_produto] = (acc[entrada.tipo_produto] || 0) + quantidade
        return acc
      }, {})
      
      // Preparar dados para o gráfico
      const cores = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']
      const dadosChart = Object.entries(agrupado).map(([tipo, quantidade], index) => ({
        tipo,
        quantidade,
        cor: cores[index % cores.length]
      }))
      
      setDadosGrafico(dadosChart)
      
      // Carregar dados das saídas
      const saidasSalvas = JSON.parse(localStorage.getItem('saidas') || '[]')
      const saidasIniciais = []
      
      const saidas = saidasSalvas.length > 0 ? saidasSalvas : saidasIniciais
      
      // Agrupar saídas por tipo de produto
      const agrupadoSaidas = saidas.reduce((acc, saida) => {
        const quantidade = parseFloat(saida.quantidade) || 0
        acc[saida.tipo_produto] = (acc[saida.tipo_produto] || 0) + quantidade
        return acc
      }, {})
      
      // Preparar dados para o gráfico de saídas
      const coresSaidas = ['#EF4444', '#F59E0B', '#8B5CF6', '#06B6D4']
      const dadosChartSaidas = Object.entries(agrupadoSaidas).map(([tipo, quantidade], index) => ({
        tipo,
        quantidade,
        cor: coresSaidas[index % coresSaidas.length]
      }))
      
      setDadosGraficoSaidas(dadosChartSaidas)
      setEstoque({})
    } catch (error) {
      console.error('Erro ao carregar estoque:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Carregando...</div>

  const total = dadosGrafico.reduce((sum, item) => sum + item.quantidade, 0)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Estoque - Entradas por Tipo de Produto</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Gráfico de Entradas</h2>
        
        <div className="flex items-center justify-center">
          <div className="relative w-64 h-64">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {dadosGrafico.map((item, index) => {
                const percentage = (item.quantidade / total) * 100
                const angle = (percentage / 100) * 360
                const startAngle = dadosGrafico.slice(0, index).reduce((sum, prev) => sum + (prev.quantidade / total) * 360, 0)
                const endAngle = startAngle + angle
                
                const x1 = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180)
                const y1 = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180)
                const x2 = 100 + 80 * Math.cos((endAngle - 90) * Math.PI / 180)
                const y2 = 100 + 80 * Math.sin((endAngle - 90) * Math.PI / 180)
                
                const largeArcFlag = angle > 180 ? 1 : 0
                
                return (
                  <path
                    key={index}
                    d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                    fill={item.cor}
                    stroke="white"
                    strokeWidth="2"
                  />
                )
              })}
            </svg>
          </div>
          
          <div className="ml-8">
            <h3 className="font-semibold mb-3">Legenda</h3>
            {dadosGrafico.map((item, index) => (
              <div key={index} className="flex items-center mb-2">
                <div 
                  className="w-4 h-4 rounded mr-3"
                  style={{ backgroundColor: item.cor }}
                ></div>
                <span className="text-sm">
                  {item.tipo}: {item.quantidade} itens ({((item.quantidade / total) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Resumo por Categoria</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dadosGrafico.map((item, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center mb-2">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.cor }}
                ></div>
                <h3 className="font-medium text-sm">{item.tipo}</h3>
              </div>
              <p className="text-2xl font-bold">{item.quantidade}</p>
              <p className="text-sm text-gray-600">itens registrados</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow mt-6">
        <h2 className="text-xl font-semibold mb-4">Gráfico de Saídas por Tipo</h2>
        
        {dadosGraficoSaidas.length > 0 ? (
          <div className="flex items-center justify-center">
            <div className="w-64 h-64">
              {dadosGraficoSaidas.map((item, index) => {
                const totalSaidas = dadosGraficoSaidas.reduce((sum, s) => sum + s.quantidade, 0)
                const altura = totalSaidas > 0 ? (item.quantidade / totalSaidas) * 200 : 0
                
                return (
                  <div key={index} className="inline-block mx-2 align-bottom" style={{ height: '200px' }}>
                    <div className="flex flex-col items-center h-full justify-end">
                      <span className="text-xs mb-1">{item.quantidade}</span>
                      <div 
                        className="w-12 rounded-t"
                        style={{ 
                          height: `${altura}px`,
                          backgroundColor: item.cor,
                          minHeight: item.quantidade > 0 ? '10px' : '0px'
                        }}
                      ></div>
                      <span className="text-xs mt-2 text-center w-16">{item.tipo.split(' ')[0]}</span>
                    </div>
                  </div>
                )
              })}
            </div>
            
            <div className="ml-8">
              <h3 className="font-semibold mb-3">Saídas</h3>
              {dadosGraficoSaidas.map((item, index) => {
                const totalSaidas = dadosGraficoSaidas.reduce((sum, s) => sum + s.quantidade, 0)
                return (
                  <div key={index} className="flex items-center mb-2">
                    <div 
                      className="w-4 h-4 rounded mr-3"
                      style={{ backgroundColor: item.cor }}
                    ></div>
                    <span className="text-sm">
                      {item.tipo}: {item.quantidade} itens ({totalSaidas > 0 ? ((item.quantidade / totalSaidas) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            Nenhuma saída registrada
          </div>
        )}
      </div>
    </div>
  )
}