package br.com.photostyle.api.model.adapter.tabela;

import br.com.photostyle.api.model.adapter.BaseAdapter;
import br.com.photostyle.api.model.dto.tabela.OpcaoExtraDto;
import br.com.photostyle.api.model.entity.tabela.OpcaoExtraEntity;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class OpcaoExtraAdapter extends BaseAdapter<OpcaoExtraEntity, OpcaoExtraDto> {
    @Override
    public OpcaoExtraEntity dtoToEntity(OpcaoExtraDto dto) {
        OpcaoExtraEntity entity = new OpcaoExtraEntity();
        entity.setId(dto.getId());
        entity.setNome(dto.getNome());
        entity.setValor(dto.getValor());
        entity.setIrmao(dto.getIsIrmao());
        entity.setDigital(dto.getIsDigital());
        entity.setOpcional(dto.getIsOpcional());
        entity.setTurma(dto.getIsTurma());
        return entity;
    }

    @Override
    public OpcaoExtraDto entityToDto(OpcaoExtraEntity entity) {
        OpcaoExtraDto dto = new OpcaoExtraDto();
        dto.setId(entity.getId());
        dto.setTabela(entity.getTabelaId());
        dto.setNome(entity.getNome());
        dto.setValor(entity.getValor());
        dto.setIsIrmao(entity.isIrmao());
        dto.setIsDigital(entity.isDigital());
        dto.setIsOpcional(entity.isOpcional());
        dto.setIsTurma(entity.isTurma());
        return dto;
    }

    @Override
    public List<OpcaoExtraDto> entityListToDtoList(List<OpcaoExtraEntity> entityList) {
        return entityList.stream().map(this::entityToDto).collect(Collectors.toList());
    }
}
