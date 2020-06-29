import Escola from "./Escola";

class Turma {
    id;
    nome;
    escola;
    alunos = [];
    fotos = [];

    constructor(nome, escola, id) {
        this.nome = nome;
        if (escola) {
            this.escola = new Escola(escola.nome, escola.id);
        }
        if (id != null) {
            this.id = id;
        }
    }

}
export default Turma;
