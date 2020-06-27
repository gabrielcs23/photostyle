package br.com.photostyle.api.service;

import br.com.photostyle.api.infra.service.ImageService;
import br.com.photostyle.api.model.adapter.FotoAdapter;
import br.com.photostyle.api.model.dto.FotoDto;
import br.com.photostyle.api.model.entity.FotoEntity;
import br.com.photostyle.api.repository.FotoRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Optional;

@Service
public class FotoService {

    @Autowired
    private FotoRepository repository;

    @Autowired
    private FotoAdapter adapter;

    @Autowired
    private ImageService imgService;

    public List<FotoEntity> listar() {
        return repository.findAll();
    }

    public FotoEntity getPorId(@NotNull Long id) {
        Optional<FotoEntity> optional = repository.findById(id);
        return optional.orElse(null);
    }

    @Transactional
    @Deprecated
    public FotoEntity upload(FotoDto dto) {
        MultipartFile foto = dto.getFoto();
        return upload(foto);
    }

    @Transactional
    public FotoEntity upload(MultipartFile foto) {
        String path = imgService.saveImage(foto);
        try {
            FotoEntity entity = new FotoEntity();
            entity.setPath(path);
            return repository.save(entity);
        } catch(Exception e) {
            imgService.deleteImage(path);
            throw e;
        }
    }

    @Transactional
    public void remover(@NotNull Long id) {
        FotoEntity foto = getPorId(id);
        remover(foto);
    }

    @Transactional
    public void remover(FotoEntity foto) {
        imgService.deleteImage(foto.getPath());
        repository.delete(foto);
    }

    public FotoEntity copiaFoto(FotoEntity original) {
        FotoEntity copia = new FotoEntity();
        BeanUtils.copyProperties(original, copia);
        return copia;
    }

    public FotoDto entityToDto(FotoEntity entity) {
        return adapter.entityToDto(entity);
    }

    public FotoEntity dtoToEntity(FotoDto dto) {
        return adapter.dtoToEntity(dto);
    }

    public List<FotoDto> entityListToDtoList(List<FotoEntity> entityList) {
        return adapter.entityListToDtoList(entityList);
    }

}
