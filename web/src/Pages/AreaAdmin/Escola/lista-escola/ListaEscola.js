import React, { Component } from 'react';
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
            .then(lista => this.setState({listaEscolas : lista}));
    }

    handleClick = () => {
        const { pathname } = this.props.history.location;
        this.props.history.push(pathname + '/novo');
    }

    render() {
        const lista = this.state.listaEscolas.slice();
        const listaCards = lista.map((escola, idx) => {
            return <EscolaCard key={idx} escola={escola} />
        });

        return (
            <div>
                <div className="row">
                    <div className="col float-right">
                        <button 
                            className="btn-floating btn-large waves-effect waves-light blue"
                            onClick={this.handleClick}
                            >
                            <i className="material-icons">add</i>
                        </button>
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