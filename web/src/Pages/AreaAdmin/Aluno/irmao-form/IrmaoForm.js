import React, { Component } from 'react';
import IrmaoRel from '../../../../Model/IrmaoRel'
import IrmaoSelect from './IrmaoSelect';

class IrmaoForm extends Component {

    constructor(props) {
        super(props);

        this.escolaId = this.props.escolaId;
        this.alunoId = this.props.alunoId;
        this.state = {
            id: '',
            irmaos: [],
            fotos: [],
            addIrmaoDisabled: false
        }

    }

    relacionarIrmao(irmao, idx) {
        const irmaos = this.state.irmaos.slice();
        irmaos[idx] = irmao;
        this.setState({irmaos: irmaos, addIrmaoDisabled: false});

        const irmaoRel = new IrmaoRel(irmaos, this.state.fotos);
        if (this.state.id) {
            irmaoRel.id = this.state.id;
        }
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
                    irmao={irmao}
                    escolaId={this.escolaId}
                    alunoId={this.alunoId}
                    disabled={false} 
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
