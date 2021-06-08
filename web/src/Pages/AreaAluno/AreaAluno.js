import React from "react";
import BasePage from "../BasePage/BasePage";
import service from "./AreaAlunoService";
import PopUp from "../Utils/pop-up/PopUp";
import styles from "./AreaAluno.module.scss";
import PedidoForm from "./PedidoForm/PedidoForm";
import MostraExtras from "./PedidoForm/Models/MostraExtras";
import Loading from "../Utils/Loading/Loading";
import ConfirmacaoPedido from "./ConfirmacaoPedido/ConfirmacaoPedido";
import Mostruario from "./Mostruario/Mostruario";

export default class AreaAluno extends BasePage {
  constructor(props) {
    super(props);
    this.state = {
      kit: null,
      nPedido: undefined,
    };
    this.mostraExtras = MostraExtras.get();
  }

  componentDidMount() {
    const {
      match: {
        params: { chave },
      },
    } = this.props;
    service
      .getKit(chave)
      .then((kit) => {
        kit.fotosTurma = this.ordenaFotos(kit.fotosTurma);
        this.setState({ kit: kit });
      })
      .catch((error) => {
        if (error.status) {
          PopUp.erro(`Erro ${error.status}: ${error.data}`);
        } else {
          PopUp.erro(error);
        }
      });
  }

  ordenaFotos(fts) {
    if (fts && fts.length > 0) {
      fts = fts.sort((a, b) => {
        const descA = a.descricao.toUpperCase();
        const descB = b.descricao.toUpperCase();
        if (descA < descB) {
          return -1;
        }
        if (descA > descB) {
          return 1;
        }
        return 0;
      });
    }
    return fts;
  }

  getOpcoesFotos(ftsTurma, ftsIrmaos, ftsOpcionais) {
    let fotos = {};
    if (ftsTurma && ftsTurma.length > 0) {
      fotos.turma = ftsTurma.map((ft) => {
        return { nome: ft.descricao };
      });
    }
    if (ftsIrmaos && ftsIrmaos.length > 0) {
      fotos.irmaos = ftsIrmaos.map((ft) => {
        return { nome: ft.descricao };
      });
    }
    if (ftsOpcionais && ftsOpcionais.length > 0) {
      fotos.adicionais = ftsOpcionais.map(ft => { 
        return { nome: ft.descricao }
      });
    }
    return fotos;
  }

  onPedidoFeito(nPedido) {
    this.setState({ nPedido });
  }

  renderPage() {
    const { kit } = this.state;
    if (kit == null) {
      return <Loading />;
    }
    if (!this.state.nPedido) {
      const opcoes = this.getOpcoesFotos(kit.fotosTurma, kit.fotosIrmaos, kit.fotosOpcionais);
      const tabela = {opcaoKits: kit.opcaoKits, opcaoExtras: kit.opcaoExtras}
      return (
        <>
          <div className={`${styles.title} center`}>
            <h3>Kit Fotográfico Escolar</h3>
          </div>
          <div className="content container">
            <Mostruario
              kit={kit}
              mostraExtras={this.mostraExtras}
              showHelper={kit.fotosTurma}
              styles={styles}
            />

            <PedidoForm
              aluno={kit.nomeAluno}
              turma={kit.turma}
              escola={kit.escola}
              opcoes={opcoes}
              tabela={tabela}
              onPedidoFeito={(nPedido) => this.onPedidoFeito(nPedido)}
            />
          </div>
        </>
      );
    }
    return <ConfirmacaoPedido nPedido={this.state.nPedido} styles={styles} />;
  }
}
