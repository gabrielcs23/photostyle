package br.com.photostyle.api.controller;

import br.com.photostyle.api.model.dto.AlunoDto;
import br.com.photostyle.api.model.dto.FotoDto;
import br.com.photostyle.api.model.dto.TurmaDto;
import br.com.photostyle.api.model.entity.TurmaEntity;
import br.com.photostyle.api.service.TurmaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping(TurmaController.RESOURCE_URL)
public class TurmaController {

    protected static final String RESOURCE_URL = "/api/turma";

    @Autowired
    private TurmaService turmaService;

    @GetMapping
    public ResponseEntity<List<TurmaDto>> getLista() {
        return ResponseEntity.ok(turmaService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TurmaDto> getPorId(@PathVariable Long id) {
        TurmaDto dto = turmaService.getPorId(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/por-escola/{idEscola}")
    public ResponseEntity<List<TurmaDto>> getTurmasPorEscolaId(@PathVariable Long idEscola) {
        List<TurmaDto> turmas = turmaService.getTurmasPorEscolaId(idEscola);
        return ResponseEntity.ok(turmas);
    }

    @GetMapping("/nomes/por-escola/{idEscola}")
    public ResponseEntity<List<TurmaDto>> getTurmasNomesPorEscolaId(@PathVariable Long idEscola) {
        List<TurmaDto> turmas = turmaService.getTurmasNomesPorEscolaId(idEscola);
        return ResponseEntity.ok(turmas);
    }

    @PostMapping
    public ResponseEntity<TurmaDto> criar(@RequestBody @Valid TurmaDto novaTurma, UriComponentsBuilder uriBuilder) {
        TurmaDto dtoCreated = turmaService.cadastrarTurma(novaTurma);

        URI uri = uriBuilder.path(RESOURCE_URL + "/{id}").buildAndExpand(dtoCreated.getId()).toUri();

        return ResponseEntity.created(uri).body(dtoCreated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> remover(@PathVariable @NotNull Long id) {
        TurmaEntity entity = turmaService.getEntityPorId(id);
        if (entity == null) {
            return ResponseEntity.notFound().build();
        }
        turmaService.remover(entity);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{idTurma}/foto")
    public ResponseEntity<FotoDto> adicionarFoto(@PathVariable @NotNull Long idTurma, @RequestParam("file") MultipartFile foto) {
        TurmaEntity turma = turmaService.getEntityPorId(idTurma);
        if (turma == null) {
            return ResponseEntity.notFound().build();
        }
        FotoDto dto = turmaService.adicionarFoto(turma, foto);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{idTurma}/foto/{idFoto}")
    public ResponseEntity<?> removerFoto(@PathVariable @NotNull Long idTurma, @PathVariable @NotNull Long idFoto) {
        TurmaEntity turma = turmaService.getEntityPorId(idTurma);
        if (turma == null) {
            return ResponseEntity.notFound().build();
        }
        turmaService.removerFoto(turma, idFoto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/alunos")
    public ResponseEntity<List<AlunoDto>> getAlunos(@PathVariable Long id) {
        List<AlunoDto> alunos = turmaService.getAlunos(id);
        if (CollectionUtils.isEmpty(alunos)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(alunos);
    }

    @PostMapping("/{id}/alunos")
    public ResponseEntity<List<AlunoDto>> cadastrarAlunos(@PathVariable Long id, @RequestBody @Valid List<AlunoDto> alunos) {
        List<AlunoDto> alunosSalvos = turmaService.cadastrarAlunos(id, alunos);
        if (CollectionUtils.isEmpty(alunosSalvos)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(alunosSalvos);
    }

}
