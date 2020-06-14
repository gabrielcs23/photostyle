import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import PopUp from '../../../Utils/pop-up/PopUp';
import Rotas from '../../AreaAdminRotas';
import TurmaService from '../TurmaService';
import TurmaCard from './TurmaCard';

class ListaTurma extends Component {

    constructor(props) {
        super(props);
        
        this.escola = props.escola;
        this.state = {
            listaTurmas: []
        }
    }

    componentDidMount() {
        if(this.props.escola != null) {
            TurmaService.getListPorEscola(this.escola.id)
                .then(lista => this.setState({listaTurmas : lista}))
                .catch(error => PopUp.erro(error));
        } else {
            this.props.history.push(Rotas.ESCOLA_LISTA);
        }
    }

    remover(id, idx) {
        TurmaService.deleteTurma(id)
            .then(() => {
                let novaLista = this.state.listaTurmas.slice();
                novaLista.splice(idx, 1);
                this.setState({listaTurmas: novaLista});
                PopUp.sucesso('Turma removida com sucesso');
            })
            .catch(error => PopUp.erro(error));
    }

    render() {
        const lista = this.state.listaTurmas.slice();
        const listaCards = lista.map((turma, idx) => {
            return <TurmaCard key={turma.id} turma={turma}
                        selecionar={() => this.props.selecionar(turma)}
                        editar={() => console.log('edição')}
                        excluir={() => this.remover(turma.id, idx)}
                    />
        });

        return (
            <div>
                <div className="row">
                    <div className="col float-right">
                        <NavLink to={Rotas.TURMA_NOVO}>
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
export default ListaTurma;
