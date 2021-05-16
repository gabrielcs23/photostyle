package br.com.photostyle.api.model.dto.tabela;

import java.math.BigDecimal;

public class OpcaoExtraDto {

    private Long id;
    private Long tabela;
    private String nome;
    private BigDecimal valor;
    private boolean isIrmao;
    private boolean isTurma;
    private boolean isDigital;
    private boolean isOpcional;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTabela() {
        return tabela;
    }

    public void setTabela(Long tabela) {
        this.tabela = tabela;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public boolean isIrmao() {
        return isIrmao;
    }

    public void setIrmao(boolean irmao) {
        isIrmao = irmao;
    }

    public boolean isTurma() {
        return isTurma;
    }

    public void setTurma(boolean turma) {
        isTurma = turma;
    }

    public boolean isDigital() {
        return isDigital;
    }

    public void setDigital(boolean digital) {
        isDigital = digital;
    }

    public boolean isOpcional() {
        return isOpcional;
    }

    public void setOpcional(boolean opcional) {
        isOpcional = opcional;
    }
}
