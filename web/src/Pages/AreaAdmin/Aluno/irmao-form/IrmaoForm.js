import React, { Component } from 'react';
import IrmaoRel from '../../../../Model/IrmaoRel'
import Foto from '../../../../Model/Foto';
import PopUp from '../../../Utils/pop-up/PopUp';
import FotoDropzone from '../../../Utils/FotoDropzone/FotoDropzone';
import AlunoService from '../AlunoService';
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
                addIrmaoDisabled: false,
                fotosDisabled: false
            }
        } else {
            this.state = {
                id: null,
                irmaos: [],
                fotos: [],
                addIrmaoDisabled: false,
                fotosDisabled: true
            }
        }

    }

    componentDidUpdate(prevProps) {
        if (!prevProps.irmaoRel && this.props.irmaoRel && this.state.irmaos?.length === 0) {
            const { irmaoRel } = this.props;
            this.setState({
                id: irmaoRel.id,
                irmaos: irmaoRel.irmaos.filter(irmao => irmao.id !== this.props.alunoId),
                fotos: irmaoRel.fotos,
                fotosDisabled: false
            });
        }
    }

    attRelacionamento(irmaos) {
        const irmaoRel = new IrmaoRel(irmaos, this.state.fotos, this.state.id);
        this.props.relacionarIrmao(irmaoRel);
    }

    relacionarIrmao(irmao, idx) {
        const irmaos = this.state.irmaos.slice();
        irmaos[idx] = irmao;
        this.setState({irmaos: irmaos, addIrmaoDisabled: false, fotosDisabled: false});

        this.attRelacionamento(irmaos);
    }

    adicionarIrmao() {
        const irmaos = this.state.irmaos.slice();
        irmaos.push({});
        this.setState({irmaos: irmaos, addIrmaoDisabled: true});
    }

    onFotoDrop = (arq) => {
        const foto = new Foto(arq);
        const fotos = this.state.fotos.slice();
        fotos.push(foto);
        this.setState({fotos: fotos});

        this.attRelacionamento();
    }

    removerFoto = (idx) => {
        const fotos = this.state.fotos.slice();
        if (fotos[idx].id) {
            const bk = fotos[idx];
            AlunoService.removerFotoIrmao(this.props.alunoId, fotos[idx].id)
            .then(() => {
                PopUp.sucesso('Foto removida com sucesso');
                this.attRelacionamento();
            })
            .catch(() => {
                PopUp.erro('Erro na remoção da foto');
                fotos.push(bk);
                this.setState({fotos: fotos});
            })
        }
        fotos.splice(idx, 1);
        this.setState({fotos: fotos});
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

                {!this.state.fotosDisabled ? 
                    <FotoDropzone
                        fotos={this.state.fotos.slice()}
                        onFotoDrop={this.onFotoDrop}
                        removerFoto={this.removerFoto}
                        multiple={true}
                    />
                    :
                    null
                }

            </>
        )
    }

}
export default IrmaoForm;
