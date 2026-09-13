package br.com.photostyle.api.service;

import br.com.photostyle.api.model.adapter.tabela.OpcaoExtraAdapter;
import br.com.photostyle.api.model.adapter.tabela.OpcaoKitAdapter;
import br.com.photostyle.api.model.adapter.tabela.TabelaPrecoAdapter;
import br.com.photostyle.api.model.dto.tabela.OpcaoExtraDto;
import br.com.photostyle.api.model.dto.tabela.OpcaoKitDto;
import br.com.photostyle.api.model.dto.tabela.TabelaPorEscolaDTO;
import br.com.photostyle.api.model.dto.tabela.TabelaPrecoDto;
import br.com.photostyle.api.model.entity.EscolaEntity;
import br.com.photostyle.api.model.entity.tabela.OpcaoExtraEntity;
import br.com.photostyle.api.model.entity.tabela.OpcaoKitEntity;
import br.com.photostyle.api.model.entity.tabela.TabelaDePrecoEntity;
import br.com.photostyle.api.repository.tabela.OpcaoExtraRepository;
import br.com.photostyle.api.repository.tabela.OpcaoKitRepository;
import br.com.photostyle.api.repository.tabela.TabelaPrecoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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
    private OpcaoKitRepository opKitRepository;

    @Autowired
    private OpcaoExtraRepository opExtraRepository;

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

    public TabelaDePrecoEntity getPorEscolaOuDefault(Long idEscola) {
        TabelaDePrecoEntity tabela = repository.getByEscolaId(idEscola);
        if (tabela == null) {
            return repository.getOne(1L);
        }
        return tabela;
    }

    @Transactional
    public TabelaPrecoDto criarComEscola(Long idEscola, TabelaPrecoDto dto) {
        EscolaEntity escola = escolaService.getEntityPorId(idEscola);
        if (escola == null) {
            return null;
        }
        TabelaDePrecoEntity entity = construir(dto);

        entity.setEscola(escola);

        entity = repository.save(entity);
        TabelaPrecoDto dtoRetorno = adapter.entityToDto(entity);
        dtoRetorno.setEscola(escola.getId());
        return dtoRetorno;
    }

    @Transactional
    public TabelaPrecoDto criarSemEscola(TabelaPrecoDto dto) {
        TabelaDePrecoEntity entity = construir(dto);
        entity = repository.save(entity);
        return adapter.entityToDto(entity);
    }

    @Transactional
    public TabelaPrecoDto atualizarTabela(Long id, TabelaPrecoDto tabelaDto) {
        TabelaDePrecoEntity tabelaEntity = getEntityPorId(id);
        if (tabelaEntity == null) {
            return null;
        }

        List<OpcaoKitDto> kitDtos = tabelaDto.getOpcoesKit();
        for (OpcaoKitDto dto : kitDtos) {
            OpcaoKitEntity entity;
            if (dto.getId() != null) {
                entity = opKitRepository.getOne(dto.getId());
                entity.setValor(dto.getValor());
                entity.setNome(dto.getNome());
                entity.setIrmao(dto.getIsIrmao());
                entity.setTurma(dto.getIsTurma());
            } else {
                entity = construirOpcaoKit(tabelaEntity, dto);
            }
            opKitRepository.save(entity);
        }

        List<OpcaoExtraDto> extraDtos = tabelaDto.getOpcoesExtra();
        for (OpcaoExtraDto dto : extraDtos) {
            OpcaoExtraEntity entity;
            if (dto.getId() != null) {
                entity = opExtraRepository.getOne(dto.getId());
                entity.setValor(dto.getValor());
                entity.setNome(dto.getNome());
                entity.setIrmao(dto.getIsIrmao());
                entity.setTurma(dto.getIsTurma());
                entity.setOpcional(dto.getIsOpcional());
                entity.setDigital(dto.getIsDigital());
            } else {
                entity = construirOpcaoExtra(tabelaEntity, dto);
            }
            opExtraRepository.save(entity);
        }

        tabelaEntity = getEntityPorId(id);
        return adapter.entityToDto(tabelaEntity);
    }

    public List<TabelaPorEscolaDTO> listarTabelas() {
        return repository.listarTabelas();
    }

    @Transactional
    public TabelaPrecoDto copiarTabela(long idEscola, long idTabela) {
        TabelaDePrecoEntity dest = new TabelaDePrecoEntity();

        List<OpcaoKitEntity> destKits = new ArrayList<>();
        for (OpcaoKitEntity orgKit : repository.getOpcoesKit(idTabela)) {
            OpcaoKitEntity destKit = OpcaoKitEntity.copia(orgKit);
            destKit.setTabela(dest);
            destKits.add(destKit);
        }
        dest.setOpcoesKit(destKits);

        List<OpcaoExtraEntity> destExtras = new ArrayList<>();
        for (OpcaoExtraEntity orgExtra : repository.getOpcoesExtra(idTabela)) {
            OpcaoExtraEntity destExtra = OpcaoExtraEntity.copia(orgExtra);
            destExtra.setTabela(dest);
            destExtras.add(destExtra);
        }
        dest.setOpcoesExtra(destExtras);

        dest.setEscola(new EscolaEntity(idEscola));
        dest = repository.save(dest);

        return adapter.entityToDto(dest);
    }

    private TabelaDePrecoEntity construir(TabelaPrecoDto dto) {
        TabelaDePrecoEntity entity = adapter.dtoToEntity(dto);
        construirItensTabela(entity, dto);
        return entity;
    }

    private void construirItensTabela(TabelaDePrecoEntity entity, TabelaPrecoDto dto) {
        List<OpcaoKitEntity> opsKit = dto.getOpcoesKit().stream()
                .map(op -> this.construirOpcaoKit(entity, op))
                .collect(Collectors.toList());
        entity.setOpcoesKit(opsKit);

        List<OpcaoExtraEntity> opsExtra = dto.getOpcoesExtra().stream()
                .map(op -> this.construirOpcaoExtra(entity, op))
                .collect(Collectors.toList());
        entity.setOpcoesExtra(opsExtra);
    }

    private OpcaoKitEntity construirOpcaoKit(TabelaDePrecoEntity tabela, OpcaoKitDto dto) {
        OpcaoKitEntity entity = opKitAdapter.dtoToEntity(dto);
        entity.setTabela(tabela);
        return entity;
    }

    private OpcaoExtraEntity construirOpcaoExtra(TabelaDePrecoEntity tabela, OpcaoExtraDto dto) {
        OpcaoExtraEntity entity = opExtraAdapter.dtoToEntity(dto);
        entity.setTabela(tabela);
        return entity;
    }

}
