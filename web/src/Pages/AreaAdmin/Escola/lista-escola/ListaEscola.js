import React, { Component } from 'react';
import EscolaService from '../EscolaService';

class ListaEscola extends Component {

    constructor(props) {
        super(props);
        this.state = {
            listaEscolas: undefined
        }
    }

    componentDidMount() {
        EscolaService.getList()
            .then(lista => this.setState({listaEscolas : lista}));
    }

    render() {
        return (
            <div className="row">
                <div className="col s1">
                    <button className="btn-floating btn-large waves-effect waves-light blue"><i className="material-icons">add</i></button>
                </div>
                {/* <div className="col s1 offset-s10">
                    <button disabled className="btn-floating btn-large waves-effect waves-light red"><i className="material-icons">delete_forever</i></button>
                </div> */}
            </div>
        )
    }

}
export default ListaEscola;