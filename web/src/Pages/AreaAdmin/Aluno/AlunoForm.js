import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Rotas from '../AreaAdminRotas';
import AlunoService from './AlunoService';
import Aluno from '../../../Model/Aluno';
import FormValidator from '../form-utils/FormValidator';
import PopUp from '../../Utils/pop-up/PopUp';
import M from 'materialize-css';
import IrmaoForm from './irmao-form/IrmaoForm';
import FotoDropzone from '../../Utils/FotoDropzone/FotoDropzone';
import Foto from '../../../Model/Foto';
import LoadingBotao from '../../Utils/Loading/LoadingBotao';

class AlunoForm extends Component {

    constructor(props) {
        super(props);

        this.validador = new FormValidator([
            {
                campo: 'nome',
                metodo: 'isEmpty',
                validoQuando: false,
                mensagem: 'Entre com um nome'
            }
        ]);

        const { match: { params } } = this.props;

        const { turma } = this.props;
        if (!params.id) {
            this.state = {
                id: '',
                nome: '',
                matricula: '',
                escola: turma ? turma.escola : '',
                turma: turma,
                fotos: [],
                fotosOpcionais: [],
                irmaoRel: null,
                codigoAcesso: '',
                validacao: this.validador.valido(),
                canSubmit: false,
                loading: false,
                atualizarAluno: false
            }
        } else {
            this.state = {
                id: params.id,
                nome: '',
                matricula: '',
                escola: turma ? turma.escola : '',
                turma: turma,
                fotos: [],
                fotosOpcionais: [],
                irmaoRel: null,
                codigoAcesso: '',
                validacao: this.validador.valido(),
                canSubmit: false,
                loading: false,
                atualizarAluno: false
            }
        }
    }

    componentDidMount() {
        if (this.state.id) {
            AlunoService.getPorId(this.state.id)
                .then(aluno => {
                    this.setState({
                        id: aluno.id,
                        nome: aluno.nome,
                        matricula: aluno.matricula,
                        escola: aluno.escola,
                        turma: aluno.turma,
                        fotos: aluno.fotos,
                        fotosOpcionais: aluno.fotosOpcionais,
                        irmaoRel: aluno.irmaoRel,
                        codigoAcesso: aluno.codigoAcesso
                    });
                    M.updateTextFields();
                })
                .catch(error => this.props.handleUnauthorized(error))
                .catch(error => PopUp.erro(error));
        } else if (this.props.turma == null) {
            this.props.history.push(Rotas.ESCOLA_LISTA);
        }
    }

    inputChangeHandler = (event) => {
        const { name, value } = event.target;

        this.setState({
            [name]: value,
            canSubmit: this.state.canSubmit ? this.state.canSubmit : !this.state.canSubmit,
            atualizarAluno: true
        });
    }

    submitForm = () => {
        this.setState({ canSubmit: false });
        const validacao = this.validador.valida(this.state);

        if (validacao.isValid) {
            this.setState({ loading: true })

            this.submitFormAsync()
                .finally(() => this.setState({ loading: false }))
        } else {
            const { nome, matricula } = validacao;
            const campos = [nome, matricula];

            const camposInvalidos = campos.filter(elem => elem.isInvalid);
            camposInvalidos.forEach(campo => PopUp.erro(campo.message));
        }
    }

    async submitFormAsync() {
        let aluno = this.getAluno();

        if (this.state.atualizarAluno) {
            aluno = await AlunoService.postAluno(aluno)
                .then(alunoAtualizado => {
                    if (this.state.id) {
                        PopUp.sucesso('Aluno(a) atualizado(a) com sucesso');
                    } else {
                        PopUp.sucesso('Aluno(a) cadastrado(a) com sucesso');
                    }
                    return alunoAtualizado
                })
                .catch(error => this.props.handleUnauthorized(error))
                .catch(() => {
                    PopUp.erro('Erro no cadastro de aluno');
                    this.setState({ canSubmit: true });
                    return undefined
                });
        }

        if (aluno == null) {
            return
        }

        if (this.state.fotos?.length > 0) {
            let fotos = this.state.fotos.slice();
            fotos = fotos.filter(foto => foto.id == null)
            if (fotos?.length > 0) {
                await this.uploadFotos(aluno.id, fotos);
            }
        }

        if (this.state.fotosOpcionais?.length > 0) {
            let fotosOpcionais = this.state.fotosOpcionais.slice();
            fotosOpcionais = fotosOpcionais.filter(foto => foto.id == null)
            if (fotosOpcionais?.length > 0) {
                await this.uploadFotosOpcionais(aluno.id, fotosOpcionais);
            }
        }

        if (this.state.irmaoRel?.fotos.length > 0) {
            let fotosIrmaos = this.state.irmaoRel.fotos.slice();
            fotosIrmaos = fotosIrmaos.filter(foto => foto.id == null)
            if (fotosIrmaos?.length > 0) {
                await this.uploadFotosIrmaos(aluno.id, fotosIrmaos);
            }
        }

        this.props.history.push(Rotas.ALUNO_LISTA)
        this.props.history.push(Rotas.ALUNO_EDICAO.replace(':id', aluno.id));
    }

