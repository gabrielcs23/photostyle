package br.com.photostyle.api.model.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

@Entity
@Table(name = "ESCOLA")
@SequenceGenerator(name = "sequence_gen", sequenceName = "escola_seq", initialValue = 1, allocationSize = 1)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class EscolaEntity extends BaseEntity {

    @Column(name = "NOME", nullable = false, unique = true)
    @NotNull
    @NotEmpty
    private String nome;

    @OneToMany(mappedBy = "escola", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @NotNull
    private List<TurmaEntity> turmas;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public List<TurmaEntity> getTurmas() {
        return turmas;
    }

    public void setTurmas(List<TurmaEntity> turmas) {
        this.turmas = turmas;
    }
}
