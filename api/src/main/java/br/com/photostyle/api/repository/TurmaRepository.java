package br.com.photostyle.api.repository;

import br.com.photostyle.api.model.entity.TurmaEntity;

import java.util.List;

public interface TurmaRepository extends BaseRepository<TurmaEntity> {

    List<TurmaEntity> getTurmaEntitiesByEscola_Id(Long idEscola);

}
