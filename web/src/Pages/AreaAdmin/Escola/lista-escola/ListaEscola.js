import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import PopUp from '../../../Utils/pop-up/PopUp';
import Rotas from '../../AreaAdminRotas';
import EscolaService from '../EscolaService';
import EscolaCard from './EscolaCard';

class ListaEscola extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listaEscolas: []
        }
    }

    componentDidMount() {
        EscolaService.getList()
            .then(lista => this.setState({listaEscolas : lista}))
            .catch(error => PopUp.erro(error));
    }

    render() {
        const lista = this.state.listaEscolas.slice();
        const listaCards = lista.map((escola, idx) => {
            return <EscolaCard key={idx} escola={escola} selecionar={() => this.props.selecionar(escola)} />
        });

        return (
            <div>
                <div className="row">
                    <div className="col float-right">
                        <NavLink to={Rotas.ESCOLA_NOVO}>
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
export default ListaEscola;