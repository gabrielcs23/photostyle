package br.com.photostyle.api.model.entity;

import javax.persistence.*;

@Entity
@Table(name = "ALUNO")
@SequenceGenerator(name = "sequence_gen", sequenceName = "aluno_seq", initialValue = 1, allocationSize = 1)
public class AlunoEntity extends BaseEntity {

    @Column(name = "NOME", nullable = false)
    private String nome;

    @Column(name = "MATR", nullable = false)
    private String matricula;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ESC_ID", nullable = false)
    private EscolaEntity escola;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TRM_ID", nullable = false)
    private TurmaEntity turma;

    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name = "RL_IRMAO_ID")
    private IrmaoRelEntity irmaoRel;

    @OneToOne(cascade = CascadeType.REMOVE)
    private FotoEntity foto;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public EscolaEntity getEscola() {
        return escola;
    }

    public void setEscola(EscolaEntity escola) {
        this.escola = escola;
    }

    public TurmaEntity getTurma() {
        return turma;
    }

    public void setTurma(TurmaEntity turma) {
        this.turma = turma;
    }

    public IrmaoRelEntity getIrmaoRel() {
        return irmaoRel;
    }

    public void setIrmaoRel(IrmaoRelEntity irmaoRel) {
        this.irmaoRel = irmaoRel;
    }

    public FotoEntity getFoto() {
        return foto;
    }

    public void setFoto(FotoEntity foto) {
        this.foto = foto;
    }
}
