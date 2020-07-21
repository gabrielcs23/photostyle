import Escola from "./Escola";
import Turma from "./Turma";
import IrmaoRel from "./IrmaoRel";

class Aluno {
    id;
    nome;
    matricula;
    codigoAcesso;
    escola;
    turma;
    irmaoRel;
    foto;

    constructor(nome, matricula, escola, turma) {
        this.nome = nome;
        if (matricula) {
            this.matricula = matricula;
        }
        if (escola) {
            this.escola = new Escola(escola.nome, escola.id);
        }
        if (turma) {
            this.turma = new Turma(turma.nome, null, turma.id);
        }
    }

    setIrmaoRel(rel) {
        if (rel != null) {
            this.irmaoRel = new IrmaoRel(rel.irmaos, rel.fotos, rel.id, this.id);
        }
    }

}
export default Aluno;
