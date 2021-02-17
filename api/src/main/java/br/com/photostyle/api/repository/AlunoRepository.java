package br.com.photostyle.api.repository;

import br.com.photostyle.api.model.entity.AlunoEntity;

import java.util.List;

public interface AlunoRepository extends BaseRepository<AlunoEntity> {

    List<AlunoEntity> getAlunoEntitiesByTurma_Id(Long idTurma);

    AlunoEntity getByCodigoAcesso(String codigo);

}
