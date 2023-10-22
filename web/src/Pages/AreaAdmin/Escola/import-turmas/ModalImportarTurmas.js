import React, { Component } from "react";
import '../../../Utils/Modal/Modal.css'
import M from "materialize-css";
import PlanilhaDropZone from "../../../Utils/PlanilhaDropZone/PlanilhaDropZone";

class ModalImportarTurmas extends Component {

    constructor(props) {
        super(props);

        this.state = {
            file: null
        }
    }

    componentDidMount() {
        M.Modal.init(this.Modal, { dismissible: false });
    }

    confirmar = (e) => {
        e.preventDefault()
        this.props.confirmar(this.state.file)
    }

    onDrop = (arq) => {
        this.setState({ file: arq })
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
                    <button className="btn mr-3 modal-close waves-effect waves-light grey darken-1"
                        onClick={e => e.preventDefault()}
                    >
                        Cancelar
                    </button>
                    <button className={`btn mr-3 modal-close waves-effect waves-light green darken-3 ${this.state.file ? '' : 'disabled'}`}
                        onClick={this.confirmar}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        );
    }
}

export default ModalImportarTurmas;
