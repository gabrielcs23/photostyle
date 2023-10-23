package br.com.photostyle.api.service;

import br.com.photostyle.api.model.adapter.EscolaAdapter;
import br.com.photostyle.api.model.dto.EscolaDto;
import br.com.photostyle.api.model.dto.FotoDto;
import br.com.photostyle.api.model.dto.MostruarioDto;
import br.com.photostyle.api.model.dto.TurmaDto;
import br.com.photostyle.api.model.entity.AlunoEntity;
import br.com.photostyle.api.model.entity.EscolaEntity;
import br.com.photostyle.api.model.entity.MostruarioEntity;
import br.com.photostyle.api.model.entity.TurmaEntity;
import br.com.photostyle.api.repository.EscolaRepository;
import br.com.photostyle.api.utils.ImportacaoXlsxHelper;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EscolaService extends BaseService<EscolaEntity, EscolaDto> {

    @Autowired
    private TurmaService turmaService;

    @Autowired
    private AlunoService alunoService;

    @Autowired
    private MostruarioService mostruarioService;

    public EscolaService(EscolaRepository repository, EscolaAdapter adapter) {
        super(repository, adapter);
    }


    public EscolaDto getBasicPorId(Long id) {
        EscolaEntity entity = getEntityPorId(id);
        return ((EscolaAdapter) adapter).createBasicDto(entity);
    }

    @Override
    @Transactional
    public EscolaDto criar(EscolaDto dtoNovo) {
        EscolaEntity nova = adapter.dtoToEntity(dtoNovo);
        EscolaEntity salva = repository.save(nova);

        mostruarioService.criar(salva);

        return adapter.entityToDto(salva);
    }

    @Transactional
    public void remover(EscolaEntity escola) {
        mostruarioService.removerPorEscola(escola.getId());
        List<TurmaEntity> turmas = escola.getTurmas();
        if (CollectionUtils.isNotEmpty(turmas)) {
            turmas.forEach(turmaService::remover);
        }
        repository.delete(escola);
    }

    public MostruarioDto getMostruario(Long id) {
        return mostruarioService.getPorEscola(id);
    }

    public List<FotoDto> adicionaFotosMostruario(Long idMostruario, List<MultipartFile> fotos) {
        return mostruarioService.adicionarFotos(idMostruario, fotos);
    }

    public void removerFotoMostruario(Long idMostruario, Long idFoto) {
        MostruarioEntity mostruario = mostruarioService.getEntityPorId(idMostruario);
        mostruarioService.removerFoto(mostruario, idFoto);
    }

    @Transactional
    public List<TurmaDto> cadastrarTurmas(Long id, List<TurmaDto> turmas) {
        EscolaEntity escola = getEntityPorId(id);
        return turmaService.cadastrarTurmasEmEscola(escola, turmas);
    }

    public List<TurmaDto> getTurmas(Long id) {
        EscolaEntity escola = getEntityPorId(id);
        return turmaService.entityListToDtoList(escola.getTurmas());
    }

    public ByteArrayOutputStream exportarCodigoAlunoPorTurma(EscolaEntity escola) throws IOException {
        Workbook wb = new XSSFWorkbook();
        for (TurmaEntity turma : escola.getTurmas()) {
            Sheet sheet = wb.createSheet(turma.getNome());
            List<AlunoEntity> alunos = turma.getAlunos();
            for (int i = 0; i < alunos.size(); i++) {
                AlunoEntity aluno = alunos.get(i);
                Row row = sheet.createRow(i);
                row.createCell(0).setCellValue(aluno.getNome());
                row.createCell(1).setCellValue(aluno.getCodigoAcesso());
            }
        }
        ByteArrayOutputStream stream = new ByteArrayOutputStream();
        wb.write(stream);
        wb.close();
        return stream;
    }

    @Transactional
    public void importarTurmasEAlunos(EscolaEntity escola, MultipartFile xlsx) throws IOException {
        try (XSSFWorkbook wb = new XSSFWorkbook(xlsx.getInputStream())) {
            Map<String, TurmaEntity> turmasPorNomeDeSheet = new HashMap<>();

            for (Sheet sheet : wb) {
                String nomeSheet = sheet.getSheetName();
                TurmaEntity turma = turmaService.cadastrarTurmaEmEscola(escola, nomeSheet.trim());
                turmasPorNomeDeSheet.put(nomeSheet, turma);
            }

            for (String nomeSheet : turmasPorNomeDeSheet.keySet()) {
                TurmaEntity turma = turmasPorNomeDeSheet.get(nomeSheet);
                Sheet sheet = wb.getSheet(nomeSheet);
                for (Row row : sheet) {
                    Cell cell = row.getCell(0);
                    String nomeAluno = ImportacaoXlsxHelper.getStringCellValue(cell);
                    if (nomeAluno == null || nomeAluno.isEmpty()) break;
                    cell = row.getCell(1);
                    String matrAluno = ImportacaoXlsxHelper.getStringCellValue(cell);
                    alunoService.criarNovoAluno(escola, turma, nomeAluno, matrAluno);
                }
            }
        }
    }

}
