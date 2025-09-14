import React, { Component } from 'react';
import CustomSelect from '../../../Utils/CustomSelect/CustomSelect';
import PopUp from '../../../Utils/pop-up/PopUp';
import TurmaService from '../../Turma/TurmaService';
import AlunoService from '../AlunoService';

class IrmaoSelect extends Component {

    constructor(props) {
        super(props);
        this.composedKey = this.props.composedKey;

        // se irmao foi carregado do banco
        if (!this.props.irmao.turma) {
            this.state = {
                turmas: [],
                alunos: [],
                irmao: '',
                disabled: false,
            }
        } else {
            const { irmao } = this.props;
            this.state = {
                turmas: [irmao.turma],
                alunos: [irmao],
                irmao: irmao,
                disabled: true,
            }
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
        AlunoService.getListNomesPorTurma(turmaId)
            .then(alunos => {
                if (alunos.length === 0) {
                    PopUp.aviso('Esta turma não possui alunos');
                    this.setState({ alunos: [] });
                } else {
                    alunos = alunos.filter(aluno => aluno.id !== this.props.alunoId);
                    this.setState({ alunos: alunos });
                }
            })
            .catch(error => PopUp.erro(error));
    }

    selecionarTurma(idx) {
        const turma = this.state.turmas[idx];
        if (turma) this.listAlunos(turma.id);
    }

    selecionarIrmao(idx) {
        const irmao = this.state.alunos[idx];
        if (irmao) {
            this.setState({ irmao: irmao });
            this.props.selecionar(irmao);
        }
    }


    render() {
        return (
            <div className="row">
                <div className="input-field col s12 m6">
                    <CustomSelect
                        composedKey={this.composedKey + '0'}
                        label={'Turmas'}
                        options={this.state.turmas}
                        disabled={this.state.disabled || this.state.turmas.length === 0}
                        selecionar={idx => this.selecionarTurma(idx)}
                    />
                </div>
                <div className="input-field col s12 m6">
                    <CustomSelect
                        composedKey={this.composedKey + '1'}
                        label={'Alunos'}
                        options={this.state.alunos}
                        disabled={this.state.disabled || this.state.alunos.length === 0}
                        selecionar={idx => this.selecionarIrmao(idx)}
                    />
                </div>
            </div>
        )
    }

}
export default IrmaoSelect;
