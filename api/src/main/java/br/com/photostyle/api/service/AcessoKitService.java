package br.com.photostyle.api.service;

import br.com.photostyle.api.model.adapter.FotoAdapter;
import br.com.photostyle.api.model.adapter.PedidoAdapter;
import br.com.photostyle.api.model.dto.FotoDto;
import br.com.photostyle.api.model.dto.KitDto;
import br.com.photostyle.api.model.dto.PedidoDto;
import br.com.photostyle.api.model.entity.*;
import br.com.photostyle.api.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.List;

@Service
public class AcessoKitService {

    @Autowired
    private AlunoService alunoService;

    @Autowired
    private FotoAdapter fotoAdapter;

    @Autowired
    private PedidoAdapter pedidoAdapter;

    @Autowired
    private PedidoRepository pedidoRepository;

    public KitDto montarKit(String codAcesso) {
        AlunoEntity aluno = alunoService.getAlunoByCodAcesso(codAcesso);
        if (aluno == null) {
            return null;
        }
        KitDto kit = new KitDto();
        kit.setCodigoAcesso(aluno.getCodigoAcesso());
        kit.setNomeAluno(aluno.getNome());
        FotoEntity fotoIndividual = aluno.getFoto();
        if (fotoIndividual != null) {
            FotoDto fotoIndDto = fotoAdapter.entityToDto(fotoIndividual);
            kit.setFotoIndividual(fotoIndDto);
        }

        kit.setEscola(aluno.getEscola().getNome());

        TurmaEntity turma = aluno.getTurma();
        kit.setTurma(turma.getNome());
        List<FotoEntity> fotosTurma = turma.getFotos();
        if (!CollectionUtils.isEmpty(fotosTurma)) {
            List<FotoDto> fotosTurmaDtos = fotoAdapter.entityListToDtoList(fotosTurma);
            kit.setFotosTurma(fotosTurmaDtos);
        }

        IrmaoRelEntity irmaoRel = aluno.getIrmaoRel();
        if (irmaoRel != null && !CollectionUtils.isEmpty(irmaoRel.getFotos())) {
            List<FotoEntity> fotosIrmaosEntities = irmaoRel.getFotos();
            List<FotoDto> fotosIrmaosDtos = fotoAdapter.entityListToDtoList(fotosIrmaosEntities);
            kit.setFotosIrmaos(fotosIrmaosDtos);
        }

        return kit;
    }

    public void realizarPedido(PedidoDto dto) {
        PedidoEntity pedidoEntity = pedidoAdapter.dtoToEntity(dto);
        pedidoEntity.getId();
//        PedidoEntity pedido = pedidoRepository.save(pedidoEntity);
//        Long numeroPedido = pedido.getId();
        // TODO mandar email para o responsável
        // TODO mandar email para caixa interna
    }
}

