package br.com.photostyle.api.model.dto;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import java.util.List;

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id", scope = TurmaDto.class)
public class TurmaDto {

    private Long id;

    private String nome;

    private EscolaDto escola;

    private List<AlunoDto> alunos;

    private List<FotoDto> fotos;

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

    public EscolaDto getEscola() {
        return escola;
    }

    public void setEscola(EscolaDto escola) {
        this.escola = escola;
    }

    public List<AlunoDto> getAlunos() {
        return alunos;
    }

    public void setAlunos(List<AlunoDto> alunos) {
        this.alunos = alunos;
    }

    public List<FotoDto> getFotos() {
        return fotos;
    }

    public void setFotos(List<FotoDto> fotos) {
        this.fotos = fotos;
    }
}
