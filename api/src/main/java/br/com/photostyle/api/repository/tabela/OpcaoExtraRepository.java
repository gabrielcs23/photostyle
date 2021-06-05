package br.com.photostyle.api.repository.tabela;

import br.com.photostyle.api.model.entity.tabela.OpcaoExtraEntity;
import br.com.photostyle.api.repository.BaseRepository;

public interface OpcaoExtraRepository extends BaseRepository<OpcaoExtraEntity> {

    OpcaoExtraEntity getByTabelaId(Long idTabela);

}
