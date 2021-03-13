package br.com.photostyle.api.controller;

import br.com.photostyle.api.model.dto.AlunoDto;
import br.com.photostyle.api.model.dto.FotoDto;
import br.com.photostyle.api.model.dto.IrmaoRelDto;
import br.com.photostyle.api.model.entity.AlunoEntity;
import br.com.photostyle.api.service.AlunoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
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

    @GetMapping("/por-turma/{idTurma}")
    public ResponseEntity<List<AlunoDto>> getAlunosPorTurmaId(@PathVariable Long idTurma) {
        List<AlunoDto> alunos = alunoService.getAlunosByTurmaId(idTurma);
        return ResponseEntity.ok(alunos);
    }

    @GetMapping("/nomes/por-turma/{idTurma}")
    public ResponseEntity<List<AlunoDto>> getAlunosNomesPorTurmaId(@PathVariable Long idTurma) {
        List<AlunoDto> alunos = alunoService.getAlunosNomesByTurmaId(idTurma);
        return ResponseEntity.ok(alunos);
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
        alunoService.remover(entity);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/foto")
    public ResponseEntity<FotoDto> uploadFoto(@PathVariable @NotNull Long id, @RequestParam("file") MultipartFile foto) {
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

    @PostMapping("/{id}/opcionais")
    public ResponseEntity<List<FotoDto>> uploadFotosOpcionais(@PathVariable @NotNull Long id,
                                                              @RequestParam("files") List<MultipartFile> files) {
        AlunoEntity entity = alunoService.getEntityPorId(id);
        if (entity == null) {
            return ResponseEntity.notFound().build();
        }
        List<FotoDto> fotoDtos = alunoService.uploadFotosOpcionais(entity, files);
        return ResponseEntity.ok(fotoDtos);
    }

    @DeleteMapping("/{id}/opcionais/{idFoto}")
    public ResponseEntity<?> removerFotoOpcional(@PathVariable @NotNull Long id, @PathVariable @NotNull Long idFoto) {
        AlunoEntity entity = alunoService.getEntityPorId(id);
        if (entity == null) {
            return ResponseEntity.notFound().build();
        }
        alunoService.removerFotoOpcional(entity, idFoto);
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

    @PostMapping("/{idAluno}/foto-irmao")
    public ResponseEntity<FotoDto> adicionarFotoIrmao(@PathVariable @NotNull Long idAluno, @RequestParam("file") MultipartFile foto) {
        AlunoEntity aluno = alunoService.getEntityPorId(idAluno);
        if (aluno == null || aluno.getIrmaoRel() == null) {
            return ResponseEntity.notFound().build();
        }
        FotoDto fotoDto = alunoService.adicionarFotoIrmao(aluno, foto);
        return ResponseEntity.ok(fotoDto);
    }

    @DeleteMapping("/{idAluno}/foto-irmao/{idFoto}")
    public ResponseEntity<FotoDto> removerFotoIrmao(@PathVariable @NotNull Long idAluno, @PathVariable @NotNull Long idFoto) {
        AlunoEntity aluno = alunoService.getEntityPorId(idAluno);
        if (aluno == null || aluno.getIrmaoRel() == null) {
            return ResponseEntity.notFound().build();
        }
        alunoService.removerFotoIrmao(aluno, idFoto);
        return ResponseEntity.ok().build();
    }

}
