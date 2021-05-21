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

class AlunoForm extends Component {

    constructor(props) {
        super(props);

        this.validador = new FormValidator([
            {
                campo: 'nome',
                metodo: 'isEmpty',
                validoQuando: false,
                mensagem: 'Entre com um nome'
            },
            {
                campo: 'matricula',
                metodo: 'isEmpty',
                validoQuando: false,
                mensagem: 'Entre com uma matrícula'
            },
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
                foto: null,
                fotosOpcionais: [],
                irmaoRel: null,
                codigoAcesso: '',
                validacao: this.validador.valido(),
                canSubmit: false
            }
        } else {
            this.state = {
                id: params.id,
                nome: '',
                matricula: '',
                escola: turma ? turma.escola : '',
                turma: turma,
                foto: null,
                fotosOpcionais: [],
                irmaoRel: null,
                codigoAcesso: '',
                validacao: this.validador.valido(),
                canSubmit: false
            }
        }
    }

    componentDidMount() {
        if(this.state.id) {
            AlunoService.getPorId(this.state.id)
                .then(aluno => {
                    this.setState({
                        id: aluno.id,
                        nome: aluno.nome,
                        matricula: aluno.matricula,
                        escola: aluno.escola,
                        turma: aluno.turma,
                        foto: aluno.foto,
                        fotosOpcionais: aluno.fotosOpcionais,
                        irmaoRel: aluno.irmaoRel,
                        codigoAcesso: aluno.codigoAcesso
                    });
                    M.updateTextFields();
                })
                .catch(error => this.props.handleUnauthorized(error))
                .catch(error => PopUp.erro(error));
        } else if(this.props.turma == null) {
            this.props.history.push(Rotas.ESCOLA_LISTA);  
        }
    }

    inputChangeHandler = (event) => {
        const { name, value } = event.target;

        this.setState({
            [name]: value,
            canSubmit: this.state.canSubmit ? this.state.canSubmit : !this.state.canSubmit
        });
    }

    submitForm = () => {
        this.setState({canSubmit: false});
        const validacao = this.validador.valida(this.state);

        if (validacao.isValid) {
            const aluno = this.getAluno();

            let alunoAposPost;
            AlunoService.postAluno(aluno)
                .then(aluno => {
                    alunoAposPost = aluno;
                    if(this.state.id) {
                        PopUp.sucesso('Aluno(a) atualizado(a) com sucesso');
                    } else {
                        PopUp.sucesso('Aluno(a) cadastrado(a) com sucesso');
                    }
                })
                .then(async () => {
                    if (this.state.foto && !this.state.foto.id) {
                        try {
                            await AlunoService.uploadFoto(aluno.id, this.state.foto.formData);
                            return PopUp.sucesso('Foto enviada com sucesso');
                        }
                        catch (e) {
                            return PopUp.erro('Erro no envio da foto');
                        }
                    }
                    if(this.state.fotosOpcionais?.length > 0) {
                        return this.uploadFotosOpcionais(aluno.id);
                    }
                })
                .then(() => {
                    if (this.state.irmaoRel?.fotos.length > 0) {
                        const fotos = this.state.irmaoRel.fotos;
                        return this.uploadFotosIrmaos(alunoAposPost.id, fotos);
                    }
                })
                .then(() => this.props.history.push(Rotas.ALUNO_LISTA))
                .catch(error => this.props.handleUnauthorized(error))
                .catch(() => {
                    PopUp.erro('Erro no cadastro de aluno');
                    this.setState({canSubmit: true});
                });
        } else {
            const { nome, matricula } = validacao;
            const campos = [nome, matricula];

            const camposInvalidos = campos.filter(elem => elem.isInvalid);
            camposInvalidos.forEach(campo => PopUp.erro(campo.message));
        }
    }

