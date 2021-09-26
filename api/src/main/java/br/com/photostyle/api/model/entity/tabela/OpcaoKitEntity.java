package br.com.photostyle.api.model.entity.tabela;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "OPCAO_KIT")
public class OpcaoKitEntity extends ItemTabelaBaseEntity {

    public static OpcaoKitEntity copia(OpcaoKitEntity org) {
        OpcaoKitEntity dest = new OpcaoKitEntity();
        copia(org, dest);
        return dest;
    }
}
