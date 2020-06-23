import React, { Component } from 'react';
import Select from '../../../Utils/Select/Select';
import PopUp from '../../../Utils/pop-up/PopUp';
import TurmaService from '../../Turma/TurmaService';
import AlunoService from '../AlunoService';

class IrmaoSelect extends Component {

    constructor(props) {
        super(props);
        this.escolaId = this.props.escolaId;
        this.alunoId = this.props.alunoId;
        this.state = {
            turmas: [],
            alunos: [],
            irmao: props.irmao ? props.irmao : '',
            disabled: props.disabled,
        }
    }

    componentDidMount() {
        if (!this.state.disabled) {
            this.listTurmas();
        }
    }

    listTurmas() {
        TurmaService.getListNomesPorEscola(this.escolaId)
            .then(turmas => this.setState({turmas: turmas}))
            .catch(error => PopUp.erro(error));
    }

    listAlunos(turmaId) {
        AlunoService.getListNomesPorTurma(turmaId)
            .then(alunos => {
                if (alunos.length === 0) {
                    PopUp.aviso('Esta turma não possui alunos');
                    this.setState({alunos: []});
                } else {
                    alunos = alunos.filter(aluno => aluno.id !== this.alunoId);
                    this.setState({alunos: alunos});
                }
            })
            .catch(error => PopUp.erro(error));
    }

    selecionarTurma(idx) {
        const turmaId = this.state.turmas[idx].id;
        this.listAlunos(turmaId);
    }

    selecionarIrmao(idx) {
        const irmao = this.state.alunos[idx];
        this.setState({irmao: irmao});
        this.props.selecionar(irmao);
    }


    render() {
        return (
            <div className="row">
                <div className="input-field col s12 m6">
                    <Select 
                        label={'Turmas'}
                        options={this.state.turmas}
                        disabled={this.state.turmas.length === 0}
                        selecionar={idx => this.selecionarTurma(idx)}
                    />
                </div>
                <div className="input-field col s12 m6">
                    <Select 
                        label={'Alunos'}
                        options={this.state.alunos}
                        disabled={this.state.alunos.length === 0}
                        selecionar={idx => this.selecionarIrmao(idx)}
                    />
                </div>
            </div>
        )
    }

}
export default IrmaoSelect;
