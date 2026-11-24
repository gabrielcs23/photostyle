import React, { Component } from 'react';
import CustomSelect from '../../../Utils/CustomSelect/CustomSelect';
import ModalConfirmarExclusao from '../../../Utils/Modal/Modal';
import PopUp from '../../../Utils/pop-up/PopUp';
import TurmaService from '../../Turma/TurmaService';
import AlunoService from '../AlunoService';
import './IrmaoSelect.css';

class IrmaoSelect extends Component {

    constructor(props) {
        super(props);
        this.composedKey = this.props.composedKey;

        // irmão carregado do banco vem com turma; linha nova vem vazia
        this.gravado = !!this.props.irmao.turma;

        this.state = this.getEstadoInicial();
    }

    getEstadoInicial() {
        if (!this.gravado) {
            return {
                turmas: [],
                alunos: [],
                irmao: '',
                disabled: false,
                modoAlteracao: false,
                salvando: false
            }
        }
        const { irmao } = this.props;
        return {
            turmas: [irmao.turma],
            alunos: [irmao],
            irmao: irmao,
            disabled: true,
            modoAlteracao: false,
            salvando: false
        }
    }

    componentDidMount() {
        if (!this.state.disabled) {
            this.listTurmas();
        }
    }

    listTurmas() {
        TurmaService.getListNomesPorEscola(this.props.escolaId)
            .then(turmas => this.setState({ turmas: turmas }))
            .catch(error => PopUp.erro(error));
    }

    listAlunos(turmaId) {
        const idsNoGrupo = (this.props.idsNoGrupo || []).map(Number);
        AlunoService.getListNomesPorTurma(turmaId)
            .then(alunos => {
                alunos = alunos.filter(aluno => !idsNoGrupo.includes(Number(aluno.id)));
                if (alunos.length === 0) {
                    PopUp.aviso('Esta turma não possui outros alunos disponíveis para vincular');
                }
                this.setState({ alunos: alunos });
            })
            .catch(error => PopUp.erro(error));
    }

    selecionarTurma(idx) {
        // CustomSelect desabilitado seleciona a 1ª opção ao montar; em modo leitura a lista de alunos já está pronta
        if (this.state.disabled) return;
        const turma = this.state.turmas[idx];
        if (turma) this.listAlunos(turma.id);
    }

    selecionarIrmao(idx) {
        const irmao = this.state.alunos[idx];
        if (!irmao) {
            return;
        }
        if (this.state.modoAlteracao) {
            this.setState({ salvando: true });
            this.props.substituir(irmao)
                .then(substituido => {
                    if (!substituido) {
                        this.cancelarAlteracao();
                    }
                });
        } else if (!this.gravado) {
            this.setState({ irmao: irmao });
            this.props.selecionar(irmao);
        }
    }

    iniciarAlteracao() {
        this.setState({
            turmas: [],
            alunos: [],
            disabled: false,
            modoAlteracao: true
        }, () => this.listTurmas());
    }

    cancelarAlteracao() {
        this.setState(this.getEstadoInicial());
    }

    confirmarRemocao = (event) => {
        // os botões do modal ficam dentro do <form> do aluno
        event.preventDefault();
        this.props.remover();
    }

    renderAcoes() {
        if (!this.gravado) {
            return (
                <button className="btn-small grey darken-1 waves-effect waves-light"
                    type="button"
                    title="Descartar linha"
                    onClick={() => this.props.remover()}
                >
                    <i className="material-icons">close</i>
                </button>
            )
        }

        if (this.state.modoAlteracao) {
            return (
                <button className="btn-small grey darken-1 waves-effect waves-light"
                    type="button"
                    title="Cancelar alteração"
                    disabled={this.state.salvando}
                    onClick={() => this.cancelarAlteracao()}
                >
                    <i className="material-icons">undo</i>
                </button>
            )
        }

        const idModal = `modal-remover-irmao-${this.props.irmao.id}`;
        return (
            <>
                <button className="btn-small blue waves-effect waves-light mr-2"
                    type="button"
                    title="Alterar irmão"
                    onClick={() => this.iniciarAlteracao()}
                >
                    <i className="material-icons">edit</i>
                </button>
                <button className="btn-small red darken-3 waves-effect waves-light modal-trigger"
                    type="button"
                    title="Remover vínculo"
                    data-target={idModal}
                >
                    <i className="material-icons">link_off</i>
                </button>
                <ModalConfirmarExclusao
                    key={`${idModal}-${this.props.desfazGrupo}`}
                    idModal={idModal}
                    titulo={`Remover vínculo de irmão de ${this.props.irmao.nome}?`}
                    mensagem={(
                        <div>
                            <p>{this.props.irmao.nome} deixará de ser irmão(ã) dos alunos deste grupo.</p>
                            {this.props.desfazGrupo
                                ? <p>Como o grupo ficará com apenas um aluno, ele será desfeito e as fotos com irmãos serão excluídas.</p>
                                : null
                            }
                        </div>
                    )}
                    confirmar={this.confirmarRemocao}
                />
            </>
        )
    }

    render() {
        const modo = this.state.modoAlteracao ? 'alteracao' : 'leitura';
        return (
            <div className="row irmao-select-row">
                <div className="input-field col s12 m5">
                    <CustomSelect
                        key={`${this.composedKey}0-${modo}`}
                        composedKey={this.composedKey + '0'}
                        label={'Turmas'}
                        options={this.state.turmas}
                        disabled={this.state.disabled || this.state.turmas.length === 0}
                        selecionar={idx => this.selecionarTurma(idx)}
                    />
                </div>
                <div className="input-field col s12 m5">
                    <CustomSelect
                        key={`${this.composedKey}1-${modo}`}
                        composedKey={this.composedKey + '1'}
                        label={this.state.modoAlteracao ? 'Novo irmão' : 'Alunos'}
                        options={this.state.alunos}
                        disabled={this.state.disabled || this.state.salvando || this.state.alunos.length === 0}
                        selecionar={idx => this.selecionarIrmao(idx)}
                    />
                </div>
                <div className="input-field col s12 m2 irmao-acoes">
                    {/* mesmo espaço do rótulo dos selects */}
                    <span className="irmao-acoes-rotulo">&nbsp;</span>
                    <div className="irmao-acoes-botoes">
                        {this.renderAcoes()}
                    </div>
                </div>
            </div>
        )
    }

}
export default IrmaoSelect;
