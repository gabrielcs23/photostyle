package br.com.photostyle.api.model.entity;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "MOSTRUARIO")
public class MostruarioEntity extends BaseEntity {

    @OneToOne(optional = false)
    @JoinColumn(name = "ESC_ID")
    private EscolaEntity escola;

    @OneToMany(cascade = CascadeType.REMOVE)
    @JoinTable(
            name = "RL_MOSTRUARIO_FOTOS",
            joinColumns = @JoinColumn(name = "ID_MOSTRUARIO"),
            inverseJoinColumns = @JoinColumn(name = "ID_FOTO"))
    private List<FotoEntity> fotos;

    public EscolaEntity getEscola() {
        return escola;
    }

    public void setEscola(EscolaEntity escola) {
        this.escola = escola;
    }

    public List<FotoEntity> getFotos() {
        return fotos;
    }

    public void setFotos(List<FotoEntity> fotos) {
        this.fotos = fotos;
    }
}
