import ModeloPedido from './ModeloPedido'

export default class PedidoItens {
    
    static get() {
        return [
            new ModeloPedido('Kit Fotográfico (duas fotos diagramadas 15x21, aluno e grupo)', 50, false),
            new ModeloPedido('Kit Fotográfico (idem acima + uma 10x15 dos irmãos)', 55, false)
        ]
    }

}