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

    render() {
        const lista = this.state.listaTurmas.slice();
        const listaCards = lista.map((turma, idx) => {
            return <TurmaCard key={idx} turma={turma}
                        selecionar={() => this.props.selecionar(turma)}
                        editar={() => console.log('edição')}
                        excluir={() => console.log('remoção')}
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
