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
                    PopUp.sucesso('Bem vindo');
                    this.props.aposLogin();
                })
                .catch(error => {
                    debugger;
                    const res = error.response;
                    if (res.status === 401) {
                        PopUp.erro(res.data)
                    } else {
                        PopUp.erro(`Erro ${res.status}: ${res.data}`);
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
            <form>
                <div className="container">
                    <h1>Login</h1>
                    <div className="row">
                        <div className="input-field col s12">
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
                        <button className="btn btn-success"
                            disabled={!this.state.canSubmit}
                            onClick={this.login}
                            type="button"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </form>
        )
    }

}
export default Login;