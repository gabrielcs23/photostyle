package br.com.photostyle.api.controller;

import br.com.photostyle.api.model.dto.EscolaDto;
import br.com.photostyle.api.model.dto.FotoDto;
import br.com.photostyle.api.model.dto.MostruarioDto;
import br.com.photostyle.api.model.dto.TurmaDto;
import br.com.photostyle.api.model.dto.tabela.TabelaPorEscolaDTO;
import br.com.photostyle.api.model.dto.tabela.TabelaPrecoDto;
import br.com.photostyle.api.model.entity.EscolaEntity;
import br.com.photostyle.api.service.EscolaService;
import br.com.photostyle.api.service.TabelaPrecoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.URI;
import java.util.List;


@RestController
@RequestMapping(EscolaController.RESOURCE_URL)
public class EscolaController {

    protected static final String RESOURCE_URL = "/api/escola";

    @Autowired
    private EscolaService escolaService;

    @Autowired
    private TabelaPrecoService tabelaPrecoService;

    @GetMapping
    public ResponseEntity<List<EscolaDto>> getLista() {
        return ResponseEntity.ok(escolaService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EscolaDto> getPorId(@PathVariable Long id) {
        EscolaDto dto = escolaService.getBasicPorId(id);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{id}/mostruario")
    public ResponseEntity<MostruarioDto> getMostruario(@PathVariable Long id) {
        MostruarioDto mostruario = escolaService.getMostruario(id);
        if (mostruario == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(mostruario);
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

    @PostMapping("/mostruario/{idMostruario}/fotos")
    public ResponseEntity<List<FotoDto>> adicionarFotosMostruario(@PathVariable @NotNull Long idMostruario,
                                                                  @RequestParam("files") List<MultipartFile> files) {
        try {
            List<FotoDto> fotoDtos = escolaService.adicionaFotosMostruario(idMostruario, files);
            return ResponseEntity.ok(fotoDtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/mostruario/{idMostruario}/foto/{idFoto}")
    public ResponseEntity<?> removerFotoMostruario(@PathVariable @NotNull Long idMostruario,
                                                   @PathVariable @NotNull Long idFoto) {
        try {
            escolaService.removerFotoMostruario(idMostruario, idFoto);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
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
    public ResponseEntity<List<TurmaDto>> cadastrarTurmas(@PathVariable Long id,
                                                          @RequestBody @Valid List<TurmaDto> turmas) {
        List<TurmaDto> turmasSalvas = escolaService.cadastrarTurmas(id, turmas);
        if (CollectionUtils.isEmpty(turmasSalvas)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(turmasSalvas);
    }

    @GetMapping("/{id}/exportar-codigos")
    public ResponseEntity<ByteArrayResource> exportarCodigoAlunoPorTurma(@PathVariable Long id) {
        EscolaEntity escola = escolaService.getEntityPorId(id);
        if (escola == null) {
            return ResponseEntity.notFound().build();
        }
        if (CollectionUtils.isEmpty(escola.getTurmas())) {
            return ResponseEntity.badRequest().build();
        }
        try {
            ByteArrayOutputStream stream = escolaService.exportarCodigoAlunoPorTurma(escola);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(new MediaType("application", "force-download"));
            headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=listagem_codigos.xlsx");

            return ResponseEntity
                    .ok()
                    .headers(headers)
                    .body(new ByteArrayResource(stream.toByteArray()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{id}/importar")
    public ResponseEntity<?> importarTurmasEAlunos(@PathVariable Long id, @RequestParam("file") MultipartFile xlsx) {
        EscolaEntity escola = escolaService.getEntityPorId(id);
        if (escola == null) {
            return ResponseEntity.notFound().build();
        }
        if (!CollectionUtils.isEmpty(escola.getTurmas())) {
            return ResponseEntity.badRequest()
                    .body("Não é possível importar novas turmas em uma escola que já tenha alguma turma criada");
        }
        try {
            escolaService.importarTurmasEAlunos(escola, xlsx);
            return ResponseEntity.ok().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("{id}/tabela")
    public ResponseEntity<TabelaPrecoDto> cadastrarTabelaPreco(@PathVariable Long id,
                                                               @RequestBody @Valid TabelaPrecoDto tabela) {
        TabelaPrecoDto dto = tabelaPrecoService.criarComEscola(id, tabela);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    @GetMapping("{id}/tabela")
    public ResponseEntity<TabelaPrecoDto> recuperarTabelaPreco(@PathVariable Long id) {
        TabelaPrecoDto dto = tabelaPrecoService.recuperarPorEscola(id);
        if (dto == null) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.ok(dto);
    }

    @PostMapping("{id}/tabela/{idTabela}")
    public ResponseEntity<TabelaPrecoDto> copiarTabela(@PathVariable Long id, @PathVariable Long idTabela) {
        return ResponseEntity.ok(tabelaPrecoService.copiarTabela(id, idTabela));
    }

    @PostMapping("/tabela")
    public ResponseEntity<TabelaPrecoDto> cadastrarTabelaPreco(@RequestBody @Valid TabelaPrecoDto tabela) {
        TabelaPrecoDto dto = tabelaPrecoService.criarSemEscola(tabela);
        return ResponseEntity.ok(dto);
    }

    @PatchMapping("/tabela/{idTabela}")
    public ResponseEntity<TabelaPrecoDto> atualizarTabelaPreco(@PathVariable Long idTabela,
                                                               @RequestBody @Valid TabelaPrecoDto tabela) {
        TabelaPrecoDto dto = tabelaPrecoService.atualizarTabela(idTabela, tabela);
        if (dto == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/tabela")
    public ResponseEntity<List<TabelaPorEscolaDTO>> listarTabelas() {
        return ResponseEntity.ok(tabelaPrecoService.listarTabelas());
    }

}
