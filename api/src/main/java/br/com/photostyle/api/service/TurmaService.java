package br.com.photostyle.api.service;

import br.com.photostyle.api.model.adapter.TurmaAdapter;
import br.com.photostyle.api.model.dto.AlunoDto;
import br.com.photostyle.api.model.dto.FotoDto;
import br.com.photostyle.api.model.dto.TurmaDto;
import br.com.photostyle.api.model.entity.AlunoEntity;
import br.com.photostyle.api.model.entity.EscolaEntity;
import br.com.photostyle.api.model.entity.FotoEntity;
import br.com.photostyle.api.model.entity.TurmaEntity;
import br.com.photostyle.api.repository.TurmaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TurmaService extends BaseService<TurmaEntity, TurmaDto> {

    @Autowired
    private TurmaRepository repository;

    @Autowired
    private TurmaAdapter adapter;

    @Autowired
    private EscolaService escolaService;

    @Autowired
    private AlunoService alunoService;

    @Autowired
    private FotoService fotoService;

    public TurmaService(TurmaRepository repository, TurmaAdapter adapter) {
        super(repository, adapter);
    }

    @Transactional
    public TurmaDto cadastrarTurma(TurmaDto turma) {
        TurmaEntity turmaEntity = adapter.dtoToEntity(turma);
        if (turmaEntity.getId() == null) {
            EscolaEntity escola = escolaService.getEntityPorId(turma.getEscola().getId());
            if (escola == null) {
                return null;
            }
            turmaEntity.setEscola(escola);
        } else {
            TurmaEntity entityAntiga = getEntityPorId(turmaEntity.getId());
            turmaEntity.setEscola(entityAntiga.getEscola());
            turmaEntity.setFotos(entityAntiga.getFotos());
        }
        turmaEntity = repository.save(turmaEntity);
        return adapter.entityToDto(turmaEntity);
    }

    @Transactional
    public List<TurmaDto> cadastrarTurmasEmEscola(EscolaEntity escola, List<TurmaDto> turmas) {
        if (!CollectionUtils.isEmpty(turmas)) {
            return turmas.stream()
                    .map(turmaDto -> {
                        TurmaEntity turmaEntity;
                        if (turmaDto.getId() != null) {
                            turmaEntity = getEntityPorId(turmaDto.getId());
                        } else {
                            turmaEntity = adapter.dtoToEntity(turmaDto);
                            turmaEntity.setEscola(escola);
                            turmaEntity = repository.save(turmaEntity);
                        }
                        return adapter.entityToDto(turmaEntity);
                    }).collect(Collectors.toList());
        }
        return new ArrayList<>();
    }

    @Transactional
    public TurmaEntity cadastrarTurmaEmEscola(EscolaEntity escola, String nomeTurma) {
        if (StringUtils.isEmpty(nomeTurma)) {
            throw new RuntimeException("Nome da turma não pode ser vazio");
        }
        TurmaEntity turma = new TurmaEntity();
        turma.setEscola(escola);
        turma.setNome(nomeTurma);
        return repository.save(turma);
    }

    @Transactional
    public void cadastrarTurmasComAlunos(EscolaEntity escola, Map<String, List<AlunoEntity>> alunosPorNomeDeSheet) {
        alunosPorNomeDeSheet.forEach((nomeSheet, alunos) -> {
            TurmaEntity turma = cadastrarTurmaEmEscola(escola, nomeSheet.trim());
            alunoService.salvarAlunosDaTurma(turma, alunos);
        });
    }

    public List<TurmaDto> getTurmasPorEscolaId(Long idEscola) {
        List<TurmaEntity> turmas = repository.getTurmaEntitiesByEscola_Id(idEscola);
        return entityListToDtoList(turmas);
    }

    public List<TurmaDto> getTurmasNomesPorEscolaId(Long idEscola) {
        List<TurmaEntity> turmas = repository.getTurmaEntitiesByEscola_Id(idEscola);
        return adapter.entityListDtoNomesList(turmas);
    }

    @Transactional
    public void remover(TurmaEntity turma) {
        if (!CollectionUtils.isEmpty(turma.getAlunos())) {
            turma.getAlunos().forEach(aluno -> alunoService.remover(aluno));
        }
        if (!CollectionUtils.isEmpty(turma.getFotos())) {
            fotoService.removerEmLote(turma.getFotos());
        }
        repository.delete(turma);
    }

    public List<TurmaDto> entityListToDtoList(List<TurmaEntity> turmas) {
        return adapter.entityListToDtoList(turmas);
    }

    public List<AlunoDto> getAlunos(Long id) {
        return alunoService.getAlunosByTurmaId(id);
    }

    public List<AlunoDto> cadastrarAlunos(Long id, List<AlunoDto> alunos) {
        TurmaEntity turma = getEntityPorId(id);
        return alunoService.cadastrarAlunosEmTurma(turma, alunos);
    }

    @Transactional
    public void removerFoto(TurmaEntity turma, Long idFoto) {
        List<FotoEntity> fotos = turma.getFotos();
        if (!CollectionUtils.isEmpty(fotos)) {
            List<FotoEntity> fotosFiltradas = fotos.stream()
                    .filter(foto -> !foto.getId().equals(idFoto))
                    .collect(Collectors.toList());
            turma.setFotos(fotosFiltradas);
            repository.save(turma);
            fotoService.remover(idFoto);
        }
    }

    @Transactional
    public FotoDto adicionarFoto(TurmaEntity turma, MultipartFile foto) {
        FotoEntity fotoEntity = fotoService.upload(foto);
        turma.getFotos().add(fotoEntity);
        repository.save(turma);

        return fotoService.entityToDto(fotoEntity);
    }

}
