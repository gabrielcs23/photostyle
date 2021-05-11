package br.com.photostyle.api.model.entity.pedido;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "OpcaoExtra")
public class OpcaoExtraEntity extends ItemTabelaBaseEntity {

    @Column(name = "isIrmao", nullable = false)
    private boolean isIrmao;

    @Column(name = "isDigital", nullable = false)
    private boolean isDigital;

    @Column(name = "isOpcional", nullable = false)
    private boolean isOpcional;

    public boolean isIrmao() {
        return isIrmao;
    }

    public void setIrmao(boolean irmao) {
        isIrmao = irmao;
    }

    public boolean isDigital() {
        return isDigital;
    }

    public void setDigital(boolean digital) {
        isDigital = digital;
    }

    public boolean isOpcional() {
        return isOpcional;
    }

    public void setOpcional(boolean opcional) {
        isOpcional = opcional;
    }
}
