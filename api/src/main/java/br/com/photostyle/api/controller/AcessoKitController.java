package br.com.photostyle.api.controller;

import br.com.photostyle.api.model.dto.KitDto;
import br.com.photostyle.api.model.dto.PedidoDto;
import br.com.photostyle.api.model.dto.RetornoPedidoDto;
import br.com.photostyle.api.service.AcessoKitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.xml.ws.Response;

@RestController
@RequestMapping("/api/kit")
public class AcessoKitController {

    @Autowired
    private AcessoKitService service;

    @GetMapping("/{codAcesso}")
    public ResponseEntity<KitDto> getKit(@PathVariable String codAcesso) {
        KitDto kitDto = service.montarKit(codAcesso);
        return kitDto == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(kitDto);
    }

    @PostMapping("/pedido")
    public ResponseEntity<RetornoPedidoDto> fazerPedido(@RequestBody PedidoDto pedido) {
        RetornoPedidoDto retorno = service.realizarPedido(pedido);
        return ResponseEntity.ok(retorno);
    }

}
