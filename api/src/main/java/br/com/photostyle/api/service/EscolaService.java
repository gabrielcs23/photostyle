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
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    public void importarTurmasEAlunos(EscolaEntity escola, MultipartFile xlsx) throws IOException {
        Map<String, List<AlunoEntity>> alunosPorNomeDeSheet = lerPlanilha(escola, xlsx);

        List<AlunoEntity> alunos = alunosPorNomeDeSheet.values().stream()
                .flatMap(List::stream)
                .collect(Collectors.toList());
        alunoService.gerarCodigosAcesso(alunos);

        turmaService.cadastrarTurmasComAlunos(escola, alunosPorNomeDeSheet);
    }

    private Map<String, List<AlunoEntity>> lerPlanilha(EscolaEntity escola, MultipartFile xlsx) throws IOException {
        Map<String, List<AlunoEntity>> alunosPorNomeDeSheet = new LinkedHashMap<>();
        try (XSSFWorkbook wb = new XSSFWorkbook(xlsx.getInputStream())) {
            for (Sheet sheet : wb) {
                List<AlunoEntity> alunos = new ArrayList<>();
                for (Row row : sheet) {
                    String nomeAluno = ImportacaoXlsxHelper.getStringCellValue(row.getCell(0));
                    if (nomeAluno == null || nomeAluno.isEmpty()) break;

                    AlunoEntity aluno = new AlunoEntity();
                    aluno.setEscola(escola);
                    aluno.setNome(nomeAluno);
                    aluno.setMatricula(ImportacaoXlsxHelper.getStringCellValue(row.getCell(1)));
                    alunos.add(aluno);
                }
                alunosPorNomeDeSheet.put(sheet.getSheetName(), alunos);
            }
        }
        return alunosPorNomeDeSheet;
    }

}
