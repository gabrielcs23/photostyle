import React, { Component } from 'react';
import FormValidator from '../../AreaAdmin/form-utils/FormValidator';
import PopUp from '../../Utils/pop-up/PopUp';
import SelecaoPedido from './SelecaoPedido/SelecaoPedido';
import M from 'materialize-css';
import Cleave from 'cleave.js/react';
import AreaAlunoService from '../AreaAlunoService';

export default class PedidoForm extends Component {
    constructor(props) {
        super(props);

        this.validador = new FormValidator([
            {
                campo: 'responsavel',
                metodo: 'isEmpty',
                validoQuando: false,
                mensagem: 'Digite nome do responsável'
            },
            {
                campo: 'tel',
                metodo: 'isEmpty',
                validoQuando: false,
                mensagem: 'Digite telefone para contato'
            },
            {
                campo: 'email',
                metodo: 'isEmail',
                validoQuando: true,
                mensagem: 'Email inválido'
            }
        ]);

        this.aluno = props.aluno;
        this.turma = props.turma;
        this.escola = props.escola;

        this.state = {
            aluno: props.aluno,
            turma: props.turma,
            responsavel: '',
            tel: '',
            email: '',
            validacao: this.validador.valido(),
            item: undefined,
            extras: undefined,
            valorTotal: 0,
            submitDisabled: false
        }
    }

    componentDidMount() {
        M.updateTextFields();
    }

    inputChangeHandler = (event) => {
        const { name, value } = event.target;

        this.setState({[name]: value});
    }

    submitForm = () => {
        const validacao = this.validador.valida(this.state);

        if (validacao.isValid) {
            if (!this.state.item) {
                PopUp.erro('Escolha uma opção de kit');
                return;
            }
            this.setState({submitDisabled: true});

            const item = this.state.item;
            item.opcao = item.opcao.nome;

            const extras = [];
            for (const extra of this.state.extras.slice()) {
                if (!extra.opcao || (typeof extra.opcao === 'string')) {
                    extras.push(extra);
                } else {
                    extra.opcao.forEach((qtd, opcao) => {
                        if (qtd === 0) {
                            return;
                        }
                        const item = {
                            nome: extra.nome,
                            val: extra.val,
                            qtd: qtd,
                            total: (extra.val * qtd),
                            opcao: opcao,
                        }
                        extras.push(item);
                    });
                }
            }
            
            const pedido = {
                aluno: this.aluno,
                turma: this.turma,
                escola: this.escola,
                responsavel: this.state.responsavel,
                tel: this.state.tel,
                email: this.state.email,
                item: item,
                extras: extras
            };
            AreaAlunoService.fazerPedido(pedido)
                .then(res => {
                    this.props.onPedidoFeito(res.nPedido);
                })
                .catch(error => {
                    if (error.status) {
                        PopUp.erro(`Erro ${error.status}: ${error.data.toString()}`);
                    } else {
                        PopUp.erro(error);
                    }
                    this.setState({submitDisabled: false});
                });
        } else {
            const { responsavel, tel, email } = validacao;
            const campos = [responsavel, tel, email];

            const camposInvalidos = campos.filter(elem => elem.isInvalid);
            camposInvalidos.forEach(campo => PopUp.erro(campo.message));
        }
    }

    selecionaPedido(opcoes) {
        let valorTotal = opcoes.item.val;
        opcoes.extras.forEach(extra => {
            if (!extra.modeloOpcao) {
                valorTotal += (extra.val * extra.qtd)
            } else if(extra.opcao) {
                extra.opcao.forEach(qtd => valorTotal += (extra.val * qtd));
            }
        });
        this.setState({item: opcoes.item, extras: opcoes.extras, valorTotal});
    }

    render() {
        const { responsavel, tel, email } = this.state;
        const telFormat = {
            delimiters: ['(', ') ', '-'],
            blocks: [0, 2, 5, 4]
        }
        return (
            <form>
                <div className="row">
                    <div className="input-field col s12 m6">
                        <label htmlFor="responsavel">Nome do(a) Responsável</label>
                        <input 
                            className="validate"
                            id="responsavel"
                            type="text"
                            name="responsavel"
                            value={responsavel}
                            onChange={this.inputChangeHandler}
                        />
                    </div>
                    <div className="input-field col s12 m6">
                        <label htmlFor="tel">Tel. Contato</label>
                        <Cleave
                            className="validate"
                            id="tel"
                            type="text"
                            name="tel"
                            value={tel}
                            options={telFormat}
                            onChange={this.inputChangeHandler}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="input-field col s12 m6">
                        <label htmlFor="email">Email Contato</label>
                        <input 
                            className="validate"
                            id="email"
                            type="text"
                            name="email"
                            value={email}
                            onChange={this.inputChangeHandler}
                        />
                    </div>
                </div>

                <SelecaoPedido
                    seleciona={opcoes => this.selecionaPedido(opcoes)}
                    opcoesTurma={this.props.opcoes?.turma}
                    opcoesIrmaos={this.props.opcoes?.irmaos}
                />

                <div className="row">
                    <div className="col left">
                        <p>
                            <b>Total:</b> R${this.state.valorTotal}
                        </p>
                    </div>
                </div>

                {/* Submit Form */}
                <div className="row">
                    <div className="col left d-inline-flex">
                        <button
                            className="btn btn-small waves-effect waves-light blue"
                            onClick={() => this.submitForm()}
                            disabled={this.state.submitDisabled}
                            type="button"
                            >
                            <span className="d-inline-flex">
                                <span className="pl-2">Fazer pedido!</span>
                            </span>
                        </button>
                        <div style={{padding: '0 1rem'}}>
                            {this.state.submitDisabled ?
                                <div className="preloader-wrapper small active">
                                    <div className="spinner-layer spinner-green-only">
                                        <div className="circle-clipper left">
                                            <div className="circle"></div>
                                        </div>
                                        <div className="gap-patch">
                                            <div className="circle"></div>
                                        </div>
                                        <div className="circle-clipper right">
                                            <div className="circle"></div>
                                        </div>
                                    </div>
                                </div>
                                : null
                            }
                        </div>
                    </div>
                </div>
            </form>
        )
    }

}