export default class ModeloPedido {
    nome = '';
    val = 0;
    qtd = 0;
    total = 0;
    modeloOpcao = undefined;
    opcao = undefined;

    constructor(nome, val, possuiOpcao) {
        this.nome = nome;
        this.val = val;
        if (possuiOpcao != null) {
            this.modeloOpcao = possuiOpcao;
        }
    }

}