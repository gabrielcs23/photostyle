package br.com.photostyle.api.model.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "TURMA")
@SequenceGenerator(name = "sequence_gen", sequenceName = "turma_seq", initialValue = 1, allocationSize = 1)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class TurmaEntity extends BaseEntity {

    @Column(name = "NOME", nullable = false)
    private String nome;

    @ManyToOne
    @JoinColumn(name = "ESC_ID", nullable = false)
    private EscolaEntity escola;

    @OneToMany(mappedBy = "turma", fetch = FetchType.EAGER)
    private List<AlunoEntity> alunos;

    @OneToMany(cascade = CascadeType.REMOVE)
    @JoinTable(name="RL_TURMA_FOTOS", joinColumns=@JoinColumn(name="ID_TURMA"), inverseJoinColumns=@JoinColumn(name="ID_FOTO"))
    private List<FotoEntity> fotos;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public EscolaEntity getEscola() {
        return escola;
    }

    public void setEscola(EscolaEntity escola) {
        this.escola = escola;
    }

    public List<AlunoEntity> getAlunos() {
        return alunos;
    }

    public void setAlunos(List<AlunoEntity> alunos) {
        this.alunos = alunos;
    }

    public List<FotoEntity> getFotos() {
        return fotos;
    }

    public void setFotos(List<FotoEntity> fotos) {
        this.fotos = fotos;
    }
}
