class Escola {
    id;
    nome;
    apelido;
    turmas = [];

    constructor(nome, id) {
        this.nome = nome;
        if (id != null) {
            this.id = id;
        }
    }

}
export default Escola;
