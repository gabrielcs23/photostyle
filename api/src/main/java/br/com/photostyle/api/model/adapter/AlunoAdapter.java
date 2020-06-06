package br.com.photostyle.api.model.adapter;

import br.com.photostyle.api.model.dto.*;
import br.com.photostyle.api.model.entity.AlunoEntity;
import br.com.photostyle.api.model.entity.EscolaEntity;
import br.com.photostyle.api.model.entity.IrmaoRelEntity;
import br.com.photostyle.api.model.entity.TurmaEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class AlunoAdapter extends BaseAdapter<AlunoEntity, AlunoDto> {

    @Autowired
    private FotoAdapter fotoAdapter;

    @Override
    public AlunoEntity dtoToEntity(AlunoDto dto) {
        AlunoEntity entity = new AlunoEntity();
        entity.setId(dto.getId());
        entity.setNome(dto.getNome());
        entity.setMatricula(dto.getMatricula());

        return entity;
    }

    @Override
    public AlunoDto entityToDto(AlunoEntity entity) {
        AlunoDto dto = createBasicDto(entity);

        if (entity.getIrmaoRel() != null) {
            IrmaoRelEntity irmaoRelEntity = entity.getIrmaoRel();
            List<AlunoEntity> irmaosEntities = irmaoRelEntity.getIrmaos();

            IrmaoRelDto irmaoRelDto = new IrmaoRelDto();
            List<AlunoDto> irmaosDtos = entityListToDtoList(irmaosEntities);
            irmaoRelDto.setIrmaos(irmaosDtos);

            if (irmaoRelEntity.getFotos() != null) {
                List<FotoDto> fotosIrmaos = fotoAdapter.entityListToDtoList(irmaoRelEntity.getFotos());
                irmaoRelDto.setFotos(fotosIrmaos);
            }

            dto.setIrmaoRel(irmaoRelDto);
        }

        if (entity.getFoto() != null) {
            FotoDto fotoDto = fotoAdapter.entityToDto(entity.getFoto());
            dto.setFoto(fotoDto);
        }

        return dto;
    }

    @Override
    public List<AlunoDto> entityListToDtoList(List<AlunoEntity> entityList) {
        return entityList.stream().map(this::createBasicDto).collect(Collectors.toList());
    }

    private AlunoDto createBasicDto(AlunoEntity entity) {
        AlunoDto dto = new AlunoDto();
        dto.setId(entity.getId());
        dto.setNome(entity.getNome());
        dto.setMatricula(entity.getMatricula());

        EscolaDto escolaDto = new EscolaDto();
        EscolaEntity escolaEntity = entity.getEscola();
        escolaDto.setId(escolaEntity.getId());
        escolaDto.setNome(escolaEntity.getNome());

        TurmaDto turmaDto = new TurmaDto();
        TurmaEntity turmaEntity = entity.getTurma();
        turmaDto.setId(turmaEntity.getId());
        turmaDto.setNome(turmaEntity.getNome());
        turmaDto.setEscola(escolaDto);

        dto.setEscola(escolaDto);
        dto.setTurma(turmaDto);

        return dto;
    }

}
