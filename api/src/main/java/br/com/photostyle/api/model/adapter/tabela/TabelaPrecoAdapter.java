package br.com.photostyle.api.model.adapter.tabela;

import br.com.photostyle.api.model.adapter.BaseAdapter;
import br.com.photostyle.api.model.dto.tabela.OpcaoExtraDto;
import br.com.photostyle.api.model.dto.tabela.OpcaoKitDto;
import br.com.photostyle.api.model.dto.tabela.TabelaPrecoDto;
import br.com.photostyle.api.model.entity.tabela.OpcaoExtraEntity;
import br.com.photostyle.api.model.entity.tabela.OpcaoKitEntity;
import br.com.photostyle.api.model.entity.tabela.TabelaDePrecoEntity;
import org.apache.commons.collections4.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TabelaPrecoAdapter extends BaseAdapter<TabelaDePrecoEntity, TabelaPrecoDto> {

    @Autowired
    private OpcaoKitAdapter opcaoKitAdapter;

    @Autowired
    private OpcaoExtraAdapter opcaoExtraAdapter;


    @Override
    public TabelaDePrecoEntity dtoToEntity(TabelaPrecoDto dto) {
        TabelaDePrecoEntity entity = new TabelaDePrecoEntity();
        entity.setId(dto.getId());
        return entity;
    }

    @Override
    public TabelaPrecoDto entityToDto(TabelaDePrecoEntity entity) {
        TabelaPrecoDto dto = new TabelaPrecoDto();
        dto.setId(entity.getId());
        dto.setEscola(entity.getEscolaId());

        List<OpcaoKitEntity> opcoesKit = entity.getOpcoesKit();
        List<OpcaoKitDto> opcaoKitDtos = opcaoKitAdapter.entityListToDtoList(opcoesKit);
        dto.setOpcoesKit(opcaoKitDtos);

        List<OpcaoExtraEntity> opcoesExtra = entity.getOpcoesExtra();
        List<OpcaoExtraDto> opcaoExtraDtos = opcaoExtraAdapter.entityListToDtoList(opcoesExtra);
        dto.setOpcoesExtra(opcaoExtraDtos);

        return dto;
    }

    @Override
    public List<TabelaPrecoDto> entityListToDtoList(List<TabelaDePrecoEntity> entityList) {
        throw new UnsupportedOperationException();
    }
}
