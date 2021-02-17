package br.com.photostyle.api.controller;

import br.com.photostyle.api.model.dto.AnoDto;
import br.com.photostyle.api.service.AnoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping(AnoController.RESOURCE_URL)
public class AnoController {

    protected static final String RESOURCE_URL = "/api/ano";

    @Autowired
    private AnoService service;

    @GetMapping
    public ResponseEntity<List<AnoDto>> getLista() {
        return ResponseEntity.ok(service.listar());
    }

    @PostMapping
    public ResponseEntity<AnoDto> criar(@RequestBody @Valid AnoDto novoAno, UriComponentsBuilder uriBuilder) {
        AnoDto dtoCreated = service.criar(novoAno);

        URI uri = uriBuilder.path(RESOURCE_URL + "/{id}").buildAndExpand(dtoCreated.getId()).toUri();

        return ResponseEntity.created(uri).body(dtoCreated);
    }
}
