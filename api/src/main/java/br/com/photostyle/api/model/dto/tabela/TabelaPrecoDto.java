package br.com.photostyle.api.model.dto.tabela;

import java.util.List;

public class TabelaPrecoDto {

    private Long id;
    private Long escola;
    private List<OpcaoKitDto> opcoesKit;
    private List<OpcaoExtraDto> opcoesExtra;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getEscola() {
        return escola;
    }

    public void setEscola(Long escola) {
        this.escola = escola;
    }

    public List<OpcaoKitDto> getOpcoesKit() {
        return opcoesKit;
    }

    public void setOpcoesKit(List<OpcaoKitDto> opcoesKit) {
        this.opcoesKit = opcoesKit;
    }

    public List<OpcaoExtraDto> getOpcoesExtra() {
        return opcoesExtra;
    }

    public void setOpcoesExtra(List<OpcaoExtraDto> opcoesExtra) {
        this.opcoesExtra = opcoesExtra;
    }
}
