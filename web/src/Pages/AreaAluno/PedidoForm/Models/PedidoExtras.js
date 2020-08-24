import ModeloPedido from './ModeloPedido'

export default class PedidoExtras {
    
    static get() {
        return [
            new ModeloPedido('15x21 Aluno Diagramado', 13),
            new ModeloPedido('15x21 Aluno com borda branca', 13),
            new ModeloPedido('15x21 Irmãos com borda branca', 13, 'I'),
            new ModeloPedido('15x21 Arquivo digital (aluno)', 15),
            new ModeloPedido('15x21 Arquivo digital (irmãos)', 15, 'I'),
            new ModeloPedido('15x21 Diagramado Turma', 13, 'T'),
            new ModeloPedido('10x15 Aluno com borda branca', 9),
            new ModeloPedido('10x15 Irmãos com borda branca', 9, 'I'),
            new ModeloPedido('Cartela com 4 fotos 5x7', 13),
            new ModeloPedido('Cartela com 8 fotos 3x4', 13),
            new ModeloPedido('Cartela com 2 fotos-5x7 e 4 fotos 3x4', 13),
            new ModeloPedido('Identificador de mochila – 1 unidade', 15),
            new ModeloPedido('Identificador de mochila – 2 unidades', 22),
            new ModeloPedido('Conjunto 2 fotos scrap ímã tam.7x10 modelo kids boys & girls', 22),
            new ModeloPedido('Conjunto 2 fotos scrap ímã tam.7x10 modelo frases boys & girls', 22),
            new ModeloPedido('Conjunto 2 fotos scrap ímã tam.7x10 modelo teen 1 boys & girls', 22),
            new ModeloPedido('Conjunto 2 fotos scrap ímã tam 7x10 modelo teen 2 boys & girls', 22),
            new ModeloPedido('Conjunto 2 fotos ímã tam.7x10 sem arte, apenas com ano', 22),
            new ModeloPedido('Tabuada Divertida', 13)
        ]
    }

}