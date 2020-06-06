package br.com.photostyle.api.model.adapter;

import br.com.photostyle.api.model.dto.FotoDto;
import br.com.photostyle.api.model.entity.FotoEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class FotoAdapter extends BaseAdapter<FotoEntity, FotoDto> {

    @Override
    public FotoEntity dtoToEntity(FotoDto dto) {
        FotoEntity entity = new FotoEntity();
        entity.setId(dto.getId());
        entity.setPath(dto.getUrl());

        return entity;
    }

    @Override
    public FotoDto entityToDto(FotoEntity entity) {
        FotoDto fotoDto = new FotoDto();
        fotoDto.setId(entity.getId());
        fotoDto.setUrl(entity.getPath());
        return fotoDto;
    }

    @Override
    public List<FotoDto> entityListToDtoList(List<FotoEntity> entityList) {
        return entityList.stream().map(this::entityToDto).collect(Collectors.toList());
    }

}
