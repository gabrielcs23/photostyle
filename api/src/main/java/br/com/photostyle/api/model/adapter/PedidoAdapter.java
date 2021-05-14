package br.com.photostyle.api.model.adapter;

import br.com.photostyle.api.model.dto.pedido.OpcaoPedidoDto;
import br.com.photostyle.api.model.dto.pedido.PedidoDto;
import br.com.photostyle.api.model.entity.pedido.ItemPedidoEntity;
import br.com.photostyle.api.model.entity.pedido.PedidoEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class PedidoAdapter {

    public PedidoEntity dtoToEntity(PedidoDto dto) {
        BigDecimal valorTotal = BigDecimal.ZERO;

        PedidoEntity entity = new PedidoEntity();
        entity.setNomeAluno(dto.getAluno());
        entity.setNomeTurma(dto.getTurma());
        entity.setNomeEscola(dto.getEscola());
        entity.setNomeResponsavel(dto.getResponsavel());
        entity.setTelContato(dto.getTel());
        entity.setEmail(dto.getEmail());

        OpcaoPedidoDto item = dto.getItem();
        ItemPedidoEntity kit = itemDtoToEntity(item);
        entity.setKit(kit);
        valorTotal = valorTotal.add(kit.getValorInd());

        if (!CollectionUtils.isEmpty(dto.getExtras())) {
            List<ItemPedidoEntity> extras = new ArrayList<>();
            for (OpcaoPedidoDto extraDto : dto.getExtras()) {
                ItemPedidoEntity extraEntity = this.itemDtoToEntity(extraDto);
                extras.add(extraEntity);
                valorTotal = valorTotal.add(extraEntity.getTotalInd());
            }
            entity.setExtras(extras);
        }
        entity.setValorTotal(valorTotal);
        return entity;
    }

    private ItemPedidoEntity itemDtoToEntity(OpcaoPedidoDto item) {
        ItemPedidoEntity itemEntity = new ItemPedidoEntity();
        itemEntity.setNome(item.getNome());
        itemEntity.setOpcao(item.getOpcao());
        itemEntity.setQtd(item.getQtd());

        BigDecimal valorInd = item.getVal();
        itemEntity.setValorInd(valorInd);
        BigDecimal totalInd = valorInd.multiply(new BigDecimal(item.getQtd()));
        itemEntity.setTotalInd(totalInd);
        return itemEntity;
    }

}
