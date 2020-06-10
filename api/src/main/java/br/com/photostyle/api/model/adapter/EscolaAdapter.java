package br.com.photostyle.api.model.adapter;

import br.com.photostyle.api.model.dto.EscolaDto;
import br.com.photostyle.api.model.dto.TurmaDto;
import br.com.photostyle.api.model.entity.EscolaEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class EscolaAdapter extends BaseAdapter<EscolaEntity, EscolaDto>{

    @Override
    public EscolaEntity dtoToEntity(EscolaDto dto){
        EscolaEntity entity = new EscolaEntity();
        entity.setId(dto.getId());
        entity.setNome(dto.getNome());
        return entity;
    }

    @Override
    public EscolaDto entityToDto(EscolaEntity entity) {
        if (entity == null) {
            return null;
        }
        EscolaDto dto = new EscolaDto();
        dto.setId(entity.getId());
        dto.setNome(entity.getNome());
        if (!CollectionUtils.isEmpty(entity.getTurmas())){
            List<TurmaDto> turmasDto = entity.getTurmas().stream()
                    .map(turmaEntity -> {
                        TurmaDto turmaDto = new TurmaDto();
                        turmaDto.setId(entity.getId());
                        turmaDto.setNome(turmaEntity.getNome());
                        return turmaDto;
                    })
                    .collect(Collectors.toList());
            dto.setTurmas(turmasDto);
        } else {
            dto.setTurmas(new ArrayList<>());
        }
        return dto;
    }

    @Override
    public List<EscolaDto> entityListToDtoList(List<EscolaEntity> entityList) {
        return entityList.stream().map(this::entityToDto).collect(Collectors.toList());
    }

}
