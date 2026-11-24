package br.com.photostyle.api.service;

import br.com.photostyle.api.model.adapter.AlunoAdapter;
import br.com.photostyle.api.model.dto.AlunoDto;
import br.com.photostyle.api.model.entity.AlunoEntity;
import br.com.photostyle.api.model.entity.FotoEntity;
import br.com.photostyle.api.model.entity.IrmaoRelEntity;
import br.com.photostyle.api.repository.AlunoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AlunoServiceTest {

    @Mock
    private AlunoRepository repository;

    @Mock
    private AlunoAdapter adapter;

    private AlunoService service;

    @BeforeEach
    void setUp() {
        service = new AlunoService(repository, adapter);
        // AlunoService também recebe repository/adapter por campo (além do construtor de BaseService)
        ReflectionTestUtils.setField(service, "repository", repository);
        ReflectionTestUtils.setField(service, "adapter", adapter);
    }

    @Test
    void atualizarAlteraNomeEMatriculaEPreservaVinculosEFotos() {
        IrmaoRelEntity rel = new IrmaoRelEntity();
        List<FotoEntity> fotos = new ArrayList<>(Collections.singletonList(new FotoEntity()));
        AlunoEntity aluno = new AlunoEntity();
        aluno.setId(1L);
        aluno.setNome("Nome antigo");
        aluno.setMatricula("M-1");
        aluno.setCodigoAcesso("COD-TESTE");
        aluno.setIrmaoRel(rel);
        aluno.setFotos(fotos);

        when(repository.findById(1L)).thenReturn(Optional.of(aluno));
        when(repository.save(any(AlunoEntity.class))).thenAnswer(inv -> inv.getArgument(0));
        when(adapter.entityToDto(any(AlunoEntity.class))).thenReturn(new AlunoDto());

        AlunoDto dto = new AlunoDto();
        dto.setNome("Nome novo");
        dto.setMatricula("M-2");

        assertNotNull(service.atualizar(1L, dto));
        assertEquals("Nome novo", aluno.getNome());
        assertEquals("M-2", aluno.getMatricula());
        assertEquals("COD-TESTE", aluno.getCodigoAcesso());
        assertSame(rel, aluno.getIrmaoRel());
        assertSame(fotos, aluno.getFotos());
    }

    @Test
    void atualizarAlunoInexistenteRetornaNulo() {
        when(repository.findById(9L)).thenReturn(Optional.empty());

        assertNull(service.atualizar(9L, new AlunoDto()));
    }
}
