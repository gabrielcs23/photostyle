package br.com.photostyle.api.model.dto.pedido;

public class RetornoPedidoDto {

    private String nPedido;

    public RetornoPedidoDto() {

    }

    public RetornoPedidoDto(String nPedido) {
        this.nPedido = nPedido;
    }

    public String getnPedido() {
        return nPedido;
    }

    public void setnPedido(String nPedido) {
        this.nPedido = nPedido;
    }
}
