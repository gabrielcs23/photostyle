package br.com.photostyle.api.controller;

import br.com.photostyle.api.model.dto.EscolaDto;
import br.com.photostyle.api.model.dto.TurmaDto;
import br.com.photostyle.api.model.entity.EscolaEntity;
import br.com.photostyle.api.service.EscolaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import javax.transaction.Transactional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.net.URI;
import java.util.List;


@RestController
@RequestMapping(EscolaController.RESOURCE_URL)
public class EscolaController {

    protected static final String RESOURCE_URL = "/api/escola";

    @Autowired
    private EscolaService escolaService;

    @GetMapping
    public ResponseEntity<List<EscolaDto>> getLista() {
        return ResponseEntity.ok(escolaService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EscolaDto> getPorId(@PathVariable Long id) {
        EscolaDto dto = escolaService.getPorId(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<EscolaDto> criar(@RequestBody @Valid EscolaDto dtoNovo, UriComponentsBuilder uriBuilder) {
        EscolaDto dtoSalvo = escolaService.criar(dtoNovo);

        URI uri = uriBuilder.path(RESOURCE_URL + "/{id}").buildAndExpand(dtoSalvo.getId()).toUri();

        return ResponseEntity.created(uri).body(dtoSalvo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> remover(@PathVariable @NotNull Long id) {
        EscolaDto dto = escolaService.getPorId(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        escolaService.remover(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/turmas")
    public ResponseEntity<List<TurmaDto>> getTurmas(@PathVariable Long id) {
        List<TurmaDto> turmas = escolaService.getTurmas(id);
        if (CollectionUtils.isEmpty(turmas)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(turmas);
    }

    @PostMapping("/{id}/turmas")
    public ResponseEntity<List<TurmaDto>> cadastrarTurmas(@PathVariable Long id, @RequestBody @Valid List<TurmaDto> turmas) {
        List<TurmaDto> turmasSalvas = escolaService.cadastrarTurmas(id, turmas);
        if (CollectionUtils.isEmpty(turmasSalvas)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(turmasSalvas);
    }

}
