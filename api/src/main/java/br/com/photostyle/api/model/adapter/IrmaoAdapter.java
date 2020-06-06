package br.com.photostyle.api.model.adapter;

import br.com.photostyle.api.model.dto.AlunoDto;
import br.com.photostyle.api.model.dto.IrmaoRelDto;
import br.com.photostyle.api.model.dto.TurmaDto;
import br.com.photostyle.api.model.entity.IrmaoRelEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class IrmaoAdapter {

    @Autowired
    private FotoAdapter fotoAdapter;

    public IrmaoRelDto entityToDto(IrmaoRelEntity entity) {
        IrmaoRelDto dto = new IrmaoRelDto();
        dto.setId(entity.getId());
        dto.setFotos(fotoAdapter.entityListToDtoList(entity.getFotos()));

        List<AlunoDto> irmaos = entity.getIrmaos().stream()
                .map(irmaoEntity -> {
                    AlunoDto irmaoDto = new AlunoDto();
                    irmaoDto.setId(irmaoEntity.getId());
                    irmaoDto.setNome(irmaoEntity.getNome());
                    irmaoDto.setMatricula(irmaoEntity.getMatricula());

                    TurmaDto turmaIrmao = new TurmaDto();
                    turmaIrmao.setId(irmaoEntity.getTurma().getId());
                    turmaIrmao.setNome(irmaoEntity.getTurma().getNome());

                    irmaoDto.setTurma(turmaIrmao);
                    return irmaoDto;
                }).collect(Collectors.toList());

        dto.setIrmaos(irmaos);

        return dto;
    }

}
