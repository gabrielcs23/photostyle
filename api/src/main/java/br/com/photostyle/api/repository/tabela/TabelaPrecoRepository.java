package br.com.photostyle.api.repository.tabela;

import br.com.photostyle.api.model.entity.tabela.TabelaDePrecoEntity;
import br.com.photostyle.api.repository.BaseRepository;

public interface TabelaPrecoRepository extends BaseRepository<TabelaDePrecoEntity> {

    TabelaDePrecoEntity getByEscolaId(Long idEscola);

}
