package br.com.photostyle.api.model.adapter;

import br.com.photostyle.api.model.dto.EscolaDto;
import br.com.photostyle.api.model.dto.FotoDto;
import br.com.photostyle.api.model.dto.TurmaDto;
import br.com.photostyle.api.model.entity.EscolaEntity;
import br.com.photostyle.api.model.entity.TurmaEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TurmaAdapter extends BaseAdapter<TurmaEntity, TurmaDto> {

    @Autowired
    FotoAdapter fotoAdapter;

    @Override
    public TurmaEntity dtoToEntity(TurmaDto dto) {
        TurmaEntity entity = new TurmaEntity();
        entity.setId(dto.getId());
        entity.setNome(dto.getNome());
        return entity;
    }

    @Override
    public TurmaDto entityToDto(TurmaEntity entity) {
        TurmaDto dto = createBasicDto(entity);
        if (!CollectionUtils.isEmpty(entity.getFotos())) {
            List<FotoDto> fotos = fotoAdapter.entityListToDtoList(entity.getFotos());
            dto.setFotos(fotos);
        }
        return dto;
    }

    @Override
    public List<TurmaDto> entityListToDtoList(List<TurmaEntity> turmaEntityList) {
        return turmaEntityList.stream().map(this::entityToDto).collect(Collectors.toList());
    }

    private TurmaDto createBasicDto(TurmaEntity entity) {
        TurmaDto dto = new TurmaDto();
        dto.setId(entity.getId());
        dto.setNome(entity.getNome());

        EscolaEntity escolaEntity = entity.getEscola();
        EscolaDto escolaDto = new EscolaDto();
        escolaDto.setId(escolaEntity.getId());
        escolaDto.setNome(escolaEntity.getNome());
        escolaDto.setApelido(escolaEntity.getApelido());

        dto.setEscola(escolaDto);
        return dto;
    }

    public List<TurmaDto> entityListDtoNomesList(List<TurmaEntity> turmas) {
        return turmas.stream().map(turmaEntity -> {
            TurmaDto turmaDto = new TurmaDto();
            turmaDto.setId(turmaEntity.getId());
            turmaDto.setNome(turmaEntity.getNome());
            return turmaDto;
        }).collect(Collectors.toList());
    }
}
