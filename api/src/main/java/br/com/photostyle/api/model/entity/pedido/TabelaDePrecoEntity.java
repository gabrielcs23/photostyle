package br.com.photostyle.api.model.entity.pedido;

import br.com.photostyle.api.model.entity.BaseEntity;
import br.com.photostyle.api.model.entity.EscolaEntity;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "TabelaPreco")
public class TabelaDePrecoEntity extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ESC_ID", nullable = false)
    private EscolaEntity escola;

    @OneToMany(mappedBy = "tabela", cascade = {CascadeType.REMOVE, CascadeType.PERSIST}, orphanRemoval = true)
    private List<OpcaoKitEntity> opcoesKit;

    @OneToMany(mappedBy = "tabela", cascade = {CascadeType.REMOVE, CascadeType.PERSIST}, orphanRemoval = true)
    private List<OpcaoExtraEntity> opcoesExtra;

}
