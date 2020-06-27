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
                alunos: [],
                fotos: [],
                validacao: this.validador.valido(),
                canSubmit: false
            }
        } else {
            this.state = {
                id: params.id,
                nome: '',
                escola: '',
                alunos: [],
                fotos: [],
                validacao: this.validador.valido(),
                canSubmit: false
            }
        }
    }

    componentDidMount() {
        if(this.state.id) {
            TurmaService.getPorId(this.state.id)
                .then(turma => {
                    this.setState({
                        id: turma.id,
                        nome: turma.nome,
                        escola: turma.escola,
                        alunos: turma.alunos ? turma.alunos : [],
                        fotos: turma.fotos ? turma.fotos : []
                    });
                    M.updateTextFields();
                })
                .catch(error => PopUp.erro(error));
        } else if(this.props.escola == null) {
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

    getFotos() {
        const fotos = this.state.fotos.slice();
        return fotos.filter(foto => foto.formData != null).map(foto => foto.formData.get('file'));
    }

    onFotoDrop = (arq) => {
        const formData = new FormData();
        formData.append('file', arq, arq.name);
        const foto = new Foto();
        foto.formData = formData;
        const fotos = this.state.fotos.slice();
        fotos.push(foto);
        this.setState({fotos: fotos, canSubmit: true});
    }

    removerFoto = (idx) => {
        const fotos = this.state.fotos.slice();
        fotos.splice(idx, 1);
        this.setState({fotos: fotos});
    }

    submitForm = () => {
        this.setState({canSubmit: false});
        const validacao = this.validador.valida(this.state);

        if (validacao.isValid) {
            const turma = new Turma(this.state.nome, this.state.escola);
            if (this.state.id) {
                turma.id = this.state.id;
                turma.alunos = this.state.alunos;
            }

            TurmaService.postTurma(turma)
                .then(res => res.data)
                .then(turma => {
                    if(this.state.fotos?.length > 0) {
                        this.uploadFotos();
                    }
                    if(this.state.id) {
                        this.props.history.push(Rotas.TURMA_LISTA);
                        PopUp.sucesso('Turma atualizada com sucesso');
                    } else {
                        this.props.selecionar(turma);
                        this.props.history.push(Rotas.ALUNO_NOVO);
                        PopUp.sucesso('Turma cadastrada com sucesso');
                    }
                })
                .catch(error => {
                    PopUp.erro(error);
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
        const { id, fotos } = this.state;
        const promises = [];
        fotos.forEach(foto => {
            if (foto.id == null) {
                promises.push(TurmaService.adicionarFoto(id, foto.formData));
            }
        });
        Promise.allSettled(promises)
            .then(resultados => resultados.filter(resultado => resultado.status === 'rejected'))
            .then(resultados => resultados.length === 0 ? PopUp.sucesso('Fotos enviadas com sucesso') : PopUp.erro(`Erro no envio de ${resultados.length}`));
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
                                >
                                Cancelar
                            </button>
                        </NavLink>
                    </div>
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
                    fotos={this.getFotos()}
                    onFotoDrop={this.onFotoDrop}
                    removerFoto={this.removerFoto} 
                />

            </form>
        )
    }

}
export default TurmaForm;
