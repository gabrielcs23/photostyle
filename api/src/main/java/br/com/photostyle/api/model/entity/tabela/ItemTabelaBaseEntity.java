package br.com.photostyle.api.model.entity.tabela;

import br.com.photostyle.api.model.entity.BaseEntity;

import javax.persistence.*;
import java.math.BigDecimal;

@MappedSuperclass
public abstract class ItemTabelaBaseEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TAB_ID", nullable = false)
    private TabelaDePrecoEntity tabela;

    @Column(name="TAB_ID", nullable = false, updatable=false, insertable=false)
    public Long tabelaId;

    @Column(name = "NOME", nullable = false)
    private String nome;

    @Column(nullable = false)
    private BigDecimal valor;

    @Column(name = "IS_IRMAO", nullable = false)
    private boolean isIrmao = false;

    @Column(name = "IS_TURMA", nullable = false)
    private boolean isTurma = false;

    public TabelaDePrecoEntity getTabela() {
        return tabela;
    }

    public void setTabela(TabelaDePrecoEntity tabela) {
        this.tabela = tabela;
    }

    public Long getTabelaId() {
        return tabelaId;
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

    public void setValor(BigDecimal valorIndividual) {
        this.valor = valorIndividual;
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
}
