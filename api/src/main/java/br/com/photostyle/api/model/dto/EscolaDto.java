package br.com.photostyle.api.model.dto;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import java.util.List;

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class EscolaDto {

    private Long id;

    private String nome;

    private String apelido;

    private List<TurmaDto> turmas;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public List<TurmaDto> getTurmas() {
        return turmas;
    }

    public void setTurmas(List<TurmaDto> turmas) {
        this.turmas = turmas;
    }
}
