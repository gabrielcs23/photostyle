package br.com.photostyle.api.model.dto;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import java.util.List;

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id", scope=MostruarioDto.class)
public class MostruarioDto {

    private Long id;
    private List<FotoDto> fotos;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<FotoDto> getFotos() {
        return fotos;
    }

    public void setFotos(List<FotoDto> fotos) {
        this.fotos = fotos;
    }
}
