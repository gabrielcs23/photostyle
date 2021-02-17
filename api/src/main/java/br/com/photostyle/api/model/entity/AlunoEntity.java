package br.com.photostyle.api.model.entity;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "ALUNO")
public class AlunoEntity extends BaseEntity {

    @Column(name = "NOME", nullable = false)
    private String nome;

    @Column(name = "MATR", nullable = false)
    private String matricula;

    @Column(name = "COD_AC", nullable = false, unique = true)
    private String codigoAcesso;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ESC_ID", nullable = false)
    private EscolaEntity escola;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TRM_ID", nullable = false)
    private TurmaEntity turma;

    @ManyToOne
    @JoinColumn(name = "RL_IRMAO_ID")
    private IrmaoRelEntity irmaoRel;

    @OneToMany(cascade = CascadeType.REMOVE)
    @JoinTable(name="RL_ALUNO_FOTOS", joinColumns=@JoinColumn(name="ID_ALUNO"), inverseJoinColumns=@JoinColumn(name="ID_FOTO"))
    private List<FotoEntity> fotos;

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

    public String getCodigoAcesso() {
        return codigoAcesso;
    }

    public void setCodigoAcesso(String codigoAcesso) {
        this.codigoAcesso = codigoAcesso;
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

    public List<FotoEntity> getFotos() {
        return fotos;
    }

    public void setFotos(List<FotoEntity> fotos) {
        this.fotos = fotos;
    }

    @Override
    public boolean equals(Object o) {
        if (getClass() != o.getClass()) {
            return false;
        }
        AlunoEntity aluno = (AlunoEntity) o;
        return this.getId().equals(aluno.getId());
    }

}
