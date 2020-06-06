package br.com.photostyle.api.model.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import javax.persistence.*;

@Entity
@Table(name = "FOTO")
@SequenceGenerator(name = "foto_seq", sequenceName = "foto_seq", initialValue = 1, allocationSize = 1)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class FotoEntity {

    @Id
    @GeneratedValue(generator = "foto_seq", strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String path;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

}
