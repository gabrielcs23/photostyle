package br.com.photostyle.api.model.entity.tabela;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "OPCAO_EXTRA")
public class OpcaoExtraEntity extends ItemTabelaBaseEntity {

    @Column(name = "IS_DIGITAL", nullable = false)
    private boolean isDigital = false;

    @Column(name = "IS_OPCIONAL", nullable = false)
    private boolean isOpcional = false;

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
