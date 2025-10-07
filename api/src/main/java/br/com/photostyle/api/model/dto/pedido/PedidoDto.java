package br.com.photostyle.api.model.dto.pedido;

import java.math.BigDecimal;
import java.util.List;

public class PedidoDto {

    private String numeroPedido;
    private String aluno;
    private String turma;
    private String escola;
    private String responsavel;
    private String tel;
    private String email;
    private BigDecimal valorTotal;
    private OpcaoPedidoDto item;
    private List<OpcaoPedidoDto> extras;

    public String getNumeroPedido() {
        return numeroPedido;
    }

    public void setNumeroPedido(String numeroPedido) {
        this.numeroPedido = numeroPedido;
    }

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

    public BigDecimal getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
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
