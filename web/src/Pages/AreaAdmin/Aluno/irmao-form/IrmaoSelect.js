import React, { Component } from 'react';
import Select from '../../../Utils/Select/Select';
import PopUp from '../../../Utils/pop-up/PopUp';
import TurmaService from '../../Turma/TurmaService';
import AlunoService from '../AlunoService';

class IrmaoSelect extends Component {

    constructor(props) {
        super(props);
        this.escolaId = this.props.escolaId;
        this.state = {
            turmas: [],
            alunos: [],
            irmao: props.irmao ? props.irmao : '',
            disabled: props.disabled,
            disabledAlunos: true
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
                    this.setState({disabledAlunos: true});
                } else {
                    this.setState({alunos: alunos, disabledAlunos: false});
                }
            })
            .then(() => console.log(this.state.disabledAlunos))
            .catch(error => PopUp.erro(error));
    }

    selecionarTurma(idx) {
        const turmaId = this.state.turmas[idx].id;
        this.listAlunos(turmaId);
    }

    selecionarIrmao(idx) {
        
    }


    render() {
        return (
            <div className="row">
                <div className="input-field col s12 m6">
                    {this.state.turmas.length === 0 ? null:
                        <Select 
                            label={'Turmas'}
                            options={this.state.turmas.slice()}
                            disabled={false}
                            selecionar={idx => this.selecionarTurma(idx)}
                        />
                    }
                </div>
                <div className="input-field col s12 m6">
                    {this.state.alunos.length === 0 ? null:
                        <Select 
                            label={'Alunos'}
                            options={this.state.alunos.slice()}
                            disabled={this.state.disabledAlunos}
                            selecionar={idx => this.selecionarIrmao(idx)}
                        />
                    }
                </div>
            </div>
        )
    }

}
export default IrmaoSelect;
