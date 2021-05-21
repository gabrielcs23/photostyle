package br.com.photostyle.api.model.dto.kit;

import java.math.BigDecimal;

public class OpcaoKit {

    private String nome;
    private BigDecimal valor;
    private boolean turma;
    private boolean irmao;

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

    public boolean getTurma() {
        return turma;
    }

    public void setTurma(boolean turma) {
        this.turma = turma;
    }

    public boolean getIrmao() {
        return irmao;
    }

    public void setIrmao(boolean irmao) {
        this.irmao = irmao;
    }
}
