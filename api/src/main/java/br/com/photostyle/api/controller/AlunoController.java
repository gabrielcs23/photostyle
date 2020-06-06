package br.com.photostyle.api.controller;

import br.com.photostyle.api.model.dto.AlunoDto;
import br.com.photostyle.api.model.dto.FotoDto;
import br.com.photostyle.api.model.dto.IrmaoRelDto;
import br.com.photostyle.api.model.entity.AlunoEntity;
import br.com.photostyle.api.service.AlunoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping(AlunoController.RESOURCE_URL)
public class AlunoController {

    protected static final String RESOURCE_URL = "/api/aluno";

    @Autowired
    private AlunoService alunoService;

    @GetMapping
    public ResponseEntity<List<AlunoDto>> getLista() {
        return ResponseEntity.ok(alunoService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlunoDto> getPorId(@PathVariable @NotNull Long id) {
        AlunoDto dto = alunoService.getPorId(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    public ResponseEntity<AlunoDto> criar(@RequestBody @Valid AlunoDto entityNew, UriComponentsBuilder uriBuilder) {
        AlunoDto entityCreated = alunoService.criar(entityNew);

        URI uri = uriBuilder.path(RESOURCE_URL + "/{id}").buildAndExpand(entityCreated.getId()).toUri();

        return ResponseEntity.created(uri).body(entityCreated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> remover(@PathVariable @NotNull Long id) {
        AlunoEntity entity = alunoService.getEntityPorId(id);
        if (entity == null) {
            return ResponseEntity.notFound().build();
        }
        alunoService.remover(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/foto")
    public ResponseEntity<FotoDto> uploadFoto(@PathVariable @NotNull Long id, @RequestBody @Valid FotoDto foto) {
        AlunoEntity entity = alunoService.getEntityPorId(id);
        if (entity == null) {
            return ResponseEntity.notFound().build();
        }
        FotoDto fotoSalva = alunoService.uploadFoto(entity, foto);
        return ResponseEntity.ok(fotoSalva);
    }

    @DeleteMapping("/{id}/foto")
    public ResponseEntity<?> removerFoto(@PathVariable @NotNull Long id) {
        AlunoEntity entity = alunoService.getEntityPorId(id);
        if (entity == null || entity.getFoto() == null) {
            return ResponseEntity.notFound().build();
        }
        alunoService.removeFoto(entity);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{idAluno}/mover/{idTurma}")
    public ResponseEntity<AlunoDto> moverAlunoParaTurma(@PathVariable @NotNull Long idAluno, @PathVariable @NotNull Long idTurma) {
        AlunoDto aluno = alunoService.moverAlunoParaTurma(idAluno, idTurma);
        if (aluno == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(aluno);
    }

    @PostMapping("/{idAluno}/irmaos")
    public ResponseEntity<IrmaoRelDto> relacionarIrmaos(@PathVariable @NotNull Long idAluno, @RequestBody @NotEmpty List<Long> idsIrmaos) {
        AlunoEntity aluno = alunoService.getEntityPorId(idAluno);
        if (aluno == null) {
            return ResponseEntity.notFound().build();
        }
        IrmaoRelDto relacionamento = alunoService.relacionarIrmaos(aluno, idsIrmaos);
        return ResponseEntity.ok(relacionamento);
    }

//    @PostMapping("/{idAluno}/fotos-irmaos")
//    public ResponseEntity<List<FotoDto>> atualizarFotosIrmaos(@PathVariable @NotNull Long idAluno, @RequestBody @Valid List<FotoDto> fotos) {
//        IrmaoRelEntity irmaoRel = alunoService.getIrmaoRelEntity(idAluno);
//        if (irmaoRel == null) {
//            return ResponseEntity.notFound().build();
//        }
//        List<FotoDto> fotosSalvas = alunoService.atualizarFotosIrmaos(irmaoRel, fotos);
//        return ResponseEntity.ok(fotosSalvas);
//    }
//
//    @DeleteMapping("/{idAluno}/fotos-irmaos/{idFoto}")
//    public ResponseEntity<?> removerFotosIrmaos(@PathVariable @NotNull Long idAluno, @PathVariable @NotNull Long idFoto) {
//        IrmaoRelEntity irmaoRel = alunoService.getIrmaoRelEntity(idAluno);
//        if (irmaoRel == null) {
//            return ResponseEntity.notFound().build();
//        }
//        alunoService.removerFotosIrmaosEPersistir(irmaoRel);
//        return ResponseEntity.ok().build();
//    }

}
