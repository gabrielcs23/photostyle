package br.com.photostyle.api.model.adapter;

import br.com.photostyle.api.model.dto.FotoDto;
import br.com.photostyle.api.model.dto.MostruarioDto;
import br.com.photostyle.api.model.entity.MostruarioEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.List;

@Component
public class MostruarioAdapter {

    @Autowired
    FotoAdapter fotoAdapter;

    public MostruarioDto entityToDto(MostruarioEntity entity) {
        MostruarioDto dto = new MostruarioDto();
        dto.setId(entity.getId());

        if (!CollectionUtils.isEmpty(entity.getFotos())) {
            List<FotoDto> fotos = fotoAdapter.entityListToDtoList(entity.getFotos());
            dto.setFotos(fotos);
        }

        return dto;
    }
}
