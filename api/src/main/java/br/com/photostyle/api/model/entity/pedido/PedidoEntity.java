package br.com.photostyle.api.model.entity.pedido;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "PEDIDO")
public class PedidoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nomeAluno;

    @Column(nullable = false)
    private String nomeTurma;

    @Column(nullable = false)
    private String nomeEscola;

    @Column(nullable = false)
    private String nomeResponsavel;

    @Column(nullable = false)
    private String telContato;

    @Column(nullable = false)
    private String email;

    @OneToOne(optional = false, cascade = {CascadeType.REMOVE, CascadeType.PERSIST})
    private ItemPedidoEntity kit;

    @OneToMany(cascade = {CascadeType.REMOVE, CascadeType.PERSIST})
    @JoinTable(name="RL_PEDIDO_EXTRAS", joinColumns=@JoinColumn(name="ID_PEDIDO"), inverseJoinColumns=@JoinColumn(name="ID_EXTRA"))
    private List<ItemPedidoEntity> extras;

    @Column(nullable = false)
    private BigDecimal valorTotal;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomeAluno() {
        return nomeAluno;
    }

    public void setNomeAluno(String nomeAluno) {
        this.nomeAluno = nomeAluno;
    }

    public String getNomeTurma() {
        return nomeTurma;
    }

    public void setNomeTurma(String nomeTurma) {
        this.nomeTurma = nomeTurma;
    }

    public String getNomeEscola() {
        return nomeEscola;
    }

    public void setNomeEscola(String nomeEscola) {
        this.nomeEscola = nomeEscola;
    }

    public String getNomeResponsavel() {
        return nomeResponsavel;
    }

    public void setNomeResponsavel(String nomeResponsavel) {
        this.nomeResponsavel = nomeResponsavel;
    }

    public String getTelContato() {
        return telContato;
    }

    public void setTelContato(String telContato) {
        this.telContato = telContato;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public ItemPedidoEntity getKit() {
        return kit;
    }

    public void setKit(ItemPedidoEntity kit) {
        this.kit = kit;
    }

    public List<ItemPedidoEntity> getExtras() {
        return extras;
    }

    public void setExtras(List<ItemPedidoEntity> extras) {
        this.extras = extras;
    }

    public BigDecimal getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }
}
