package br.com.photostyle.api.model.adapter;

import br.com.photostyle.api.infra.service.ImageNameManager;
import br.com.photostyle.api.model.dto.FotoDto;
import br.com.photostyle.api.model.entity.FotoEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class FotoAdapter extends BaseAdapter<FotoEntity, FotoDto> {

    @Autowired
    private ImageNameManager imgNameManager;

    @Override
    public FotoEntity dtoToEntity(FotoDto dto) {
        FotoEntity entity = new FotoEntity();
        entity.setId(dto.getId());

        return entity;
    }

    @Override
    public FotoDto entityToDto(FotoEntity entity) {
        FotoDto fotoDto = new FotoDto();
        fotoDto.setId(entity.getId());
        fotoDto.setDescricao(entity.getDescricao());

        String url = imgNameManager.buildUrl(entity.getFileName());
        fotoDto.setUrl(url);

        return fotoDto;
    }

    @Override
    public List<FotoDto> entityListToDtoList(List<FotoEntity> entityList) {
        return entityList.stream().map(this::entityToDto).collect(Collectors.toList());
    }

}
