package br.com.photostyle.api.repository;

import br.com.photostyle.api.model.entity.AlunoEntity;
import br.com.photostyle.api.model.entity.IrmaoRelEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AlunoRepository extends BaseRepository<AlunoEntity> {

    List<AlunoEntity> getAlunoEntitiesByTurma_Id(Long idTurma);

}
