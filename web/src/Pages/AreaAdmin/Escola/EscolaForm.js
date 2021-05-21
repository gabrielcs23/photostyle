import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Rotas from '../AreaAdminRotas';
import EscolaService from './EscolaService';
import TabelaPreco from './tabela/TabelaPreco';
import Escola from '../../../Model/Escola';
import FormValidator from '../form-utils/FormValidator';
import PopUp from '../../Utils/pop-up/PopUp'
import M from 'materialize-css';
import FotoDropzone from '../../Utils/FotoDropzone/FotoDropzone';
import Foto from '../../../Model/Foto';

class EscolaForm extends Component {
    
    constructor(props) {
        super(props);

        this.validador = new FormValidator([
            {
                campo: 'nome',
                metodo: 'isEmpty',
                validoQuando: false,
                mensagem: 'Entre com um nome'
            },
        ]);

        const { match: { params } } = this.props;

        this.state = {
            id: '',
            nome: '',
            apelido: '',
            mostruario: {
                id: '',
                fotos: []
            },
            validacao: this.validador.valido(),
            canSubmit: false
        };

        if (params.id) {
            this.state.id = params.id;
        }
    }

    componentDidMount() {
        if(this.state.id) {
            EscolaService.getPorId(this.state.id)
                .then(escola => {
                    this.setState({
                        id: escola.id,
                        nome: escola.nome,
                        apelido: escola.apelido
                    });
                    M.updateTextFields();
                })
                .catch(error => this.props.handleUnauthorized(error))
                .catch(() => PopUp.erro('Erro no cadastro de turma'));
            EscolaService.getMostruario(this.state.id)
                .then(mostruario => {
                    if (mostruario.fotos == null) {
                        mostruario.fotos = [];
                    }
                    this.setState({ mostruario });
                    M.updateTextFields();
                })
                .catch(error => this.props.handleUnauthorized(error))
                .catch(() => PopUp.erro('Erro'));
        }
    }

    inputChangeHandler = (event) => {
        const { name, value } = event.target;

        this.setState({
            [name]: value,
            canSubmit: this.state.canSubmit ? this.state.canSubmit : !this.state.canSubmit
        });
    }

    onFotoDrop = (arq) => {
        const foto = new Foto(arq);
        const mostruario = this.state.mostruario;
        mostruario.fotos.push(foto);
        this.setState({mostruario: mostruario, canSubmit: true});
    }

    removerFoto = (idx) => {
        const fotos = this.state.mostruario.fotos.slice();
        const mostruario = this.state.mostruario;
        if (fotos[idx].id) {
            const bk = fotos[idx];
            EscolaService.removerFotoMostruario(mostruario.id, fotos[idx].id)
                .then(() => PopUp.sucesso('Foto removida com sucesso'))
                .catch(error => this.props.handleUnauthorized(error))
                .catch(() => {
                    PopUp.erro('Erro na remoção da foto');
                    fotos.push(bk);
                    mostruario.fotos = fotos;
                    this.setState({mostruario: mostruario});
                })
        }
        fotos.splice(idx, 1);
        mostruario.fotos = fotos
        this.setState({mostruario: mostruario});
    }

    submitForm = () => {
        this.setState({canSubmit: false});
        const validacao = this.validador.valida(this.state);

        if (this.state.id) {
            return this.uploadFotos();
        }
        
        if (validacao.isValid) {
            const escola = new Escola(this.state.nome);
            escola.apelido = this.state.apelido;
            EscolaService.postEscola(escola)
                .then(escola => {
                    this.props.selecionar(escola);
                    PopUp.sucesso('Escola cadastrada com sucesso');
                })
                .catch(error => this.props.handleUnauthorized(error))
                .catch(() => {
                    PopUp.erro('Erro no cadastro de escola');
                    this.setState({canSubmit: true});
                });
        } else {
            const { nome } = validacao;
            const campos = [nome];

            const camposInvalidos = campos.filter(elem => elem.isInvalid);
            camposInvalidos.forEach(campo => PopUp.erro(campo.message));
        }
    }

    uploadFotos() {
        const { fotos } = this.state.mostruario;
        const formData = new FormData();
        fotos.forEach(foto => {
            if (foto.id == null) {
                const file = foto.formData.get('file');
                formData.append('files', file, file.name);
            }
        });
        const voltar = () => this.props.history.push(Rotas.ESCOLA_LISTA);

        EscolaService.adicionarFotosMostruario(this.state.mostruario.id, formData)
            .then(() => {
                PopUp.sucesso('Foto(s) enviada(s) com sucesso');
                voltar();
            })
            .catch(error => this.props.handleUnauthorized(error))
            .catch(() => {
                PopUp.erro('Erro no envio de alguma foto');
                voltar();
            });
    }

    downloadCodigoAlunos(id) {
        EscolaService.downloadCodigoAlunos(id)
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const a = document.createElement('a');
                a.href = url;
                a.download = 'listagem_codigos.xlsx';
                a.click();
            })
            .catch(error => this.props.handleUnauthorized(error))
            .catch(() => PopUp.erro('Erro'));
    }

    render() {
        const { nome, apelido } = this.state;
        return (
            <>
                <form>
                    <div className="row">
                        <div className="col left">
                            <NavLink to={Rotas.ESCOLA_LISTA}>
                                <button 
                                    className="btn btn-small waves-effect waves-light grey darken-1"
                                    >
                                    Cancelar
                                </button>
                            </NavLink>
                        </div>
                        {this.state.id ?
                            <div className="col left">
                                <button
                                    className="btn btn-small waves-effect waves-light green"
                                    onClick={() => this.downloadCodigoAlunos(this.state.id)}
                                    type="button"
                                    >
                                    <span className="d-inline-flex">
                                        <i className="material-icons">download</i>
                                        <span className="pl-2">Código Alunos</span>
                                    </span>
                                </button>
                            </div>
                            : null
                        }
                        <div className="col right">
                            <button
                                className="btn btn-small waves-effect waves-light blue"
                                disabled={!this.state.canSubmit}
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
                                disabled={this.state.id}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s6">
                            <label htmlFor="apelido">Apelido</label>
                            <input 
                                id="nome"
                                type="text"
                                name="apelido"
                                value={apelido}
                                onChange={this.inputChangeHandler}
                                disabled={this.state.id}
                            />
                        </div>
                    </div>

                    {this.state.id ? 
                        <>
                            <h5 className="mb-4">Fotos Mostruário</h5>
                            <FotoDropzone
                                fotos={this.state.mostruario.fotos.slice()}
                                onFotoDrop={this.onFotoDrop}
                                removerFoto={this.removerFoto}
                                multiple={true}
                            />
                        </>
                        : null
                    }

                </form>

                {this.state.id ?
                    <div style={{marginTop: "2.5rem"}}>
                        <TabelaPreco idEscola={this.state.id} handleUnauthorized={this.props.handleUnauthorized} />
                    </div>                    
                    : null
                }
            </>
        )
    }


}
export default EscolaForm;
