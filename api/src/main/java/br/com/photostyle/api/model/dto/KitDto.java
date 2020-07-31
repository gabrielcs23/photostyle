package br.com.photostyle.api.model.dto;

import java.util.List;

public class KitDto {

    private String codigoAcesso;
    private String nomeAluno;
    private String escola;
    private String turma;
    private FotoDto fotoIndividual;
    private List<FotoDto> fotosTurma;
    private List<FotoDto> fotosIrmaos;

    public String getCodigoAcesso() {
        return codigoAcesso;
    }

    public void setCodigoAcesso(String codigoAcesso) {
        this.codigoAcesso = codigoAcesso;
    }

    public String getNomeAluno() {
        return nomeAluno;
    }

    public void setNomeAluno(String nomeAluno) {
        this.nomeAluno = nomeAluno;
    }

    public String getEscola() {
        return escola;
    }

    public void setEscola(String escola) {
        this.escola = escola;
    }

    public String getTurma() {
        return turma;
    }

    public void setTurma(String turma) {
        this.turma = turma;
    }

    public FotoDto getFotoIndividual() {
        return fotoIndividual;
    }

    public void setFotoIndividual(FotoDto fotoIndividual) {
        this.fotoIndividual = fotoIndividual;
    }

    public List<FotoDto> getFotosTurma() {
        return fotosTurma;
    }

    public void setFotosTurma(List<FotoDto> fotosTurma) {
        this.fotosTurma = fotosTurma;
    }

    public List<FotoDto> getFotosIrmaos() {
        return fotosIrmaos;
    }

    public void setFotosIrmaos(List<FotoDto> fotosIrmaos) {
        this.fotosIrmaos = fotosIrmaos;
    }
}
