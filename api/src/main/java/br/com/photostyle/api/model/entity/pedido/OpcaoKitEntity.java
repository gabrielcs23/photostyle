package br.com.photostyle.api.model.entity.pedido;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "OpcaoKit")
public class OpcaoKitEntity extends ItemTabelaBaseEntity {

    @Column(name = "isIrmao", nullable = false)
    private boolean isIrmao;

    public boolean isIrmao() {
        return isIrmao;
    }

    public void setIrmao(boolean irmao) {
        isIrmao = irmao;
    }
}
