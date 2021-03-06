package br.com.photostyle.api.repository;

import br.com.photostyle.api.model.entity.MostruarioEntity;

public interface MostruarioRepository extends BaseRepository<MostruarioEntity> {

    MostruarioEntity getMostruarioEntityByEscola_Id(Long idEscola);

}
