package br.com.photostyle.api.model.adapter;

import br.com.photostyle.api.model.dto.AnoDto;
import br.com.photostyle.api.model.entity.AnoEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class AnoAdapter extends BaseAdapter<AnoEntity, AnoDto> {

    @Override
    public AnoEntity dtoToEntity(AnoDto dto) {
        return new AnoEntity(dto.getNome());
    }

    @Override
    public AnoDto entityToDto(AnoEntity entity) {
        return new AnoDto(entity.getId(), entity.getNome());
    }

    @Override
    public List<AnoDto> entityListToDtoList(List<AnoEntity> entityList) {
        return entityList.stream().map(this::entityToDto).collect(Collectors.toList());
    }
}
