package br.com.photostyle.api.repository.tabela;

import br.com.photostyle.api.model.dto.tabela.TabelaPorEscolaDTO;
import br.com.photostyle.api.model.entity.tabela.OpcaoExtraEntity;
import br.com.photostyle.api.model.entity.tabela.OpcaoKitEntity;
import br.com.photostyle.api.model.entity.tabela.TabelaDePrecoEntity;
import br.com.photostyle.api.repository.BaseRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TabelaPrecoRepository extends BaseRepository<TabelaDePrecoEntity> {

    TabelaDePrecoEntity getByEscolaId(Long idEscola);

    @Query("select new br.com.photostyle.api.model.dto.tabela.TabelaPorEscolaDTO(t.id, e.nome) from TabelaDePrecoEntity t left outer join t.escola e")
    List<TabelaPorEscolaDTO> listarTabelas();

    @Query("select o from OpcaoKitEntity o where o.tabelaId = :idTabela")
    List<OpcaoKitEntity> getOpcoesKit(long idTabela);

    @Query("select o from OpcaoExtraEntity o where o.tabelaId = :idTabela")
    List<OpcaoExtraEntity> getOpcoesExtra(long idTabela);

}
