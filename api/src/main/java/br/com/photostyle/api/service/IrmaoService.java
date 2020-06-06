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
import org.springframework.util.CollectionUtils;

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
        List<AlunoEntity> irmaos = idsIrmaos.stream()
                .map(id -> alunoService.getEntityPorId(id))
                .collect(Collectors.toList());
        irmaos.add(aluno);

        IrmaoRelEntity rel = new IrmaoRelEntity();
        rel.setIrmaos(irmaos);
        rel = repository.save(rel);

        return adapter.entityToDto(rel);
    }

    private IrmaoRelDto mergeRelacionamento(IrmaoRelEntity relExistente, AlunoEntity aluno, List<Long> idsIrmaos) {
        List<AlunoEntity> irmaosNaoRelacionados = relExistente.getIrmaos().stream()
                .filter(irmao -> !idsIrmaos.contains(irmao.getId()))
                .collect(Collectors.toList());
        irmaosNaoRelacionados.add(aluno);

        relExistente.getIrmaos().addAll(irmaosNaoRelacionados);

        relExistente = repository.save(relExistente);

        return adapter.entityToDto(relExistente);
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
