package br.com.photostyle.api.model.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "ANO")
public class AnoEntity extends BaseEntity {

    @Column(name = "NOME", nullable = false, unique = true)
    private String nome;

    public AnoEntity() {
    }

    public AnoEntity(String nome) {
        this.nome = nome;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }
}
