package br.com.photostyle.api.model.entity.tabela;

import br.com.photostyle.api.model.entity.BaseEntity;
import br.com.photostyle.api.model.entity.EscolaEntity;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "TABELA_PRECO")
public class TabelaDePrecoEntity extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ESC_ID", nullable = false)
    private EscolaEntity escola;

    @Column(name="ESC_ID", nullable = false, updatable=false, insertable=false)
    public Long escolaId;

    @OneToMany(mappedBy = "tabela", cascade = {CascadeType.REMOVE, CascadeType.PERSIST}, orphanRemoval = true)
    private List<OpcaoKitEntity> opcoesKit;

    @OneToMany(mappedBy = "tabela", cascade = {CascadeType.REMOVE, CascadeType.PERSIST}, orphanRemoval = true)
    private List<OpcaoExtraEntity> opcoesExtra;

    public EscolaEntity getEscola() {
        return escola;
    }

    public void setEscola(EscolaEntity escola) {
        this.escola = escola;
    }

    public Long getEscolaId() {
        return escolaId;
    }

    public List<OpcaoKitEntity> getOpcoesKit() {
        return opcoesKit;
    }

    public List<OpcaoExtraEntity> getOpcoesExtra() {
        return opcoesExtra;
    }
}
