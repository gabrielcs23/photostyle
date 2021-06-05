package br.com.photostyle.api.model.adapter.tabela;

import br.com.photostyle.api.model.adapter.BaseAdapter;
import br.com.photostyle.api.model.dto.tabela.OpcaoKitDto;
import br.com.photostyle.api.model.entity.tabela.OpcaoKitEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class OpcaoKitAdapter extends BaseAdapter<OpcaoKitEntity, OpcaoKitDto> {

    @Override
    public OpcaoKitEntity dtoToEntity(OpcaoKitDto dto) {
        OpcaoKitEntity entity = new OpcaoKitEntity();
        entity.setId(dto.getId());
        entity.setNome(dto.getNome());
        entity.setValor(dto.getValor());
        entity.setTurma(dto.getIsTurma());
        entity.setIrmao(dto.getIsIrmao());
        return entity;
    }

    @Override
    public OpcaoKitDto entityToDto(OpcaoKitEntity entity) {
        OpcaoKitDto dto = new OpcaoKitDto();
        dto.setId(entity.getId());
        dto.setTabela(entity.getTabelaId());
        dto.setNome(entity.getNome());
        dto.setValor(entity.getValor());
        dto.setIsTurma(entity.isTurma());
        dto.setIsIrmao(entity.isIrmao());
        return dto;
    }

    @Override
    public List<OpcaoKitDto> entityListToDtoList(List<OpcaoKitEntity> entityList) {
        return entityList.stream().map(this::entityToDto).collect(Collectors.toList());
    }
}
