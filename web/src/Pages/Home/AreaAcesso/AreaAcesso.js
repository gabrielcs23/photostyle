import React, { Component } from 'react';
import './AreaAcesso.css';
import InputChaveAcesso from './InputChaveAcesso/InputChaveAcesso';
import rotas from '../../../AppRotas';
import styles from './AreaAcesso.module.scss';

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
        return (
                <div className={`container ${styles.containerBox}`}>
                    <div 
                        className={`center-align ${styles.inputBox}`}
                        style={{backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/cb.png)`}}
                    >
                        <div className="row">
                            <h5 className="col s12">Recordação Escolar Kit 2020</h5>
                        </div>
                        <div className={`container row mt-5 ${styles.rowInput}`}>
                            <form className={`col s12 m6 l12 xl6 ${styles.inputChave}`} style={{marginLeft: "unset"}}>
                                <InputChaveAcesso
                                    onChange={(value, rawValue) => this.onChange(value, rawValue)}
                                />
                            </form>
                        </div>
                        <div className={`row ${styles.rowInput}`}>
                            <div className="col s12">
                                <button
                                    className={`btn-small waves-effect waves-light grey darken-4 ${this.state.disabled ?  'disabled': ''}`}
                                    type="submit"
                                    onClick={() => this.submit()}
                                >
                                    <i className="material-icons">send</i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}
export default AreaAcesso;