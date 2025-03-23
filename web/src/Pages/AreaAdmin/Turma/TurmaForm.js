import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import M from 'materialize-css';
import Rotas from '../AreaAdminRotas';
import TurmaService from './TurmaService';
import Turma from '../../../Model/Turma';
import Foto from '../../../Model/Foto';
import FormValidator from '../form-utils/FormValidator';
import PopUp from '../../Utils/pop-up/PopUp';
import FotoDropzone from '../../Utils/FotoDropzone/FotoDropzone';
import LoadingBotao from '../../Utils/Loading/LoadingBotao';

class TurmaForm extends Component {

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

        if (!params.id) {
            this.state = {
                id: '',
                nome: '',
                escola: this.props.escola,
                fotos: [],
                validacao: this.validador.valido(),
                canSubmit: false,
                loading: false,
                atualizarTurma: false
            }
        } else {
            this.state = {
                id: params.id,
                nome: '',
                escola: '',
                fotos: [],
                validacao: this.validador.valido(),
                canSubmit: false,
                loading: false,
                atualizarTurma: false
            }
        }
    }

    componentDidMount() {
        if (this.state.id) {
            TurmaService.getPorId(this.state.id)
                .then(turma => {
                    this.setState({
                        id: turma.id,
                        nome: turma.nome,
                        escola: turma.escola,
                        fotos: turma.fotos ? turma.fotos : []
                    });
                    M.updateTextFields();
                })
                .catch(error => this.props.handleUnauthorized(error))
                .catch(() => PopUp.erro('Erro no cadastro de turma'));
        } else if (this.props.escola == null) {
            this.props.history.push(Rotas.ESCOLA_LISTA);
        }
    }

    inputChangeHandler = (event) => {
        const { name, value } = event.target;

        this.setState({
            [name]: value,
            canSubmit: this.state.canSubmit ? this.state.canSubmit : !this.state.canSubmit,
            atualizarTurma: true
        });
    }

    onFotoDrop = (arq) => {
        const foto = new Foto(arq);
        const fotos = this.state.fotos.slice();
        fotos.push(foto);
        this.setState({ fotos: fotos, canSubmit: true });
    }

    removerFoto = (idx) => {
        const fotos = this.state.fotos.slice();
        if (fotos[idx].id) {
            const bk = fotos[idx];
            TurmaService.removerFoto(this.state.id, fotos[idx].id)
                .then(() => PopUp.sucesso('Foto removida com sucesso'))
                .catch(error => this.props.handleUnauthorized(error))
                .catch(() => {
                    PopUp.erro('Erro na remoção da foto');
                    fotos.push(bk);
                    this.setState({ fotos: fotos });
                })
        }
        fotos.splice(idx, 1);
        this.setState({ fotos: fotos });
    }

    submitForm = () => {
        this.setState({ canSubmit: false });
        const validacao = this.validador.valida(this.state);

        if (validacao.isValid) {
            this.setState({ loading: true })
            const turma = new Turma(this.state.nome, this.state.escola);
            if (this.state.id) {
                turma.id = this.state.id;
            }

            this.submitFormAsync(turma)
                .finally(() => this.setState({ loading: false }))
        } else {
            const { nome } = validacao;
            const campos = [nome];

            const camposInvalidos = campos.filter(elem => elem.isInvalid);
            camposInvalidos.forEach(campo => PopUp.erro(campo.message));
        }
    }

    async submitFormAsync(turma) {
        if (this.state.atualizarTurma) {
            turma = await TurmaService.postTurma(turma)
                .then(turmaAtualizada => {
                    this.setState({ atualizarTurma: false })
                    if (this.state.id) {
                        PopUp.sucesso('Turma atualizada com sucesso');
                    } else {
                        PopUp.sucesso('Turma cadastrada com sucesso');
                    }
                    return turmaAtualizada
                })
                .catch(error => this.props.handleUnauthorized(error))
                .catch(() => {
                    PopUp.erro('Erro no cadastro de turma');
                    this.setState({ canSubmit: true });
                    return undefined
                })
        }
        if (turma == null) {
            return
        }
        if (this.state.fotos?.length > 0) {
            let { fotos } = this.state;
            fotos = fotos.filter(foto => foto.id == null)
            if (fotos?.length > 0) {
                await this.uploadFotosAsync(turma.id, fotos);
            }
        }
        this.props.history.push(Rotas.TURMA_LISTA);
        this.props.history.push(Rotas.TURMA_EDICAO.replace(':id', turma.id));
    }

    async uploadFotosAsync(id, fotos) {
        let fotosEnviadasComSucesso = 0
        for (const foto of fotos) {
            try {
                await TurmaService.adicionarFoto(id, foto.formData)
                fotosEnviadasComSucesso++
            } catch (e) {
                break
            }
        }
        fotosEnviadasComSucesso === fotos.length
            ? PopUp.sucesso('Foto(s) enviadas com sucesso')
            : PopUp.erro(`Apenas ${fotosEnviadasComSucesso} foto(s) foram enviadas com sucesso`)
    }

    render() {
        const { nome } = this.state;
        return (
            <form>
                <div className="row">
                    <div className="col left">
                        <NavLink to={Rotas.TURMA_LISTA}>
                            <button
                                className="btn btn-small waves-effect waves-light grey darken-1"
                                disabled={this.state.loading}
                            >
                                Cancelar
                            </button>
                        </NavLink>
                    </div>
                    <div className="col right">
                        <button
                            className="btn btn-small waves-effect waves-light blue"
                            disabled={!this.state.canSubmit || this.state.loading}
                            onClick={this.submitForm}
                            type="button"
                        >
                            <span className="d-inline-flex">
                                {this.state.loading
                                    ? (
                                        <LoadingBotao />
                                    ) : null
                                }
                                <i className="material-icons">save</i>
                                <span className="pl-2">Salvar</span>
                            </span>
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s12">
                        <label htmlFor="nome">Nome da Turma</label>
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

                <FotoDropzone
                    fotos={this.state.fotos.slice()}
                    onFotoDrop={this.onFotoDrop}
                    removerFoto={this.removerFoto}
                    multiple={true}
                />

            </form>
        )
    }

}
export default TurmaForm;
