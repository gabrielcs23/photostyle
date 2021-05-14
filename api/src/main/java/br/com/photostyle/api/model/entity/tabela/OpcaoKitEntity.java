package br.com.photostyle.api.model.entity.tabela;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "OPCAO_KIT")
public class OpcaoKitEntity extends ItemTabelaBaseEntity {

    @Column(name = "IS_IRMAO", nullable = false)
    private boolean isIrmao;

    public boolean isIrmao() {
        return isIrmao;
    }

    public void setIrmao(boolean irmao) {
        isIrmao = irmao;
    }
}
