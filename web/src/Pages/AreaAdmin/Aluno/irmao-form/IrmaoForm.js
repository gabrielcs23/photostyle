import React, { Component } from 'react';
import IrmaoRel from '../../../../Model/IrmaoRel'
import IrmaoSelect from './IrmaoSelect';

class IrmaoForm extends Component {

    constructor(props) {
        super(props);

        this.escolaId = this.props.escolaId;
        this.state = {
            id: '',
            irmaos: [],
            fotos: []
        }

    }

    relacionarIrmao() {
        const irmaoRel = new IrmaoRel(this.state.irmaos, this.state.fotos);
        if (this.state.id) {
            irmaoRel.id = this.state.id;
        }
        this.props.relacionarIrmao(irmaoRel);
    }

    render() {
        return (
            <>
                <h4>Irmãos</h4>
                <IrmaoSelect escolaId={this.escolaId} disabled={false} />
            </>
        )
    }

}
export default IrmaoForm;
