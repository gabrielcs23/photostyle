package br.com.photostyle.api.service;

import br.com.photostyle.api.component.GeradorCodigoAcesso;
import br.com.photostyle.api.model.adapter.AlunoAdapter;
import br.com.photostyle.api.model.dto.AlunoComFotoDTO;
import br.com.photostyle.api.model.dto.AlunoDto;
import br.com.photostyle.api.model.dto.FotoDto;
import br.com.photostyle.api.model.dto.IrmaoRelDto;
import br.com.photostyle.api.model.entity.AlunoEntity;
import br.com.photostyle.api.model.entity.FotoEntity;
import br.com.photostyle.api.model.entity.TurmaEntity;
import br.com.photostyle.api.repository.AlunoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AlunoService extends BaseService<AlunoEntity, AlunoDto> {

    private static final int MAX_RODADAS_VERIFICACAO = 3;
    private static final int MAX_TENTATIVAS_POR_ALUNO = 50;
    private static final int TAMANHO_LOTE_VERIFICACAO = 1000;

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
            alunoEntity.setCodigoAcesso(entityAnterior.getCodigoAcesso());
            alunoEntity.setFotos(entityAnterior.getFotos());
            alunoEntity.setFotosOpcionais(entityAnterior.getFotosOpcionais());
        } else {
            gerarCodigosAcesso(Collections.singletonList(alunoEntity));
        }

        AlunoEntity entitySaved = repository.save(alunoEntity);

        if (aluno.getIrmaoRel() != null && !CollectionUtils.isEmpty(aluno.getIrmaoRel().getIrmaos())) {
            List<Long> idsIrmaos = aluno.getIrmaoRel().getIrmaos()
                    .stream()
                    .map(AlunoDto::getId)
                    .collect(Collectors.toList());
            irmaoService.relacionaIrmaos(entitySaved, idsIrmaos);
        }

        return adapter.entityToDto(entitySaved);
    }

    // Roda fora da transação de escrita: era a verificação de unicidade por aluno que mantinha
    // a transação da importação aberta durante todo o processamento da planilha.
    public void gerarCodigosAcesso(List<AlunoEntity> alunos) {
        Set<String> indisponiveis = new HashSet<>();
        List<AlunoEntity> pendentes = alunos;

        for (int rodada = 0; rodada < MAX_RODADAS_VERIFICACAO && !pendentes.isEmpty(); rodada++) {
            Set<String> gerados = new HashSet<>();
            for (AlunoEntity aluno : pendentes) {
                String codigo = gerarCodigoDisponivel(aluno, indisponiveis);
                aluno.setCodigoAcesso(codigo);
                indisponiveis.add(codigo);
                gerados.add(codigo);
            }
            Set<String> existentes = buscarCodigosExistentes(gerados);
            pendentes = pendentes.stream()
                    .filter(aluno -> existentes.contains(aluno.getCodigoAcesso()))
                    .collect(Collectors.toList());
        }

        if (!pendentes.isEmpty()) {
            throw new RuntimeException("Não foi possível gerar código de acesso único para " + pendentes.size() + " aluno(s)");
        }
    }

    private String gerarCodigoDisponivel(AlunoEntity aluno, Set<String> indisponiveis) {
        for (int tentativa = 0; tentativa < MAX_TENTATIVAS_POR_ALUNO; tentativa++) {
            String codigo = geradorCodAcesso.gerarCodigo(aluno.getEscola().getNome(), aluno.getNome());
            if (!indisponiveis.contains(codigo)) {
                return codigo;
            }
        }
        throw new RuntimeException("Não foi possível gerar código de acesso único para o aluno " + aluno.getNome());
    }

    private Set<String> buscarCodigosExistentes(Set<String> codigos) {
        List<String> lote = new ArrayList<>(codigos);
        Set<String> existentes = new HashSet<>();
        for (int i = 0; i < lote.size(); i += TAMANHO_LOTE_VERIFICACAO) {
            int fim = Math.min(i + TAMANHO_LOTE_VERIFICACAO, lote.size());
            existentes.addAll(repository.findCodigosAcessoExistentes(lote.subList(i, fim)));
        }
        return existentes;
    }

    @Transactional
    public void remover(AlunoEntity aluno) {
        if (aluno.getIrmaoRel() != null) {
            irmaoService.removeRelacionamento(aluno.getIrmaoRel(), aluno);
        }
        if (!CollectionUtils.isEmpty(aluno.getFotos())) {
            fotoService.removerEmLote(aluno.getFotos());
        }
        if (!CollectionUtils.isEmpty(aluno.getFotosOpcionais())) {
            fotoService.removerEmLote(aluno.getFotosOpcionais());
        }

        repository.delete(aluno);
    }

    public List<AlunoDto> getAlunosByTurmaId(Long idTurma) {
        List<AlunoComFotoDTO> alunos = repository.getAlunosComFotoDTOByTurmaId(idTurma);
        return adapter.entityListComFotoToDtoList(alunos);
    }

    public List<AlunoDto> getAlunosNomesByTurmaId(Long idTurma) {
        List<AlunoEntity> alunos = repository.getAlunoEntitiesByTurma_Id(idTurma);
        return adapter.entityListToDtoNomesList(alunos);
    }

    @Transactional
    public List<FotoDto> uploadFotos(AlunoEntity aluno, List<MultipartFile> novasFotos) {
        List<FotoEntity> fotos = aluno.getFotos();
        novasFotos.forEach(foto -> {
            FotoEntity uploaded = fotoService.upload(foto);
            fotos.add(uploaded);
        });
        aluno.setFotos(fotos);
        repository.save(aluno);

        return fotoService.entityListToDtoList(fotos);
    }

    @Transactional
    public void removerFoto(AlunoEntity aluno, Long idFoto) {
        List<FotoEntity> fotos = aluno.getFotos();
        if (!CollectionUtils.isEmpty(fotos)) {
            List<FotoEntity> fotosFiltradas = fotos.stream()
                    .filter(foto -> !foto.getId().equals(idFoto))
                    .collect(Collectors.toList());
            aluno.setFotos(fotosFiltradas);
            repository.save(aluno);
            fotoService.remover(idFoto);
        }
    }

    @Transactional
    public List<FotoDto> uploadFotosOpcionais(AlunoEntity aluno, List<MultipartFile> fotos) {
        List<FotoEntity> fotosOpcionais = aluno.getFotosOpcionais();
        fotos.forEach(foto -> {
            FotoEntity uploaded = fotoService.upload(foto);
            fotosOpcionais.add(uploaded);
        });
        aluno.setFotosOpcionais(fotosOpcionais);
        repository.save(aluno);

        return fotoService.entityListToDtoList(fotosOpcionais);
    }

    @Transactional
    public void removerFotoOpcional(AlunoEntity aluno, Long idFoto) {
        List<FotoEntity> fotos = aluno.getFotosOpcionais();
        if (!CollectionUtils.isEmpty(fotos)) {
            List<FotoEntity> fotosFiltradas = fotos.stream()
                    .filter(foto -> !foto.getId().equals(idFoto))
                    .collect(Collectors.toList());
            aluno.setFotosOpcionais(fotosFiltradas);
            repository.save(aluno);
            fotoService.remover(idFoto);
        }
    }

    @Transactional
    public List<AlunoDto> cadastrarAlunosEmTurma(TurmaEntity turma, List<AlunoDto> alunos) {
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

    @Transactional
    public void salvarAlunosDaTurma(TurmaEntity turma, List<AlunoEntity> alunos) {
        alunos.forEach(aluno -> aluno.setTurma(turma));
        repository.saveAll(alunos);
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

    public IrmaoRelDto relacionarIrmaos(AlunoEntity aluno, List<Long> idsIrmaos) {
        return irmaoService.relacionaIrmaos(aluno, idsIrmaos);
    }

    public FotoDto adicionarFotoIrmao(AlunoEntity aluno, MultipartFile foto) {
        return irmaoService.adicionarFotoIrmao(aluno.getIrmaoRel(), foto);
    }

    public void removerFotoIrmao(AlunoEntity aluno, Long idFoto) {
        irmaoService.removerFotoIrmao(aluno.getIrmaoRel(), idFoto);
    }

    public AlunoEntity getAlunoByCodAcesso(String codAcesso) {
        return repository.getByCodigoAcesso(codAcesso);
    }
}
