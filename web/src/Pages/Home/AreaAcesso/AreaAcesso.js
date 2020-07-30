import React, { Component } from 'react';
import './AreaAcesso.css';
import InputChaveAcesso from './InputChaveAcesso/InputChaveAcesso';

class AreaAcesso extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chave: ''
        }
    }

    render() {
        return (
                <div className="center-align">
                    <div className="row">
                        <h5 className="col s12">Recordação Escolar Kit 2020</h5>
                    </div>
                    <div className="row">
                        <form className="col s6 offset-s4">
                            <InputChaveAcesso />
                        </form>
                        <div className="col s2 left-align">
                            <button className="btn waves-effect waves-light" type="submit" name="action">
                                <i className="material-icons">send</i>
                            </button>
                        </div>
                    </div>
                </div>
        )
    }
}
export default AreaAcesso;