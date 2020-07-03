package br.com.photostyle.api.service;

import br.com.photostyle.api.model.adapter.IrmaoAdapter;
import br.com.photostyle.api.model.dto.FotoDto;
import br.com.photostyle.api.model.dto.IrmaoRelDto;
import br.com.photostyle.api.model.entity.AlunoEntity;
import br.com.photostyle.api.model.entity.FotoEntity;
import br.com.photostyle.api.model.entity.IrmaoRelEntity;
import br.com.photostyle.api.repository.IrmaoRelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
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

    @Transactional
    public IrmaoRelDto relacionaIrmaos(AlunoEntity aluno, List<Long> idsIrmaos) {
        IrmaoRelEntity relExistente = repository.getDistinctIrmaoRelByAlunosIds(idsIrmaos);
        if (relExistente != null) {
            return mergeRelacionamento(relExistente, aluno, idsIrmaos);
        }
        return criaRelacionamento(aluno, idsIrmaos);
    }

    private IrmaoRelDto criaRelacionamento(AlunoEntity aluno, List<Long> idsIrmaos) {
        IrmaoRelEntity rel = new IrmaoRelEntity();

        List<AlunoEntity> irmaos = idsIrmaos.stream()
                .map(id -> {
                    AlunoEntity irmao = alunoService.getEntityPorId(id);
                    irmao.setIrmaoRel(rel);
                    return irmao;
                })
                .collect(Collectors.toList());

        aluno.setIrmaoRel(rel);
        irmaos.add(aluno);

        rel.setIrmaos(irmaos);
        IrmaoRelEntity entitySaved = repository.save(rel);

        return adapter.entityToDto(entitySaved);
    }

    private IrmaoRelDto mergeRelacionamento(IrmaoRelEntity relExistente, AlunoEntity aluno, List<Long> idsIrmaos) {
        List<AlunoEntity> irmaosNaoRelacionados = relExistente.getIrmaos().stream()
                .filter(irmao -> !idsIrmaos.contains(irmao.getId()))
                .peek(irmao -> irmao.setIrmaoRel(relExistente))
                .collect(Collectors.toList());

        aluno.setIrmaoRel(relExistente);
        irmaosNaoRelacionados.add(aluno);

        relExistente.getIrmaos().addAll(irmaosNaoRelacionados);

        IrmaoRelEntity entitySaved = repository.save(relExistente);

        return adapter.entityToDto(entitySaved);
    }

    public void removeRelacionamento(IrmaoRelEntity rel, AlunoEntity aluno) {
        List<AlunoEntity> irmaos = rel.getIrmaos();
        if (irmaos.size() > 2) {
            aluno.setIrmaoRel(null);
        } else {
            irmaos.forEach(irmao -> irmao.setIrmaoRel(null));
            rel.setIrmaos(null);

            List<FotoEntity> fotos = rel.getFotos();
            while(fotos.size() > 0) {
                FotoEntity foto = fotos.remove(fotos.size() - 1);
                fotoService.remover(foto);
            }

            repository.delete(rel);
        }
    }

//    @Transactional
//    public List<FotoDto> atualizarFotosIrmaos(IrmaoRelEntity entity, List<FotoDto> fotosNovas) {
//
//        if (!CollectionUtils.isEmpty(entity.getFotos())) {
//            removerFotosIrmaos(entity);
//        }
//
//        List<FotoEntity> fotos = uploadFotosIrmaos(fotosNovas);
//        entity.setFotos(fotos);
//        repository.save(entity);
//
//        return fotoService.entityListToDtoList(fotos);
//    }

    private List<FotoEntity> uploadFotosIrmaos(List<FotoDto> fotos) {
        return fotos.stream().map(foto -> fotoService.upload(foto)).collect(Collectors.toList());
    }

//    @Transactional
//    public void removerFotosIrmaos(IrmaoRelEntity irmaoRel);
    
}
