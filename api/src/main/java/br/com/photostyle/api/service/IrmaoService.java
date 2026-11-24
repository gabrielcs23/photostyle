package br.com.photostyle.api.service;

import br.com.photostyle.api.model.adapter.IrmaoAdapter;
import br.com.photostyle.api.model.dto.FotoDto;
import br.com.photostyle.api.model.dto.IrmaoRelDto;
import br.com.photostyle.api.model.entity.AlunoEntity;
import br.com.photostyle.api.model.entity.FotoEntity;
import br.com.photostyle.api.model.entity.IrmaoRelEntity;
import br.com.photostyle.api.repository.IrmaoRelRepository;
import br.com.photostyle.api.service.exception.RegraNegocioException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class IrmaoService {

    @Autowired
    private IrmaoRelRepository repository;

    @Autowired
    private IrmaoAdapter adapter;

    @Autowired
    private AlunoService alunoService;

    @Autowired
    private FotoService fotoService;

    // Um aluno entra num grupo apenas quando está sem grupo ou já é membro desse mesmo grupo.
    // Mover um aluno de outro grupo esvaziaria aquele grupo implicitamente; o desvínculo passa por removerIrmao.
    @Transactional
    public IrmaoRelDto relacionaIrmaos(AlunoEntity aluno, List<Long> idsIrmaos) {
        List<AlunoEntity> alunos = new ArrayList<>();
        alunos.add(aluno);
        idsIrmaos.stream()
                .filter(Objects::nonNull)
                .distinct()
                .filter(id -> !id.equals(aluno.getId()))
                .map(this::buscarAluno)
                .peek(irmao -> validarMesmaEscola(aluno, irmao))
                .forEach(alunos::add);
        if (alunos.size() < 2) {
            throw new RegraNegocioException("Informe ao menos um irmão diferente do próprio aluno");
        }

        IrmaoRelEntity rel = getGrupoUnico(alunos);
        if (rel == null) {
            return criaRelacionamento(alunos);
        }
        vincular(rel, alunos);
        return adapter.entityToDto(repository.save(rel));
    }

    private IrmaoRelDto criaRelacionamento(List<AlunoEntity> alunos) {
        IrmaoRelEntity rel = new IrmaoRelEntity();
        rel.setIrmaos(new ArrayList<>());
        rel.setFotos(new ArrayList<>());
        vincular(rel, alunos);

        IrmaoRelEntity entitySaved = repository.save(rel);

        return adapter.entityToDto(entitySaved);
    }

    private IrmaoRelEntity getGrupoUnico(List<AlunoEntity> alunos) {
        IrmaoRelEntity grupo = alunos.stream()
                .map(AlunoEntity::getIrmaoRel)
                .filter(Objects::nonNull)
                .findFirst()
                .orElse(null);
        if (grupo != null) {
            alunos.stream()
                    .filter(a -> a.getIrmaoRel() != null && !a.getIrmaoRel().getId().equals(grupo.getId()))
                    .findFirst()
                    .ifPresent(a -> {
                        throw new RegraNegocioException(a.getNome() + " já pertence a outro grupo de irmãos; " +
                                "remova-o daquele grupo antes de vinculá-lo aqui");
                    });
        }
        return grupo;
    }

    private void vincular(IrmaoRelEntity rel, List<AlunoEntity> alunos) {
        alunos.stream()
                .filter(a -> a.getIrmaoRel() == null)
                .forEach(a -> {
                    a.setIrmaoRel(rel);
                    rel.getIrmaos().add(a);
                });
    }

    @Transactional
    public IrmaoRelDto removerIrmao(AlunoEntity aluno, Long idIrmao) {
        IrmaoRelEntity rel = aluno.getIrmaoRel();
        AlunoEntity irmao = buscarMembro(rel, idIrmao);
        removeRelacionamento(rel, irmao);

        // grupo com 1 aluno é desfeito por removeRelacionamento
        return rel.getIrmaos() == null ? null : adapter.entityToDto(rel);
    }

    // Vincula o novo irmão antes de desvincular o atual: o grupo mantém ao menos 2 alunos durante a troca
    // e as fotos de irmãos são preservadas.
    @Transactional
    public IrmaoRelDto substituirIrmao(AlunoEntity aluno, Long idIrmaoAtual, Long idIrmaoNovo) {
        IrmaoRelEntity rel = aluno.getIrmaoRel();
        AlunoEntity irmaoAtual = buscarMembro(rel, idIrmaoAtual);
        AlunoEntity irmaoNovo = buscarAluno(idIrmaoNovo);
        validarMesmaEscola(aluno, irmaoNovo);

        if (irmaoNovo.getIrmaoRel() != null) {
            if (irmaoNovo.getIrmaoRel().getId().equals(rel.getId())) {
                throw new RegraNegocioException(irmaoNovo.getNome() + " já faz parte deste grupo de irmãos; " +
                        "selecione um aluno que ainda esteja sem grupo");
            }
            throw new RegraNegocioException(irmaoNovo.getNome() + " já pertence a outro grupo de irmãos; " +
                    "remova-o daquele grupo antes de vinculá-lo aqui");
        }

        vincular(rel, Collections.singletonList(irmaoNovo));
        removeRelacionamento(rel, irmaoAtual);

        return adapter.entityToDto(repository.save(rel));
    }

    private AlunoEntity buscarMembro(IrmaoRelEntity rel, Long idIrmao) {
        return rel.getIrmaos().stream()
                .filter(irmao -> irmao.getId().equals(idIrmao))
                .findFirst()
                .orElseThrow(() -> new RegraNegocioException(
                        "Informe um aluno que faça parte do grupo de irmãos deste aluno"));
    }

    private AlunoEntity buscarAluno(Long id) {
        AlunoEntity aluno = alunoService.getEntityPorId(id);
        if (aluno == null) {
            throw new RegraNegocioException("Informe um aluno cadastrado para vincular como irmão");
        }
        return aluno;
    }

    private void validarMesmaEscola(AlunoEntity aluno, AlunoEntity irmao) {
        if (!aluno.getEscola().getId().equals(irmao.getEscola().getId())) {
            throw new RegraNegocioException("Irmãos vinculados precisam estar na mesma escola; " +
                    irmao.getNome() + " está em outra escola");
        }
    }

    public void removeRelacionamento(IrmaoRelEntity rel, AlunoEntity aluno) {
        List<AlunoEntity> irmaos = rel.getIrmaos();
        if (irmaos.size() > 2) {
            aluno.setIrmaoRel(null);
            irmaos.remove(aluno);
        } else {
            irmaos.forEach(irmao -> irmao.setIrmaoRel(null));
            rel.setIrmaos(null);

            List<FotoEntity> fotos = rel.getFotos();
            if (!CollectionUtils.isEmpty(fotos)) {
                fotoService.removerEmLote(fotos);
            }
            repository.delete(rel);
        }
    }

    @Transactional
    public FotoDto adicionarFotoIrmao(IrmaoRelEntity irmaoRel, MultipartFile foto) {
        FotoEntity fotoEntity = fotoService.upload(foto);
        irmaoRel.getFotos().add(fotoEntity);
        repository.save(irmaoRel);

        return fotoService.entityToDto(fotoEntity);
    }

    @Transactional
    public void removerFotoIrmao(IrmaoRelEntity irmaoRel, Long idFoto) {
        List<FotoEntity> fotos = irmaoRel.getFotos();
        if (!CollectionUtils.isEmpty(fotos)) {
            List<FotoEntity> fotosFiltradas = fotos.stream()
                    .filter(foto -> !foto.getId().equals(idFoto))
                    .collect(Collectors.toList());
            irmaoRel.setFotos(fotosFiltradas);
            repository.save(irmaoRel);
            fotoService.remover(idFoto);
        }
    }
}
