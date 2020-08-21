package br.com.photostyle.api.model.dto;

import java.util.List;

public class PedidoDto {

    private String aluno;
    private String turma;
    private String escola;
    private String responsavel;
    private String tel;
    private String email;
    private OpcaoPedidoDto item;
    private List<OpcaoPedidoDto> extras;

    public String getAluno() {
        return aluno;
    }

    public void setAluno(String aluno) {
        this.aluno = aluno;
    }

    public String getTurma() {
        return turma;
    }

    public void setTurma(String turma) {
        this.turma = turma;
    }

    public String getEscola() {
        return escola;
    }

    public void setEscola(String escola) {
        this.escola = escola;
    }

    public String getResponsavel() {
        return responsavel;
    }

    public void setResponsavel(String responsavel) {
        this.responsavel = responsavel;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public OpcaoPedidoDto getItem() {
        return item;
    }

    public void setItem(OpcaoPedidoDto item) {
        this.item = item;
    }

    public List<OpcaoPedidoDto> getExtras() {
        return extras;
    }

    public void setExtras(List<OpcaoPedidoDto> extras) {
        this.extras = extras;
    }
}
