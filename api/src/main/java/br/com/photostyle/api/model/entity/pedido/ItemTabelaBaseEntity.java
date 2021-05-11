package br.com.photostyle.api.model.entity.pedido;

import javax.persistence.*;
import java.math.BigDecimal;

@MappedSuperclass
public abstract class ItemTabelaBaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TAB_ID", nullable = false)
    private TabelaDePrecoEntity tabela;

    @Column(name = "NOME", nullable = false)
    private String nome;

    @Column(nullable = false)
    private BigDecimal valor;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TabelaDePrecoEntity getTabela() {
        return tabela;
    }

    public void setTabela(TabelaDePrecoEntity tabela) {
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

    public void setValor(BigDecimal valorIndividual) {
        this.valor = valorIndividual;
    }
}
