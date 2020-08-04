import React, { Component } from 'react';
import './AreaAcesso.css';
import InputChaveAcesso from './InputChaveAcesso/InputChaveAcesso';
import rotas from '../../../AppRotas'

class AreaAcesso extends Component {

    constructor(props) {
        super(props);
        this.stateInicial = {
            chave: '',
            disabled: true
        }
        this.state = this.stateInicial;
    }

    onChange(value, rawValue) {
        if (value) {
            if (rawValue.length === 10) {
                this.setState({chave: value});
                this.setState({disabled: false});
            }
        } else {
            this.setState(this.stateInicial);
        }
    }

    submit() {
        this.props.history.push(rotas.MOSTRUARIO.replace(':chave', this.state.chave));
    }

    render() {
        const sendButton = (
            <button
                className={`btn-small waves-effect waves-light grey darken-4 ${this.state.disabled ?  'disabled': ''}`}
                type="submit"
                onClick={() => this.submit()}
            >
                <i className="material-icons">send</i>
            </button>
        );

        return (
                <div className="center-align">
                    <div className="row">
                        <h5 className="col s12">Recordação Escolar Kit 2020</h5>
                    </div>
                    <div className="container row valign-wrapper">
                        <form className="col s8 m6 offset-m3">
                            <InputChaveAcesso onChange={(value, rawValue) => this.onChange(value, rawValue)} />
                        </form>
                        <div className="col s4 hide-on-med-and-up">
                            {sendButton}
                        </div>
                        <div className="col m3 hide-on-small-only left-align">
                            {sendButton}
                        </div>
                    </div>
                </div>
        )
    }
}
export default AreaAcesso;