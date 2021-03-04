package br.com.photostyle.api.model.entity;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "ESCOLA")
public class EscolaEntity extends BaseEntity {

    @Column(name = "NOME", nullable = false, unique = true)
    private String nome;

    @Column(name = "APELIDO")
    private String apelido;

    @OneToMany(mappedBy = "escola", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<TurmaEntity> turmas;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getApelido() {
        return apelido;
    }

    public void setApelido(String apelido) {
        this.apelido = apelido;
    }

    public List<TurmaEntity> getTurmas() {
        return turmas;
    }

    public void setTurmas(List<TurmaEntity> turmas) {
        this.turmas = turmas;
    }
}
