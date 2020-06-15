import React, { Component } from "react";
import './Modal.css'
import M from "materialize-css";

class Modal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            titulo: this.props.titulo,
            mensagem: this.props.mensagem,
            idModal: this.props.idModal
        }
    }

    componentDidMount() {
        M.Modal.init(this.Modal, {dismissible: false});
    }

    render() {
        return (
            <div
                ref={Modal => {
                this.Modal = Modal;
                }}
                id={this.state.idModal}
                className="modal"
            >

                <div className="modal-content">
                    <h4>{this.state.titulo}</h4>
                    {this.state.mensagem}
                </div>
                <div className="modal-footer">
                    <button className="btn mr-3 modal-close waves-effect waves-light grey darken-1">
                        Cancelar
                    </button>
                    <button className="btn mr-3 modal-close waves-effect waves-light red darken-3"
                        onClick={this.props.confirmar}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        );
    }
}

export default Modal;