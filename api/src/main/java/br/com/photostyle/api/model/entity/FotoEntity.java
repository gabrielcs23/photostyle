package br.com.photostyle.api.model.entity;

import javax.persistence.*;

@Entity
@Table(name = "FOTO")
@SequenceGenerator(name = "foto_seq", sequenceName = "foto_seq", initialValue = 1, allocationSize = 1)
public class FotoEntity {

    @Id
    @GeneratedValue(generator = "foto_seq", strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fileName;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
}
