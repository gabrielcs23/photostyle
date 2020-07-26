import React, { Component } from 'react';
import FormValidator from '../form-utils/FormValidator';
import LoginService from './LoginService';
import PopUp from '../../Utils/pop-up/PopUp';

class Login extends Component {

    constructor(props) {
        super(props);

        this.validador = new FormValidator([
            {
                campo: 'usuario',
                metodo: 'isEmpty',
                validoQuando: false,
                mensagem: 'Digite o nome de usuário'
            },
            {
                campo: 'senha',
                metodo: 'isEmpty',
                validoQuando: false,
                mensagem: 'Digite a senha'
            }
        ]);
        
        this.state = {
            usuario: '',
            senha: '',
            validacao: this.validador.valido(),
            canSubmit: true
        }
    }

    handleChange = (event) => {
        const { name, value } = event.target;

        this.setState(
            { [name]: value }
        )
    }

    login = () => {
        this.setState({canSubmit: false});
        const validacao = this.validador.valida(this.state);
        if (validacao.isValid) {
            const { usuario, senha } = this.state;
            LoginService.login(usuario, senha)
                .then(() => {
                    this.props.aposLogin();
                })
                .catch(error => {
                    if (error.status && error.status === 401) {
                        PopUp.erro(error.data)
                    } else {
                        PopUp.erro(error);
                    }
                    this.setState({canSubmit: true});
                });
        } else {
            const { usuario, senha } = validacao;
            const campos = [usuario, senha];

            const camposInvalidos = campos.filter(elem => elem.isInvalid);
            camposInvalidos.forEach(campo => PopUp.erro(campo.message));

            this.setState({canSubmit: true});
        }
    }

    keyPressHandle = (event) => {
        if (event.key === 'Enter') {
            this.login();
        }
    }

    render() {
        const { usuario, senha } = this.state;
        return (
            <div className="container center">
                <div className="row">
                    <h4>Login</h4>
                    <form>
                        <div className="input-field col s12">
                            <i className="material-icons prefix">account_circle</i>
                            <label htmlFor="usuario">Usuario</label>
                            <input
                                className="validate"
                                id="usuario"
                                type="text"
                                name="usuario"
                                value={usuario}
                                onChange={this.handleChange}
                            />
                        </div>
                        <div className="input-field col s12">
                            <i className="material-icons prefix">enhanced_encryption</i>
                            <label htmlFor="senha">Senha</label>
                            <input
                                className="validate"
                                id="senha"
                                type="password"
                                name="senha"
                                value={senha}
                                onChange={this.handleChange}
                                onKeyPress={this.keyPressHandle}
                            />
                        </div>
                        <div className="row">
                            <button className="btn btn-success blue darken-4"
                                disabled={!this.state.canSubmit}
                                onClick={this.login}
                                type="button"
                            >
                                Entrar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

}
export default Login;