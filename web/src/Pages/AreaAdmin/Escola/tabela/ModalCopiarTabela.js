import React, { Component } from "react";
import '../../../Utils/Modal/Modal.css'
import M from "materialize-css";
import CustomSelect from "../../../Utils/CustomSelect/CustomSelect";

class ModalCopiarTabela extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selecao: null
        }
    }

    componentDidMount() {
        M.Modal.init(this.Modal, {dismissible: false});
    }

    selecionarTabela = (idx) => {
        return this.setState({ selecao: this.props.opcoes[idx] })
    }

    confirmar = (e) => {
        e.preventDefault()
        this.props.confirmar(this.state.selecao)
    }

    getOpcoes = () => {
        return this.props.opcoes.map(op => {
            return {id: op.tabela, nome: op.escola}
        })
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
                    <h4>{this.props.titulo}</h4>
                    {this.props.opcoes ? (
                        <CustomSelect
                            composedKey="copia-select"
                            label="Escola de onde copiar"
                            options={this.getOpcoes()}
                            valorInicial={this.state.selecao}
                            selecionar={idx => this.selecionarTabela(idx)}
                        />
                    ) : null}
                </div>
                <div className="modal-footer mt-5 mb-3">
                    <button className="btn mr-3 modal-close waves-effect waves-light grey darken-1"
                        onClick={e => e.preventDefault()}
                    >
                        Cancelar
                    </button>
                    <button className={`btn mr-3 modal-close waves-effect waves-light red darken-3 ${this.state.selecao ? '' : 'disabled'}`}
                        onClick={this.confirmar}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        );
    }
}

export default ModalCopiarTabela;