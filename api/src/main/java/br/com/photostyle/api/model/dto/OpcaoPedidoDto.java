package br.com.photostyle.api.model.dto;

import java.math.BigDecimal;

public class OpcaoPedidoDto {

    private String nome;
    private BigDecimal val;
    private int qtd;
    private BigDecimal total;
    private String opcao;

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public BigDecimal getVal() {
        return val;
    }

    public void setVal(BigDecimal val) {
        this.val = val;
    }

    public int getQtd() {
        return qtd;
    }

    public void setQtd(int qtd) {
        this.qtd = qtd;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public String getOpcao() {
        return opcao;
    }

    public void setOpcao(String opcao) {
        this.opcao = opcao;
    }
}
