export default class ModeloPedido {
    nome = '';
    val = 0;
    qtd = 0;
    total = 0;
    isDigital = false;
    isTurma = false;
    isIrmao = false;
    isOpcional = false;
    opcao = undefined;

    constructor(nome, val, isTurma, isIrmao, isOpcional, isDigital) {
        this.nome = nome;
        this.val = val;
        this.isTurma = isTurma != null ? isTurma : false;
        this.isIrmao = isIrmao != null ? isIrmao : false;
        this.isOpcional = isOpcional != null ? isOpcional : false;
        this.isDigital = isDigital != null ? isDigital : false;
    }

    temEscolha() {
        return this.isDigital || this.isTurma || this.isIrmao || this.isOpcional;
    }

}