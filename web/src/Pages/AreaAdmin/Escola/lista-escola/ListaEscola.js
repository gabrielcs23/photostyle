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
            listaEscolas: [],
            escolaId: -1
        }
    }

    componentDidMount() {
        EscolaService.getList()
            .then(lista => this.setState({ listaEscolas: lista }))
            .catch(error => this.props.handleUnauthorized(error))
            .catch(error => PopUp.erro(error));
    }

    remover(id, idx) {
        this.setState({ escolaId: id })
        EscolaService.deleteEscola(id)
            .then(() => {
                let novaLista = this.state.listaEscolas.slice();
                novaLista.splice(idx, 1);
                this.setState({ listaEscolas: novaLista });
                PopUp.sucesso('Escola removida com sucesso');
            })
            .catch(error => this.props.handleUnauthorized(error))
            .catch(error => PopUp.erro('Erro para remover a escola'))
            .finally(() => this.setState({ escolaId: -1 }));
    }

    render() {
        const lista = this.state.listaEscolas.slice();
        const listaCards = lista.map((escola, idx) => {
            return <EscolaCard key={idx} escola={escola}
                selecionar={() => this.props.selecionar(escola)}
                editar={() => this.props.editar(escola.id)}
                excluir={() => this.remover(escola.id, idx)}
                loading={this.state.escolaId === escola.id}
            />
        });

        return (
            <div>
                <div className="row">
                    <div className="col right">
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