import ModeloPedido from './ModeloPedido'

export default class PedidoExtras {
    
    static get() {
        return [
            new ModeloPedido('15x21 Aluno Diagramado', 13),
            new ModeloPedido('15x21 Aluno com borda branca', 13)
        ]
    }

}