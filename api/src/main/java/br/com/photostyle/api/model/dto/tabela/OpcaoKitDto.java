package br.com.photostyle.api.model.dto.tabela;

import java.math.BigDecimal;

public class OpcaoKitDto {

    private Long id;
    private Long tabela;
    private String nome;
    private BigDecimal valor;
    private boolean isTurma;
    private boolean isIrmao;

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

    public boolean getIsTurma() {
        return isTurma;
    }

    public void setIsTurma(boolean turma) {
        isTurma = turma;
    }

    public boolean getIsIrmao() {
        return isIrmao;
    }

    public void setIsIrmao(boolean irmao) {
        isIrmao = irmao;
    }
}
