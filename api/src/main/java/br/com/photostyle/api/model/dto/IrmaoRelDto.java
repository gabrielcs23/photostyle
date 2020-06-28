package br.com.photostyle.api.model.dto;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import java.util.List;

@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id", scope = IrmaoRelDto.class)
public class IrmaoRelDto {

    private Long id;

    private List<AlunoDto> irmaos;

    private List<FotoDto> fotos;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<AlunoDto> getIrmaos() {
        return irmaos;
    }

    public void setIrmaos(List<AlunoDto> irmaos) {
        this.irmaos = irmaos;
    }

    public List<FotoDto> getFotos() {
        return fotos;
    }

    public void setFotos(List<FotoDto> fotos) {
        this.fotos = fotos;
    }
}
