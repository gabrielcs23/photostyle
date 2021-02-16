package br.com.photostyle.api.model.entity;

import javax.persistence.*;

@Entity
@Table(name = "FOTO")
public class FotoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName;

    @Column
    private String descricao = "";

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ANO_ID", nullable = false)
    private AnoEntity ano;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public AnoEntity getAno() {
        return ano;
    }

    public void setAno(AnoEntity ano) {
        this.ano = ano;
    }
}
