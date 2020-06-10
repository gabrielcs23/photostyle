import React, { Component } from 'react';
import EscolaService from './EscolaService';
import Escola from '../../../Model/Escola'

class EscolaForm extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            nome: ''
        }
    }

    inputChangeHandler = (event) => {
        const { name, value } = event.target;

        this.setState({
            [name]: value
        });
    }

    submitForm = () => {
        const escola = new Escola(this.state.nome);
        console.log(escola)
        EscolaService.postEscola(escola)
            .then(res => res.data)
            .then(escola => console.log(escola))
    }

    render() {
        const { nome } = this.state;

        return (
            <form>
                <div className="row">
                    <div className="col s12">
                        <div className="float-right">
                            <button 
                                className="btn waves-effect waves-light blue btn-small"
                                onClick={this.submitForm}
                                type="button"
                                >
                                <span className="d-inline-flex">
                                    <i className="material-icons">save</i>
                                    <span className="pl-2">Salvar</span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s12">
                        <label htmlFor="nome">Nome da Escola</label>
                        <input 
                            className="validate"
                            id="nome"
                            type="text"
                            name="nome"
                            value={nome}
                            onChange={this.inputChangeHandler}
                        />
                    </div>
                </div>
            </form>
        )
    }


}
export default EscolaForm;
