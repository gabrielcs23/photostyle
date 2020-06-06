package br.com.photostyle.api.service;

import br.com.photostyle.api.model.adapter.EscolaAdapter;
import br.com.photostyle.api.model.dto.EscolaDto;
import br.com.photostyle.api.model.dto.TurmaDto;
import br.com.photostyle.api.model.entity.EscolaEntity;
import br.com.photostyle.api.repository.EscolaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
public class EscolaService extends BaseService<EscolaEntity, EscolaDto> {

    @Autowired
    private TurmaService turmaService;

    public EscolaService(EscolaRepository repository, EscolaAdapter adapter) {
        super(repository, adapter);
    }

    @Transactional
    public List<TurmaDto> cadastrarTurmas(Long id, List<TurmaDto> turmas) {
        EscolaEntity escola = getEntityPorId(id);
        return turmaService.cadastrarTurmasEmEscola(escola, turmas);
    }

    public List<TurmaDto> getTurmas(Long id) {
        EscolaEntity escola = getEntityPorId(id);
        return turmaService.entityListToDtoList(escola.getTurmas());
    }
}
