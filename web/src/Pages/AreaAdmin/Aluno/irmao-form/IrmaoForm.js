import React, { Component } from 'react';
import IrmaoRel from '../../../../Model/IrmaoRel'
import IrmaoSelect from './IrmaoSelect';

class IrmaoForm extends Component {

    constructor(props) {
        super(props);

        if (this.props.irmaoRel) {
            const { irmaoRel } = this.props;
            this.state = {
                id: irmaoRel.id,
                irmaos: irmaoRel.irmaos.filter(irmao => irmao.id !== this.props.alunoId),
                fotos: irmaoRel.fotos,
                addIrmaoDisabled: false
            }
        } else {
            this.state = {
                id: null,
                irmaos: [],
                fotos: [],
                addIrmaoDisabled: false,
            }
        }

    }

    componentDidUpdate(prevProps) {
        if (!prevProps.irmaoRel && this.props.irmaoRel && this.state.irmaos?.length === 0) {
            const { irmaoRel } = this.props;
            this.setState({
                id: irmaoRel.id,
                irmaos: irmaoRel.irmaos.filter(irmao => irmao.id !== this.props.alunoId),
                fotos: irmaoRel.fotos
            });
        }
    }

    relacionarIrmao(irmao, idx) {
        const irmaos = this.state.irmaos.slice();
        irmaos[idx] = irmao;
        this.setState({irmaos: irmaos, addIrmaoDisabled: false});

        const irmaoRel = new IrmaoRel(irmaos, this.state.fotos, this.state.id);
        this.props.relacionarIrmao(irmaoRel);
    }

    adicionarIrmao() {
        const irmaos = this.state.irmaos.slice();
        irmaos.push({});
        this.setState({irmaos: irmaos, addIrmaoDisabled: true});
    }

    render() {

        const rows = this.state.irmaos.map((irmao, idx) => {
            return (
                <IrmaoSelect
                    key={idx}
                    composedKey={`${idx}`}
                    irmao={irmao}
                    escolaId={this.props.escolaId}
                    alunoId={this.props.alunoId}
                    selecionar={(irmao) => this.relacionarIrmao(irmao, idx)}
                />
            )
        })

        return (
            <>
                <h4>Irmãos</h4>
                <button className="btn btn-small waves-effect waves-light blue mb-2"
                    disabled={this.state.addIrmaoDisabled}
                    type="button"
                    onClick={() => this.adicionarIrmao()}
                >
                    <span className="d-inline-flex">
                        <i className="letf material-icons">add</i>
                        Adicionar Irmão
                    </span>
                </button>
                {rows}
            </>
        )
    }

}
export default IrmaoForm;
