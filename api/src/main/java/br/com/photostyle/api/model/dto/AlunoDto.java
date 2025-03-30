package br.com.photostyle.api.model.dto;


import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import java.util.List;

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id", scope = AlunoDto.class)
public class AlunoDto {

    private Long id;

    private String nome;

    private String matricula;

    private String codigoAcesso;

    private EscolaDto escola;

    private TurmaDto turma;

    private IrmaoRelDto irmaoRel;

    private List<FotoDto> fotos;

    private List<FotoDto> fotosOpcionais;

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

    public EscolaDto getEscola() {
        return escola;
    }

    public void setEscola(EscolaDto escola) {
        this.escola = escola;
    }

    public TurmaDto getTurma() {
        return turma;
    }

    public void setTurma(TurmaDto turma) {
        this.turma = turma;
    }

    public IrmaoRelDto getIrmaoRel() {
        return irmaoRel;
    }

    public void setIrmaoRel(IrmaoRelDto irmaoRel) {
        this.irmaoRel = irmaoRel;
    }

    public List<FotoDto> getFotos() {
        return fotos;
    }

    public void setFotos(List<FotoDto> fotos) {
        this.fotos = fotos;
    }

    public List<FotoDto> getFotosOpcionais() {
        return fotosOpcionais;
    }

    public void setFotosOpcionais(List<FotoDto> fotosOpcionais) {
        this.fotosOpcionais = fotosOpcionais;
    }
}
