package br.com.photostyle.api.model.entity.pedido;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "ITM_PEDIDO")
public class ItemPedidoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    private String opcao;

    @Column(nullable = false)
    private BigDecimal valorInd;

    @Column(nullable = false)
    private int qtd;

    @Column(nullable = false)
    private BigDecimal totalInd;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public String getOpcao() {
        return opcao;
    }

    public void setOpcao(String opcao) {
        this.opcao = opcao;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public BigDecimal getValorInd() {
        return valorInd;
    }

    public void setValorInd(BigDecimal valorInd) {
        this.valorInd = valorInd;
    }

    public int getQtd() {
        return qtd;
    }

    public void setQtd(int qtd) {
        this.qtd = qtd;
    }

    public BigDecimal getTotalInd() {
        return totalInd;
    }

    public void setTotalInd(BigDecimal totalInd) {
        this.totalInd = totalInd;
    }
}
