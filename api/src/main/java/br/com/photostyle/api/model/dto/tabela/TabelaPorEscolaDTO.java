package br.com.photostyle.api.model.dto.tabela;

import org.springframework.util.StringUtils;

public class TabelaPorEscolaDTO {

    private final long tabela;
    private final String escola;

    public TabelaPorEscolaDTO(long tabela, String escola) {
        this.tabela = tabela;
        this.escola = !StringUtils.isEmpty(escola) ? escola : "Padrão";
    }

    public long getTabela() {
        return tabela;
    }

    public String getEscola() {
        return escola;
    }

}
