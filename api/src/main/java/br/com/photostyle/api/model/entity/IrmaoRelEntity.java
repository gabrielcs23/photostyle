package br.com.photostyle.api.model.entity;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "RL_IRMAO")
public class IrmaoRelEntity {

    @Id
    @GeneratedValue(generator = "irmao_seq", strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "irmaoRel", cascade = CascadeType.PERSIST)
    @Column(nullable = false)
    private List<AlunoEntity> irmaos;

    @OneToMany(cascade = CascadeType.REMOVE)
    @JoinTable(name="RL_IRMAO_FOTOS", joinColumns=@JoinColumn(name="ID_RL_IRMAO"), inverseJoinColumns=@JoinColumn(name="ID_FOTO"))
    private List<FotoEntity> fotos;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<AlunoEntity> getIrmaos() {
        return irmaos;
    }

    public void setIrmaos(List<AlunoEntity> irmaos) {
        this.irmaos = irmaos;
    }

    public List<FotoEntity> getFotos() {
        return fotos;
    }

    public void setFotos(List<FotoEntity> fotos) {
        this.fotos = fotos;
    }
}
