package br.com.photostyle.api.repository;

import br.com.photostyle.api.model.dto.AlunoComFotoDTO;
import br.com.photostyle.api.model.entity.AlunoEntity;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;

public interface AlunoRepository extends BaseRepository<AlunoEntity> {

    List<AlunoEntity> getAlunoEntitiesByTurma_Id(Long idTurma);

    @Query("SELECT new br.com.photostyle.api.model.dto.AlunoComFotoDTO(a, f) FROM AlunoEntity a LEFT JOIN a.fotos f WITH f.id = (SELECT MIN(f2.id) FROM a.fotos f2) WHERE a.turma.id = :idTurma")
    List<AlunoComFotoDTO> getAlunosComFotoDTOByTurmaId(Long idTurma);

    AlunoEntity getByCodigoAcesso(String codigo);

    @Query("SELECT a.codigoAcesso FROM AlunoEntity a WHERE a.codigoAcesso IN :codigos")
    List<String> findCodigosAcessoExistentes(Collection<String> codigos);

}
