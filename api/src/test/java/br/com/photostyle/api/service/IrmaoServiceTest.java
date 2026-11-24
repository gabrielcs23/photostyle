package br.com.photostyle.api.service;

import br.com.photostyle.api.model.adapter.IrmaoAdapter;
import br.com.photostyle.api.model.dto.IrmaoRelDto;
import br.com.photostyle.api.model.entity.AlunoEntity;
import br.com.photostyle.api.model.entity.EscolaEntity;
import br.com.photostyle.api.model.entity.FotoEntity;
import br.com.photostyle.api.model.entity.IrmaoRelEntity;
import br.com.photostyle.api.repository.IrmaoRelRepository;
import br.com.photostyle.api.service.exception.RegraNegocioException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class IrmaoServiceTest {

    @Mock
    private IrmaoRelRepository repository;

    @Mock
    private IrmaoAdapter adapter;

    @Mock
    private AlunoService alunoService;

    @Mock
    private FotoService fotoService;

    @InjectMocks
    private IrmaoService service;

    private final Map<Long, AlunoEntity> alunos = new HashMap<>();
    private EscolaEntity escola;
    private long proximoIdGrupo = 100;

    @BeforeEach
    void setUp() {
        escola = escola(1L);
        when(alunoService.getEntityPorId(anyLong())).thenAnswer(inv -> alunos.get(inv.<Long>getArgument(0)));
        when(repository.save(any(IrmaoRelEntity.class))).thenAnswer(inv -> {
            IrmaoRelEntity rel = inv.getArgument(0);
            if (rel.getId() == null) {
                rel.setId(proximoIdGrupo++);
            }
            return rel;
        });
        when(adapter.entityToDto(any(IrmaoRelEntity.class))).thenAnswer(inv -> {
            IrmaoRelDto dto = new IrmaoRelDto();
            dto.setId(inv.<IrmaoRelEntity>getArgument(0).getId());
            return dto;
        });
    }

    @Test
    void removerEmGrupoDeTresMantemOsOutrosDois() {
        AlunoEntity a = aluno(1L), b = aluno(2L), c = aluno(3L);
        IrmaoRelEntity rel = grupo(a, b, c);

        IrmaoRelDto dto = service.removerIrmao(a, 3L);

        assertNotNull(dto);
        assertNull(c.getIrmaoRel());
        assertSame(rel, a.getIrmaoRel());
        assertSame(rel, b.getIrmaoRel());
        assertEquals(Arrays.asList(a, b), rel.getIrmaos());
        verify(repository, never()).delete(any());
    }

    @Test
    void removerEmGrupoDeDoisDesfazGrupoEApagaFotos() {
        AlunoEntity a = aluno(1L), b = aluno(2L);
        IrmaoRelEntity rel = grupo(a, b);
        List<FotoEntity> fotos = rel.getFotos();
        fotos.add(new FotoEntity());

        IrmaoRelDto dto = service.removerIrmao(a, 2L);

        assertNull(dto);
        assertNull(a.getIrmaoRel());
        assertNull(b.getIrmaoRel());
        verify(fotoService).removerEmLote(fotos);
        verify(repository).delete(rel);
    }

    @Test
    void removerAlunoForaDoGrupoRecusa() {
        AlunoEntity a = aluno(1L), b = aluno(2L);
        aluno(3L);
        IrmaoRelEntity rel = grupo(a, b);

        assertThrows(RegraNegocioException.class, () -> service.removerIrmao(a, 3L));
        assertSame(rel, b.getIrmaoRel());
        verify(repository, never()).delete(any());
    }

    @Test
    void substituirEmGrupoDeDoisPreservaGrupoEFotos() {
        AlunoEntity a = aluno(1L), b = aluno(2L), d = aluno(4L);
        IrmaoRelEntity rel = grupo(a, b);
        rel.getFotos().add(new FotoEntity());

        service.substituirIrmao(a, 2L, 4L);

        assertNull(b.getIrmaoRel());
        assertSame(rel, d.getIrmaoRel());
        assertEquals(Arrays.asList(a, d), rel.getIrmaos());
        assertEquals(1, rel.getFotos().size());
        verify(fotoService, never()).removerEmLote(any());
        verify(repository, never()).delete(any());
    }

    @Test
    void substituirPorAlunoDeOutroGrupoRecusa() {
        AlunoEntity a = aluno(1L), b = aluno(2L), e = aluno(5L), f = aluno(6L);
        IrmaoRelEntity rel = grupo(a, b);
        IrmaoRelEntity outro = grupo(e, f);

        assertThrows(RegraNegocioException.class, () -> service.substituirIrmao(a, 2L, 5L));
        assertSame(rel, b.getIrmaoRel());
        assertSame(outro, e.getIrmaoRel());
        assertEquals(Arrays.asList(e, f), outro.getIrmaos());
    }

    @Test
    void substituirPorAlunoDeOutraEscolaRecusa() {
        AlunoEntity a = aluno(1L), b = aluno(2L);
        AlunoEntity x = aluno(7L);
        x.setEscola(escola(2L));
        grupo(a, b);

        assertThrows(RegraNegocioException.class, () -> service.substituirIrmao(a, 2L, 7L));
        assertNull(x.getIrmaoRel());
    }

    @Test
    void relacionarSemGrupoCriaGrupoComTodos() {
        AlunoEntity a = aluno(1L), b = aluno(2L);

        service.relacionaIrmaos(a, Collections.singletonList(2L));

        assertNotNull(a.getIrmaoRel());
        assertSame(a.getIrmaoRel(), b.getIrmaoRel());
        assertEquals(Arrays.asList(a, b), a.getIrmaoRel().getIrmaos());
    }

    @Test
    void relacionarTerceiroIrmaoAGrupoExistenteVinculaONovo() {
        AlunoEntity a = aluno(1L), b = aluno(2L), c = aluno(3L);
        IrmaoRelEntity rel = grupo(a, b);

        service.relacionaIrmaos(a, Arrays.asList(2L, 3L));

        assertSame(rel, c.getIrmaoRel());
        assertEquals(Arrays.asList(a, b, c), rel.getIrmaos());
    }

    @Test
    void relacionarAlunosDeGruposDistintosRecusaEPreservaGrupos() {
        AlunoEntity a = aluno(1L), b = aluno(2L), e = aluno(5L), f = aluno(6L);
        IrmaoRelEntity rel = grupo(a, b);
        IrmaoRelEntity outro = grupo(e, f);

        assertThrows(RegraNegocioException.class, () -> service.relacionaIrmaos(a, Arrays.asList(2L, 5L)));
        assertSame(rel, a.getIrmaoRel());
        assertSame(outro, e.getIrmaoRel());
        assertEquals(Arrays.asList(e, f), outro.getIrmaos());
    }

    @Test
    void relacionarAlunoQueJaTemOutroGrupoRecusa() {
        AlunoEntity a = aluno(1L), b = aluno(2L), e = aluno(5L), f = aluno(6L);
        IrmaoRelEntity rel = grupo(a, b);
        grupo(e, f);

        assertThrows(RegraNegocioException.class, () -> service.relacionaIrmaos(e, Collections.singletonList(2L)));
        assertEquals(Arrays.asList(a, b), rel.getIrmaos());
    }

    @Test
    void relacionarSomenteOProprioAlunoRecusa() {
        AlunoEntity a = aluno(1L);

        assertThrows(RegraNegocioException.class, () -> service.relacionaIrmaos(a, Collections.singletonList(1L)));
        assertNull(a.getIrmaoRel());
    }

    private EscolaEntity escola(Long id) {
        EscolaEntity e = new EscolaEntity();
        e.setId(id);
        return e;
    }

    private AlunoEntity aluno(Long id) {
        AlunoEntity aluno = new AlunoEntity();
        aluno.setId(id);
        aluno.setNome("Aluno " + id);
        aluno.setEscola(escola);
        alunos.put(id, aluno);
        return aluno;
    }

    private IrmaoRelEntity grupo(AlunoEntity... membros) {
        IrmaoRelEntity rel = new IrmaoRelEntity();
        rel.setId(proximoIdGrupo++);
        rel.setIrmaos(new ArrayList<>(Arrays.asList(membros)));
        rel.setFotos(new ArrayList<>());
        for (AlunoEntity membro : membros) {
            membro.setIrmaoRel(rel);
        }
        return rel;
    }
}
