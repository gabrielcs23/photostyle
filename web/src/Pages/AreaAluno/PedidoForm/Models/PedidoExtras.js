import ModeloPedido from './ModeloPedido'

export default class PedidoExtras {
    
    static get() {
        return [
            new ModeloPedido('15x21 Aluno Diagramado', 14, false),
            new ModeloPedido('15x21 Aluno com borda branca', 14, false),
            new ModeloPedido('15x21 Irmãos com borda branca', 14, false, 'I'),
            new ModeloPedido('15x21 Opcional com borda branca', 14, false, 'O'),
            new ModeloPedido('15x21 Arquivo digital (aluno)', 17, true),
            new ModeloPedido('15x21 Arquivo digital (irmãos)', 17, true, 'I'),
            new ModeloPedido('15x21 Arquivo digital (opcional)', 17, true, 'O'),
            new ModeloPedido('15x21 Diagramado Turma', 14, false, 'T'),
            new ModeloPedido('10x15 Aluno com borda branca', 9, false),
            new ModeloPedido('10x15 Irmãos com borda branca', 9, false, 'I'),
            new ModeloPedido('10x15 Opcional com borda branca', 9, false, 'O'),
            new ModeloPedido('Cartela com 4 fotos 5x7', 14, false),
            new ModeloPedido('Cartela com 8 fotos 3x4', 14, false),
            new ModeloPedido('Cartela com 2 fotos-5x7 e 4 fotos 3x4', 14, false),
            new ModeloPedido('Identificador de mochila – 1 unidade', 16, false),
            new ModeloPedido('Identificador de mochila – 2 unidades', 25, false),
            new ModeloPedido('Conjunto 2 fotos scrap ímã tam.7x10 modelo kids boys & girls', 24, false),
            new ModeloPedido('Conjunto 2 fotos scrap ímã tam.7x10 modelo frases boys & girls', 24, false),
            new ModeloPedido('Conjunto 2 fotos scrap ímã tam.7x10 modelo teen 1 boys & girls', 24, false),
            new ModeloPedido('Conjunto 2 fotos scrap ímã tam 7x10 modelo teen 2 boys & girls', 24, false),
            new ModeloPedido('Conjunto 2 fotos ímã tam.7x10 sem arte, apenas com ano', 24, false),
            new ModeloPedido('Tabuada Divertida', 15, false)
        ]
    }

}