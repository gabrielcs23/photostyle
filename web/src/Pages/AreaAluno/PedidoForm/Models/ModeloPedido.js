export default class ModeloPedido {
    nome = '';
    val = 0;
    qtd = 0;
    total = 0;
    isDigital = false;
    modeloOpcao = undefined;
    opcao = undefined;

    constructor(nome, val, isDigital, possuiOpcao) {
        this.nome = nome;
        this.val = val;
        this.isDigital = isDigital;
        if (possuiOpcao != null) {
            this.modeloOpcao = possuiOpcao;
        }
    }

}