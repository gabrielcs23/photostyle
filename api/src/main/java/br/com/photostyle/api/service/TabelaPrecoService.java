package br.com.photostyle.api.service;

import br.com.photostyle.api.model.adapter.tabela.OpcaoExtraAdapter;
import br.com.photostyle.api.model.adapter.tabela.OpcaoKitAdapter;
import br.com.photostyle.api.model.adapter.tabela.TabelaPrecoAdapter;
import br.com.photostyle.api.model.dto.tabela.OpcaoExtraDto;
import br.com.photostyle.api.model.dto.tabela.OpcaoKitDto;
import br.com.photostyle.api.model.dto.tabela.TabelaPrecoDto;
import br.com.photostyle.api.model.entity.EscolaEntity;
import br.com.photostyle.api.model.entity.tabela.OpcaoExtraEntity;
import br.com.photostyle.api.model.entity.tabela.OpcaoKitEntity;
import br.com.photostyle.api.model.entity.tabela.TabelaDePrecoEntity;
import br.com.photostyle.api.repository.tabela.TabelaPrecoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TabelaPrecoService extends BaseService<TabelaDePrecoEntity, TabelaPrecoDto> {

    @Autowired
    private TabelaPrecoRepository repository;

    @Autowired
    private TabelaPrecoAdapter adapter;

    @Autowired
    private EscolaService escolaService;

    @Autowired
    private OpcaoKitAdapter opKitAdapter;

    @Autowired
    private OpcaoExtraAdapter opExtraAdapter;

    public TabelaPrecoService(TabelaPrecoRepository repository, TabelaPrecoAdapter adapter) {
        super(repository, adapter);
    }

    public TabelaPrecoDto recuperarPorEscola(Long idEscola) {
        TabelaDePrecoEntity tabela = repository.getByEscolaId(idEscola);
        if (tabela == null) {
            return null;
        }
        return adapter.entityToDto(tabela);
    }

    @Transactional
    @Override
    public TabelaPrecoDto criar(TabelaPrecoDto dto) {
        EscolaEntity escola = escolaService.getEntityPorId(dto.getEscola());
        if (escola == null) {
            return null;
        }
        TabelaDePrecoEntity entity = adapter.dtoToEntity(dto);
        entity.setEscola(escola);

        criarItensTabela(entity, dto);

        entity = repository.save(entity);
        TabelaPrecoDto dtoRetorno = adapter.entityToDto(entity);
        dtoRetorno.setEscola(escola.getId());
        return dtoRetorno;
    }

    private void criarItensTabela(TabelaDePrecoEntity entity, TabelaPrecoDto dto) {
        List<OpcaoKitEntity> opsKit = dto.getOpcoesKit().stream()
                .map(op -> this.criarOpcaoKit(entity, op))
                .collect(Collectors.toList());
        entity.setOpcoesKit(opsKit);

        List<OpcaoExtraEntity> opsExtra = dto.getOpcoesExtra().stream()
                .map(op -> this.criarOpcaoExtra(entity, op))
                .collect(Collectors.toList());
        entity.setOpcoesExtra(opsExtra);
    }

    private OpcaoKitEntity criarOpcaoKit(TabelaDePrecoEntity tabela, OpcaoKitDto dto) {
        OpcaoKitEntity entity = opKitAdapter.dtoToEntity(dto);
        entity.setTabela(tabela);
        return entity;
    }

    private OpcaoExtraEntity criarOpcaoExtra(TabelaDePrecoEntity tabela, OpcaoExtraDto dto) {
        OpcaoExtraEntity entity = opExtraAdapter.dtoToEntity(dto);
        entity.setTabela(tabela);
        return entity;
    }

}
