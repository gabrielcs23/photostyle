class Aluno {
    id;
    nome;
    matricula;
    codAcesso;
    escola;
    turma;
    irmaoRel;
    foto;

    constructor(nome, matricula, escola, turma) {
        this.nome = nome;
        this.matricula = matricula;
        this.escola = escola;
        this.turma = turma;
    }

}
export default Aluno;
