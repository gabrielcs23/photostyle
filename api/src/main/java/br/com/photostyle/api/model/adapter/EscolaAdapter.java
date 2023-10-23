package br.com.photostyle.api.model.adapter;

import br.com.photostyle.api.model.dto.EscolaDto;
import br.com.photostyle.api.model.entity.EscolaEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class EscolaAdapter extends BaseAdapter<EscolaEntity, EscolaDto> {

    @Override
    public EscolaEntity dtoToEntity(EscolaDto dto) {
        EscolaEntity entity = new EscolaEntity();
        entity.setId(dto.getId());
        entity.setNome(dto.getNome());
        entity.setApelido(dto.getApelido());
        return entity;
    }

    @Override
    public EscolaDto entityToDto(EscolaEntity entity) {
        return createBasicDto(entity);
    }

    public EscolaDto createBasicDto(EscolaEntity entity) {
        if (entity == null) {
            return null;
        }
        EscolaDto dto = new EscolaDto();
        dto.setId(entity.getId());
        dto.setNome(entity.getNome());
        dto.setApelido(entity.getApelido());
        return dto;
    }

    @Override
    public List<EscolaDto> entityListToDtoList(List<EscolaEntity> entityList) {
        return entityList.stream().map(this::entityToDto).collect(Collectors.toList());
    }

}