    getAluno() {
        const aluno = new Aluno(this.state.nome, this.state.matricula, this.state.escola, this.state.turma);
        if (this.state.id) {
            aluno.id = this.state.id;
            if (this.state.foto?.id) {
                aluno.foto = this.state.foto
            }
        }
        aluno.setIrmaoRel(this.state.irmaoRel);

        return aluno;
    }

    onFotoDrop(arq) {
        if (this.state.foto?.id) {
            PopUp.aviso('Foto individual será substituída');
        }
        const foto = new Foto(arq);
        this.setState({foto: foto, canSubmit: true});
    }

    onFotoOpcionalDrop(arq) {
        const foto = new Foto(arq);
        const fotos = this.state.fotosOpcionais.slice();
        fotos.push(foto);
        this.setState({fotosOpcionais: fotos, canSubmit: true});
    }

    removerFoto() {
        const foto = this.state.foto;
        if (foto.id) {
            AlunoService.removerFoto(this.state.id)
                .then(() => PopUp.sucesso('Foto removida com sucesso'))
                .catch(error => this.props.handleUnauthorized(error))
                .catch(error => PopUp.erro(error));
        }
        this.setState({foto: null});
    }

    uploadFotosOpcionais(idAluno) {
        const fotos = this.state.fotosOpcionais;
        const formData = new FormData();
        fotos.forEach(foto => {
            if (foto.id == null) {
                const file = foto.formData.get('file');
                formData.append('files', file, file.name);
            }
        });

        AlunoService.uploadFotosOpcionais(idAluno, formData)
            .then(fotos => {
                PopUp.sucesso('Foto(s) enviada(s) com sucesso');
                this.setState({fotosOpcionais: fotos});
            })
            .catch(error => this.props.handleUnauthorized(error))
            .catch(() => {
                PopUp.erro('Erro no envio de alguma foto');
            });
    }

    removerFotoOpcional = (idx) => {
        const fotos = this.state.mostruario.fotos.slice();
        if (fotos[idx].id) {
            const bk = fotos[idx];
            AlunoService.removerFotoOpcional(this.state.id, fotos[idx].id)
                .then(() => PopUp.sucesso('Foto removida com sucesso'))
                .catch(error => this.props.handleUnauthorized(error))
                .catch(() => {
                    PopUp.erro('Erro na remoção da foto');
                    fotos.push(bk);
                    this.setState({fotosOpcionais: fotos});
                })
        }
        fotos.splice(idx, 1);
        this.setState({fotosOpcionais: fotos});
    }

    relacionarIrmao(irmaoRel) {
        if (this.validador.valida(this.state)) {
            this.setState({irmaoRel: irmaoRel, canSubmit: true})
        } else {
            this.setState({irmaoRel: irmaoRel});
        }
    }

    uploadFotosIrmaos(id, fotos) {
        const promises = [];
        fotos.forEach(foto => {
            if (foto.id == null) {
                promises.push(AlunoService.adicionarFotoIrmao(id, foto.formData));
            }
        });
        return Promise.allSettled(promises)
            .then(resultados => resultados.filter(resultado => resultado.status === 'rejected'))
            .then(resultados => resultados.length === 0 ? PopUp.sucesso('Foto(s) enviadas com sucesso') : PopUp.erro(`Erro no envio de ${resultados.length} foto(s)`));
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
                                >
                                Cancelar
                            </button>
                        </NavLink>
                    </div>
                    <div className="col right">
                        <button
                            className="btn btn-small waves-effect waves-light blue"
                            disabled={!this.state.canSubmit}
                            onClick={() => this.submitForm()}
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
                    fotos={this.state.foto ? [this.state.foto] : null}
                    multiple={false}
                    onFotoDrop={foto => this.onFotoDrop(foto)}
                    removerFoto={() => this.removerFoto()} 
                />

                <h4>Fotos opcionais</h4>
                <FotoDropzone
                    fotos={this.state.fotosOpcionais.slice()}
                    onFotoDrop={foto => this.onFotoOpcionalDrop(foto)}
                    removerFoto={() => this.removerFotoOpcional()}
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
