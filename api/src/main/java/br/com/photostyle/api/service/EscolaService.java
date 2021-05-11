package br.com.photostyle.api.service;

import br.com.photostyle.api.model.adapter.EscolaAdapter;
import br.com.photostyle.api.model.dto.EscolaDto;
import br.com.photostyle.api.model.dto.TurmaDto;
import br.com.photostyle.api.model.entity.AlunoEntity;
import br.com.photostyle.api.model.entity.EscolaEntity;
import br.com.photostyle.api.model.entity.TurmaEntity;
import br.com.photostyle.api.repository.EscolaRepository;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.transaction.Transactional;
import java.util.List;

@Service
public class EscolaService extends BaseService<EscolaEntity, EscolaDto> {

    @Autowired
    private TurmaService turmaService;

    public EscolaService(EscolaRepository repository, EscolaAdapter adapter) {
        super(repository, adapter);
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

    public Workbook exportarCodigoAlunoPorTurma(EscolaEntity escola) {
        Workbook wb = new XSSFWorkbook();
        for(TurmaEntity turma : escola.getTurmas()) {
            Sheet sheet = wb.createSheet(turma.getNome());
            List<AlunoEntity> alunos = turma.getAlunos();
            for(int i = 0; i < alunos.size(); i++) {
                AlunoEntity aluno = alunos.get(i);
                Row row = sheet.createRow(i);
                row.createCell(0).setCellValue(aluno.getNome());
                row.createCell(1).setCellValue(aluno.getCodigoAcesso());
            }
        }
        return wb;
    }
}
