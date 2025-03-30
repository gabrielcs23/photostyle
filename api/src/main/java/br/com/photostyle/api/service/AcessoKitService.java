package br.com.photostyle.api.service;

import br.com.photostyle.api.email.service.EmailService;
import br.com.photostyle.api.model.adapter.FotoAdapter;
import br.com.photostyle.api.model.adapter.PedidoAdapter;
import br.com.photostyle.api.model.dto.FotoDto;
import br.com.photostyle.api.model.dto.MostruarioDto;
import br.com.photostyle.api.model.dto.kit.KitDto;
import br.com.photostyle.api.model.dto.kit.OpcaoExtra;
import br.com.photostyle.api.model.dto.kit.OpcaoKit;
import br.com.photostyle.api.model.dto.pedido.PedidoDto;
import br.com.photostyle.api.model.dto.pedido.RetornoPedidoDto;
import br.com.photostyle.api.model.entity.*;
import br.com.photostyle.api.model.entity.pedido.PedidoEntity;
import br.com.photostyle.api.model.entity.tabela.OpcaoExtraEntity;
import br.com.photostyle.api.model.entity.tabela.OpcaoKitEntity;
import br.com.photostyle.api.model.entity.tabela.TabelaDePrecoEntity;
import br.com.photostyle.api.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.transaction.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AcessoKitService {

    @Autowired
    private AlunoService alunoService;

    @Autowired
    private EscolaService escolaService;

    @Autowired
    private TabelaPrecoService tabelaPrecoService;

    @Autowired
    private FotoAdapter fotoAdapter;

    @Autowired
    private PedidoAdapter pedidoAdapter;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private EmailService emailService;

    public KitDto montarKit(String codAcesso) {
        AlunoEntity aluno = alunoService.getAlunoByCodAcesso(codAcesso);
        if (aluno == null) {
            return null;
        }
        KitDto kit = new KitDto();
        kit.setCodigoAcesso(aluno.getCodigoAcesso());
        kit.setNomeAluno(aluno.getNome());

        List<FotoEntity> fotos = aluno.getFotos();
        if (!CollectionUtils.isEmpty(fotos)) {
            List<FotoDto> fotoDtos = fotoAdapter.entityListToDtoList(fotos);
            kit.setFotoIndividual(fotoDtos);
        }

        EscolaEntity escola = aluno.getEscola();
        kit.setEscola(escola.getNome());

        TabelaDePrecoEntity tabelaPreco = tabelaPrecoService.getPorEscolaOuDefault(escola.getId());
        List<OpcaoKit> opKits = tabelaPreco.getOpcoesKit().stream()
                .map(this::montarOpcaoKit).collect(Collectors.toList());
        List<OpcaoExtra> opExtras = tabelaPreco.getOpcoesExtra().stream()
                .map(this::montarOpcaoExtra).collect(Collectors.toList());
        kit.setOpcaoKits(opKits);
        kit.setOpcaoExtras(opExtras);

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

        List<FotoEntity> fotosOpcionais = aluno.getFotosOpcionais();
        if (!CollectionUtils.isEmpty(fotosOpcionais)) {
            List<FotoDto> fotosOpcionaisDtos = fotoAdapter.entityListToDtoList(fotosOpcionais);
            kit.setFotosOpcionais(fotosOpcionaisDtos);
        }

        MostruarioDto mostruario = escolaService.getMostruario(escola.getId());
        if (mostruario != null && !CollectionUtils.isEmpty(mostruario.getFotos())) {
            kit.setFotosMostruarioEscola(mostruario.getFotos());
        }

        return kit;
    }

    private OpcaoKit montarOpcaoKit(OpcaoKitEntity entity) {
        OpcaoKit dto = new OpcaoKit();
        dto.setNome(entity.getNome());
        dto.setValor(entity.getValor());
        dto.setIrmao(entity.isIrmao());
        dto.setTurma(entity.isTurma());
        return dto;
    }

    private OpcaoExtra montarOpcaoExtra(OpcaoExtraEntity entity) {
        OpcaoExtra dto = new OpcaoExtra();
        dto.setNome(entity.getNome());
        dto.setValor(entity.getValor());
        dto.setIrmao(entity.isIrmao());
        dto.setTurma(entity.isTurma());
        dto.setDigital(entity.isDigital());
        dto.setOpcional(entity.isOpcional());
        return dto;
    }

    @Transactional
    public RetornoPedidoDto realizarPedido(PedidoDto dto) {
        PedidoEntity pedidoEntity = pedidoAdapter.dtoToEntity(dto);
        PedidoEntity pedido = pedidoRepository.save(pedidoEntity);
        String nPedido = geraNumeroPedido(pedido.getId());

        Map<String, Object> templateModel = new HashMap<>();
        templateModel.put("nPedido", nPedido);
        templateModel.put("escola", pedido.getNomeEscola());
        templateModel.put("turma", pedido.getNomeTurma());
        templateModel.put("aluno", pedido.getNomeAluno());
        templateModel.put("responsavel", pedido.getNomeResponsavel());
        templateModel.put("tel", pedido.getTelContato());
        templateModel.put("email", pedido.getEmail());
        templateModel.put("kit", pedido.getKit());
        templateModel.put("extras", pedido.getExtras());
        templateModel.put("valorTotal", pedido.getValorTotal());

        emailService.enviarEmailSistema(templateModel);
        emailService.enviarEmailResponsavel(pedidoEntity.getEmail(), templateModel);
        return new RetornoPedidoDto(nPedido);
    }

    private String geraNumeroPedido(Long id) {
        StringBuilder idString = new StringBuilder(id.toString());
        // preenche numero pedido com zeros
        while (idString.length() < 7) {
            idString.insert(0, '0');
        }
        return '#' + idString.toString();
    }

}

