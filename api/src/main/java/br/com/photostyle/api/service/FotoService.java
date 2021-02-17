package br.com.photostyle.api.service;

import br.com.photostyle.api.infra.service.ImageNameManager;
import br.com.photostyle.api.infra.service.ImageService;
import br.com.photostyle.api.model.adapter.FotoAdapter;
import br.com.photostyle.api.model.dto.FotoDto;
import br.com.photostyle.api.model.entity.AnoEntity;
import br.com.photostyle.api.model.entity.FotoEntity;
import br.com.photostyle.api.repository.FotoRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class FotoService {

    @Autowired
    private FotoRepository repository;

    @Autowired
    private FotoAdapter adapter;

    @Autowired
    private AnoService anoService;

    @Autowired
    private ImageService imgService;

    @Autowired
    private ImageNameManager imgNameManager;

    public List<FotoEntity> listar() {
        return repository.findAll();
    }

    public FotoEntity getPorId(@NotNull Long id) {
        Optional<FotoEntity> optional = repository.findById(id);
        return optional.orElse(null);
    }

    @Transactional
    public FotoEntity upload(MultipartFile foto, Long idAno) {
        AnoEntity anoEntity = anoService.getEntityPorId(idAno);
        String orgFileName = Objects.requireNonNull(foto.getOriginalFilename());
        String imgName = buildFotoName(orgFileName);
        imgService.saveImage(foto, imgName);
        try {
            FotoEntity entity = new FotoEntity();
            entity.setFileName(imgName);
            entity.setAno(anoEntity);

            String desc = StringUtils.stripFilenameExtension(orgFileName);
            entity.setDescricao(desc);
            return repository.save(entity);
        } catch(Exception e) {
            if (!StringUtils.isEmpty(imgName)) {
                imgService.deleteImage(imgName);
            }
            throw e;
        }
    }

    @Transactional
    protected void remover(@NotNull Long id) {
        FotoEntity foto = getPorId(id);
        remover(foto);
    }

    @Transactional
    public void remover(FotoEntity foto) {
        imgService.deleteImage(foto.getFileName());
        repository.delete(foto);
    }

    private String buildFotoName(String originalFileName) {
        String imgName;
        boolean isNameUnico = false;
        do {
            imgName = imgNameManager.buildName(originalFileName);
            if (repository.getByFileName(imgName) == null) {
                isNameUnico = true;
            }
        } while(!isNameUnico);
        return imgName;
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
