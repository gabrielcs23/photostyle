import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import PopUp from '../../../Utils/pop-up/PopUp';
import Rotas from '../../AreaAdminRotas';
import AlunoService from '../AlunoService';
import AlunoCard from './AlunoCard';

class ListaAluno extends Component {

    constructor(props) {
        super(props);
        
        this.turma = props.turma;
        this.state = {
            listaAlunos: []
        }
    }

    componentDidMount() {
        if(this.props.turma != null) {
            AlunoService.getListPorTurma(this.turma.id)
                .then(lista => this.ordenaLista(lista))
                .then(lista => this.setState({listaAlunos : lista}))
                .catch(error => this.props.handleUnauthorized(error))
                .catch(error => PopUp.erro(error));
        } else {
            this.props.history.push(Rotas.ESCOLA_LISTA);
        }
    }

    remover(id, idx) {
        AlunoService.deleteAluno(id)
            .then(() => {
                let novaLista = this.state.listaAlunos.slice();
                novaLista.splice(idx, 1);
                this.setState({listaAlunos: novaLista});
                PopUp.sucesso('Aluno removida com sucesso');
            })
            .catch(error => this.props.handleUnauthorized(error))
            .catch(error => PopUp.erro(error));
    }

    ordenaLista(lista) {
        return lista.sort((a, b) => {
            const nomeA = a.nome.toUpperCase();
            const nomeB = b.nome.toUpperCase();
            if (nomeA < nomeB) {
                return -1;
            }
            if (nomeA > nomeB) {
                return 1;
            }
            return 0;
        });
    }

    render() {
        const lista = this.state.listaAlunos.slice();
        const listaCards = lista.map((aluno, idx) => {
            return <AlunoCard key={aluno.id} aluno={aluno}
                        editar={() => this.props.editar(aluno.id)}
                        excluir={() => this.remover(aluno.id, idx)}
                    />
        });

        return (
            <div>
                <div className="row">
                    <div className="col right">
                        <NavLink to={Rotas.ALUNO_NOVO}>
                            <button 
                                className="btn-floating btn-large waves-effect waves-light blue"
                                >
                                <i className="material-icons">add</i>
                            </button>
                        </NavLink>
                    </div>
                </div>
                <div className="row">
                    {listaCards}
                </div>
            </div>
        )
    }

}
export default ListaAluno;
