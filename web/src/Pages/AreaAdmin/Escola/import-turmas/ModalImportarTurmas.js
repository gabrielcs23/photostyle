import React, { Component } from "react";
import '../../../Utils/Modal/Modal.css'
import M from "materialize-css";
import PlanilhaDropZone from "../../../Utils/PlanilhaDropZone/PlanilhaDropZone";
import LoadingBotao from "../../../Utils/Loading/LoadingBotao";

class ModalImportarTurmas extends Component {

    constructor(props) {
        super(props);

        this.state = {
            file: null,
            loading: false
        }
    }

    componentDidMount() {
        M.Modal.init(this.Modal, { dismissible: false });
    }

    confirmar = (e) => {
        e.preventDefault()
        this.setState({ loading: true })
        const closeModalHook = () => M.Modal.getInstance(this.Modal).close();
        this.props.confirmar(this.state.file, closeModalHook)
    }

    cancelar = (e) => {
        e.preventDefault()
        this.setState({ file: null })
    }

    onDrop = (arq) => {
        this.setState({ file: arq })
    }

    close = () => {
        M.Modal.getInstance(this.Modal).close();
    }

    isLoading = () => {
        return this.state.loading
    }

    render() {
        return (
            <div
                ref={Modal => {
                    this.Modal = Modal;
                }}
                id={this.props.idModal}
                className="modal"
            >

                <div className="modal-content">
                    <h4>Importar Turmas e Alunos</h4>
                    <PlanilhaDropZone
                        onDrop={this.onDrop}
                    />
                </div>
                <div className="modal-footer mt-5 mb-3">
                    <button className={`btn mr-3 modal-close waves-effect waves-light grey darken-1 ${!this.isLoading() ? '' : 'disabled'}`}
                        onClick={e => e.preventDefault()}
                    >
                        Cancelar
                    </button>
                    <button className={`btn mr-3 waves-effect waves-light green darken-3 ${this.state.file && !this.isLoading() ? '' : 'disabled'}`}
                        onClick={this.confirmar}
                    >
                        {this.isLoading()
                            ? (
                                <LoadingBotao />
                            ) : null
                        }
                        Confirmar
                    </button>
                </div>
            </div>
        );
    }
}

export default ModalImportarTurmas;
