import React, { Component } from 'react';
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
        this.props.history.push(rotas.AREA_ALUNO.replace(':chave', this.state.chave));
    }

    render() {
        const title = 'Recordação Escolar 2020';
        return (
                <div className={`container ${styles.containerBox}`}>
                    <div 
                        className={`center-align ${styles.inputBox}`}
                        style={{backgroundImage: `url(${process.env.PUBLIC_URL}/assets/images/cb.png)`}}
                    >
                        <div className="row">
                            <h4 className={`col s12 ${styles.title} hide-on-small-only`}>{title}</h4>
                            <h5 className={`col s12 ${styles.title} hide-on-med-and-up`}>{title}</h5>
                        </div>
                        <div className={`container ${styles.inputContainer}`}>
                            <div className={`row ${styles.rowCenter}`}>
                                <form className={`col s12 m8 l12 xl6 ${styles.inputChave}`} style={{marginLeft: "unset"}}>
                                    <InputChaveAcesso
                                        onChange={(value, rawValue) => this.onChange(value, rawValue)}
                                        onEnterKeyDown={() => this.submit()}
                                    />
                                </form>
                            </div>
                            <div className={`row ${styles.rowCenter}`}>
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
                </div>
        )
    }
}
export default AreaAcesso;