package br.com.photostyle.api.model.dto.kit;

import java.math.BigDecimal;

public class OpcaoExtra {

    private String nome;
    private BigDecimal valor;
    private boolean irmao;
    private boolean turma;
    private boolean digital;
    private boolean opcional;

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

    public boolean getIrmao() {
        return irmao;
    }

    public void setIrmao(boolean irmao) {
        this.irmao = irmao;
    }

    public boolean getTurma() {
        return turma;
    }

    public void setTurma(boolean turma) {
        this.turma = turma;
    }

    public boolean getDigital() {
        return digital;
    }

    public void setDigital(boolean digital) {
        this.digital = digital;
    }

    public boolean getOpcional() {
        return opcional;
    }

    public void setOpcional(boolean opcional) {
        this.opcional = opcional;
    }
}
