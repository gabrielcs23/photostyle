package br.com.photostyle.api.service;

import br.com.photostyle.api.component.GeradorCodigoAcesso;
import br.com.photostyle.api.model.adapter.AlunoAdapter;
import br.com.photostyle.api.model.dto.AlunoDto;
import br.com.photostyle.api.model.dto.FotoDto;
import br.com.photostyle.api.model.dto.IrmaoRelDto;
import br.com.photostyle.api.model.entity.AlunoEntity;
import br.com.photostyle.api.model.entity.FotoEntity;
import br.com.photostyle.api.model.entity.IrmaoRelEntity;
import br.com.photostyle.api.model.entity.TurmaEntity;
import br.com.photostyle.api.repository.AlunoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlunoService extends BaseService<AlunoEntity, AlunoDto> {

    @Autowired
    private AlunoRepository repository;

    @Autowired
    private AlunoAdapter adapter;

    @Autowired
    private GeradorCodigoAcesso geradorCodAcesso;

    @Autowired
    private IrmaoService irmaoService;

    @Autowired
    private TurmaService turmaService;

    @Autowired
    private FotoService fotoService;

    public AlunoService(AlunoRepository repository, AlunoAdapter adapter) {
        super(repository, adapter);
    }

    @Override
    @Transactional
    public AlunoDto criar(AlunoDto aluno) {
        TurmaEntity turma = turmaService.getEntityPorId(aluno.getTurma().getId());
        if (turma == null) {
            return null;
        }
        AlunoEntity alunoEntity = adapter.dtoToEntity(aluno);
        alunoEntity.setTurma(turma);
        alunoEntity.setEscola(turma.getEscola());

        if (aluno.getId() != null) {
            AlunoEntity entityAnterior = getEntityPorId(aluno.getId());
            if (entityAnterior.getFoto() != null) {
                alunoEntity.setFoto(entityAnterior.getFoto());
            }
            alunoEntity.setCodigoAcesso(entityAnterior.getCodigoAcesso());
        } else {
            gerarCodigo(alunoEntity);
        }

        AlunoEntity entitySaved = repository.save(alunoEntity);

        if (aluno.getIrmaoRel() != null && !CollectionUtils.isEmpty(aluno.getIrmaoRel().getIrmaos())) {
            IrmaoRelDto irmaoRel = aluno.getIrmaoRel();
            List<Long> idsIrmaos = irmaoRel.getIrmaos()
                    .stream()
                    .map(AlunoDto::getId)
                    .collect(Collectors.toList());
            irmaoService.relacionaIrmaos(entitySaved, idsIrmaos);
        }

        return adapter.entityToDto(entitySaved);
    }

    public AlunoDto getPorId(Long id, Long idAno) {
        AlunoEntity entity = getEntityPorId(id);
        filtraFotos(entity, idAno);
        return adapter.entityToDto(entity);
    }

    private void gerarCodigo(AlunoEntity aluno) {
        String codigoAcesso;
        boolean isCodUnico;
        do {
            codigoAcesso = geradorCodAcesso.gerarCodigo(aluno.getEscola().getNome(), aluno.getMatricula());
            isCodUnico = repository.getByCodigoAcesso(codigoAcesso) == null;
        } while(!isCodUnico);
        aluno.setCodigoAcesso(codigoAcesso);
    }

    @Transactional
    public void remover(AlunoEntity aluno) {
        if (aluno.getIrmaoRel() != null) {
            irmaoService.removeRelacionamento(aluno.getIrmaoRel(), aluno);
        }

        if (aluno.getFoto() != null) {
            FotoEntity fotoCopia = fotoService.copiaFoto(aluno.getFoto());
            aluno.setFoto(null);
            fotoService.remover(fotoCopia);
        }

        repository.delete(aluno);
    }

    private void filtraFotos(AlunoEntity entity, Long idAno) {
        if (entity.getIrmaoRel() != null) {
            IrmaoRelEntity irmaoRel = entity.getIrmaoRel();
            irmaoRel.setFotos(filtraFotosPorAno(irmaoRel.getFotos(), idAno));
        }
    }

    private List<FotoEntity> filtraFotosPorAno(List<FotoEntity> fotos, Long idAno) {
        if (!CollectionUtils.isEmpty(fotos)) {
            return fotos.stream()
                    .filter(foto -> foto.getAno().getId().equals(idAno))
                    .collect(Collectors.toList());
        }
        return fotos;
    }

    public List<AlunoDto> getAlunosByTurma(Long idTurma, Long idAno) {
        List<AlunoEntity> alunos = repository.getAlunoEntitiesByTurma_Id(idTurma);
        alunos.forEach(aluno -> filtraFotos(aluno, idAno));
        return adapter.entityListToDtoList(alunos);
    }

    public List<AlunoDto> getAlunosNomesByTurmaId(Long idTurma) {
        List<AlunoEntity> alunos = repository.getAlunoEntitiesByTurma_Id(idTurma);
        return adapter.entityListToDtoNomesList(alunos);
    }

    @Transactional
    public FotoDto uploadFoto(AlunoEntity aluno, MultipartFile foto, Long idAno) {
        FotoEntity fotoEntity = fotoService.upload(foto, idAno);

        FotoEntity fotoAntiga = null;
        if (aluno.getFoto() != null) {
            fotoAntiga = fotoService.copiaFoto(aluno.getFoto());
        }

        aluno.setFoto(fotoEntity);
        repository.save(aluno);

        if (fotoAntiga != null) {
            fotoService.remover(fotoAntiga);
        }
        return fotoService.entityToDto(fotoEntity);
    }

    @Transactional
    public void removeFoto(AlunoEntity aluno) {
        FotoEntity foto = fotoService.copiaFoto(aluno.getFoto());
        aluno.setFoto(null);
        repository.save(aluno);
        fotoService.remover(foto);
    }

    @Transactional
    public List<AlunoDto> cadastrasAlunosEmTurma(TurmaEntity turma, List<AlunoDto> alunos) {
        if (!CollectionUtils.isEmpty(alunos)) {
            return alunos.stream()
                    .map(alunoDto -> {
                        AlunoEntity alunoEntity;
                        if (alunoDto.getId() != null) {
                            alunoEntity = getEntityPorId(alunoDto.getId());
                            if (!alunoEntity.getTurma().getId().equals(turma.getId())) {
                                alunoEntity.setTurma(turma);
                                alunoEntity = repository.save(alunoEntity);
                            }
                        } else {
                            alunoEntity = adapter.dtoToEntity(alunoDto);
                            alunoEntity.setEscola(turma.getEscola());
                            alunoEntity = repository.save(alunoEntity);
                        }
                        return adapter.entityToDto(alunoEntity);
                    }).collect(Collectors.toList());
        }
        return new ArrayList<>();
    }

    public AlunoDto moverAlunoParaTurma(Long idAluno, Long idTurma) {
        TurmaEntity turma = turmaService.getEntityPorId(idTurma);
        if (turma == null) {
            return null;
        }

        AlunoEntity aluno = getEntityPorId(idAluno);
        if (aluno == null) {
            return null;
        }

        return moverAlunoParaTurma(aluno, turma);
    }

    @Transactional
    public AlunoDto moverAlunoParaTurma(AlunoEntity aluno, TurmaEntity turma) {
        aluno.setTurma(turma);
        repository.save(aluno);
        return adapter.entityToDto(aluno);
    }

    public FotoDto adicionarFotoIrmao(AlunoEntity aluno, MultipartFile foto, Long idAno) {
        return irmaoService.adicionarFotoIrmao(aluno.getIrmaoRel(), foto, idAno);
    }

    public void removerFotoIrmao(AlunoEntity aluno, Long idFoto) {
        irmaoService.removerFotoIrmao(aluno.getIrmaoRel(), idFoto);
    }

    public AlunoEntity getAlunoByCodAcesso(String codAcesso) {
        return repository.getByCodigoAcesso(codAcesso);
    }
}