    getAluno() {
        const aluno = new Aluno(this.state.nome, this.state.matricula, this.state.escola, this.state.turma);
        if (this.state.id) {
            aluno.id = this.state.id;
        }
        aluno.setIrmaoRel(this.state.irmaoRel);

        return aluno;
    }

    onFotoDrop(arq) {
        const foto = new Foto(arq);
        const fotos = this.state.fotos.slice();
        fotos.push(foto);
        this.setState({ fotos: fotos, canSubmit: true });
    }

    onFotoOpcionalDrop(arq) {
        const foto = new Foto(arq);
        const fotos = this.state.fotosOpcionais.slice();
        fotos.push(foto);
        this.setState({ fotosOpcionais: fotos, canSubmit: true });
    }

    async uploadFotos(idAluno, fotos) {
        const formData = new FormData();
        fotos.forEach(foto => {
            if (foto.id == null) {
                const file = foto.formData.get('file');
                formData.append('files', file, file.name);
            }
        });

        try {
            fotos = await AlunoService.uploadFotos(idAluno, formData)
            PopUp.sucesso('Foto(s) enviada(s) com sucesso');
        } catch (e) {
            PopUp.erro('Erro no envio de alguma foto');
        }
    }

    removerFoto = (idx) => {
        const fotos = this.state.fotos.slice();
        if (fotos[idx].id) {
            const bk = fotos[idx];
            AlunoService.removerFoto(this.state.id, fotos[idx].id)
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

    async uploadFotosOpcionais(idAluno, fotos) {
        const formData = new FormData();
        fotos.forEach(foto => {
            if (foto.id == null) {
                const file = foto.formData.get('file');
                formData.append('files', file, file.name);
            }
        });

        try {
            fotos = await AlunoService.uploadFotosOpcionais(idAluno, formData)
            PopUp.sucesso('Foto(s) opcionais enviada(s) com sucesso');
        } catch (e) {
            PopUp.erro('Erro no envio de alguma foto opcional');
        }
    }

    removerFotoOpcional = (idx) => {
        const fotos = this.state.fotosOpcionais.slice();
        if (fotos[idx].id) {
            const bk = fotos[idx];
            AlunoService.removerFotoOpcional(this.state.id, fotos[idx].id)
                .then(() => PopUp.sucesso('Foto removida com sucesso'))
                .catch(error => this.props.handleUnauthorized(error))
                .catch(() => {
                    PopUp.erro('Erro na remoção da foto');
                    fotos.push(bk);
                    this.setState({ fotosOpcionais: fotos });
                })
        }
        fotos.splice(idx, 1);
        this.setState({ fotosOpcionais: fotos });
    }

    relacionarIrmao(irmaoRel) {
        if (this.validador.valida(this.state)) {
            this.setState({ irmaoRel: irmaoRel, canSubmit: true, atualizarAluno: true })
        } else {
            this.setState({ irmaoRel: irmaoRel, atualizarAluno: true });
        }
    }

    async uploadFotosIrmaos(id, fotos) {
        let fotosEnviadasComSucesso = 0
        for (const foto of fotos) {
            try {
                await AlunoService.adicionarFotoIrmao(id, foto.formData)
                fotosEnviadasComSucesso++
            } catch (e) {
                break
            }
        }
        fotosEnviadasComSucesso === fotos.length
            ? PopUp.sucesso('Foto(s) com irmão enviada(s) com sucesso')
            : PopUp.erro(`Apenas ${fotosEnviadasComSucesso} foto(s) foram enviadas com sucesso`)
    }

    render() {
        const { nome, matricula, codigoAcesso } = this.state;
        return (
            <form>
                <div className="row">
                    <div className="col left">
                        <NavLink to={Rotas.ALUNO_LISTA}>
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
                            onClick={() => this.submitForm()}
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
                        <label htmlFor="nome">Nome do Aluno</label>
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
                <div className="row">
                    <div className="input-field col s12 m6">
                        <label htmlFor="matricula">Matrícula</label>
                        <input
                            className="validate"
                            id="matricula"
                            type="text"
                            name="matricula"
                            value={matricula}
                            onChange={this.inputChangeHandler}
                        />
                    </div>
                    {this.state.id ?
                        <div className="input-field col s12 m6">
                            <label htmlFor="codAcesso">Código de Acesso</label>
                            <input
                                className="validate"
                                id="codAcesso"
                                type="text"
                                name="codAcesso"
                                disabled={true}
                                value={codigoAcesso}
                            />
                        </div>
                        : null
                    }
                </div>

                <h4>Foto individual</h4>
                <FotoDropzone
                    fotos={this.state.fotos.slice()}
                    multiple={true}
                    onFotoDrop={foto => this.onFotoDrop(foto)}
                    removerFoto={this.removerFoto}
                />

                <h4>Fotos opcionais</h4>
                <FotoDropzone
                    fotos={this.state.fotosOpcionais.slice()}
                    onFotoDrop={foto => this.onFotoOpcionalDrop(foto)}
                    removerFoto={this.removerFotoOpcional}
                    multiple={true}
                />

                {this.state.escola ?
                    <IrmaoForm
                        escolaId={this.state.escola.id}
                        irmaoRel={this.state.irmaoRel}
                        relacionarIrmao={irmaoRel => this.relacionarIrmao(irmaoRel)}
                        alunoId={this.state.id}
                    />
                    : null
                }
            </form>
        );
    }

}
export default AlunoForm;
