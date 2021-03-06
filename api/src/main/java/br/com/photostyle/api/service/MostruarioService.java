package br.com.photostyle.api.service;

import br.com.photostyle.api.model.adapter.MostruarioAdapter;
import br.com.photostyle.api.model.dto.FotoDto;
import br.com.photostyle.api.model.dto.MostruarioDto;
import br.com.photostyle.api.model.entity.EscolaEntity;
import br.com.photostyle.api.model.entity.FotoEntity;
import br.com.photostyle.api.model.entity.MostruarioEntity;
import br.com.photostyle.api.repository.MostruarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MostruarioService {

    private final MostruarioRepository repository;
    private final MostruarioAdapter adapter;
    private final FotoService fotoService;

    public MostruarioService(MostruarioRepository repository, MostruarioAdapter adapter, FotoService fotoService) {
        this.repository = repository;
        this.adapter = adapter;
        this.fotoService = fotoService;
    }

    @Transactional
    public void criar(EscolaEntity escola) {
        MostruarioEntity entity = new MostruarioEntity();
        entity.setEscola(escola);
        repository.save(entity);
    }

    public MostruarioEntity getEntityPorId(Long id) {
        return repository.findById(id).orElseThrow(() -> new RuntimeException("Mostruário não encontrado"));
    }


    public MostruarioDto getPorEscola(Long idEscola) {
        MostruarioEntity mostruario = repository.getMostruarioEntityByEscola_Id(idEscola);
        if (mostruario == null) return null;
        return adapter.entityToDto(mostruario);
    }

    @Transactional
    public List<FotoDto> adicionarFotos(Long idMostruario, List<MultipartFile> fotos) {
        MostruarioEntity mostruario = getEntityPorId(idMostruario);
        List<FotoEntity> fotosMostruario = mostruario.getFotos();
        if (fotosMostruario == null) {
            fotosMostruario = new ArrayList<>();
        }

        for (MultipartFile foto : fotos) {
            FotoEntity fotoEntity = fotoService.upload(foto);
            fotosMostruario.add(fotoEntity);
        }

        mostruario.setFotos(fotosMostruario);
        repository.save(mostruario);

        return fotoService.entityListToDtoList(fotosMostruario);
    }

    @Transactional
    public void removerFoto(MostruarioEntity mostruario, Long idFoto) {
        List<FotoEntity> fotos = mostruario.getFotos();
        if (!CollectionUtils.isEmpty(fotos)) {
            List<FotoEntity> fotosFiltradas = fotos.stream()
                    .filter(foto -> !foto.getId().equals(idFoto))
                    .collect(Collectors.toList());
            mostruario.setFotos(fotosFiltradas);
            repository.save(mostruario);
            fotoService.remover(idFoto);
        }
    }

}
