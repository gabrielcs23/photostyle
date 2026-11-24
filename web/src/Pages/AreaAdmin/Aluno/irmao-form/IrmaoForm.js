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

        // chave estável por linha: id do irmão gravado ou contador local para linhas novas
        this.proximaChave = 0;

        if (this.props.irmaoRel) {
            this.state = {
                ...this.getEstadoDoGrupo(this.props.irmaoRel),
                addIrmaoDisabled: false
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
            this.setState(this.getEstadoDoGrupo(this.props.irmaoRel));
        }
    }

    getEstadoDoGrupo(irmaoRel) {
        return {
            id: irmaoRel.id,
            irmaos: irmaoRel.irmaos
                .filter(irmao => Number(irmao.id) !== Number(this.props.alunoId))
                .map(irmao => ({ ...irmao, chave: `irmao-${irmao.id}` })),
            fotos: irmaoRel.fotos || [],
            fotosDisabled: false
        }
    }

    attRelacionamento(irmaos, fotos) {
        const irmaoRel = new IrmaoRel(irmaos, fotos, this.state.id);
        this.props.relacionarIrmao(irmaoRel);
    }

    relacionarIrmao(irmao, idx) {
        const irmaos = this.state.irmaos.slice();
        irmaos[idx] = { ...irmao, chave: irmaos[idx].chave };
        this.setState({irmaos: irmaos, addIrmaoDisabled: false, fotosDisabled: false});

        this.attRelacionamento(irmaos, this.state.fotos);
    }

    adicionarIrmao() {
        const irmaos = this.state.irmaos.slice();
        irmaos.push({ chave: `nova-${this.proximaChave++}` });
        this.setState({irmaos: irmaos, addIrmaoDisabled: true});
    }

    // grupo devolvido pela API após uma ação imediata (null quando o grupo foi desfeito)
    aplicarGrupoGravado(irmaoRel) {
        // linhas e fotos ainda não enviadas continuam pendentes até o Salvar
        const pendentes = this.state.irmaos.filter(irmao => !irmao.turma);
        let estado;
        if (irmaoRel) {
            estado = this.getEstadoDoGrupo(irmaoRel);
            const fotosPendentes = this.state.fotos.filter(foto => foto.id == null);
            estado.fotos = estado.fotos.concat(fotosPendentes);
            estado.irmaos = estado.irmaos.concat(pendentes);
        } else {
            estado = {
                id: null,
                irmaos: pendentes,
                fotos: [],
                fotosDisabled: pendentes.length === 0
            };
        }
        this.setState(estado);

        const irmaosComId = estado.irmaos.filter(irmao => irmao.id != null);
        this.props.atualizarIrmaoRel(irmaosComId.length > 0
            ? new IrmaoRel(irmaosComId, estado.fotos, estado.id)
            : null);
    }

    removerIrmao(idx) {
        const irmao = this.state.irmaos[idx];

        // linha ainda não gravada: apenas descarta
        if (!irmao.turma) {
            const irmaos = this.state.irmaos.slice();
            irmaos.splice(idx, 1);
            this.setState({irmaos: irmaos, addIrmaoDisabled: false});
            this.attRelacionamento(irmaos, this.state.fotos);
            return;
        }

        AlunoService.removerIrmao(this.props.alunoId, irmao.id)
            .then(irmaoRel => {
                PopUp.sucesso(irmaoRel
                    ? 'Vínculo de irmão removido com sucesso'
                    : 'Vínculo removido; o grupo de irmãos foi desfeito');
                this.aplicarGrupoGravado(irmaoRel);
            })
            .catch(error => this.props.handleUnauthorized(error))
            .catch(error => PopUp.erro(this.getMensagemErro(error, 'Erro na remoção do vínculo de irmão')));
    }

    substituirIrmao(idx, novoIrmao) {
        const irmao = this.state.irmaos[idx];
        return AlunoService.substituirIrmao(this.props.alunoId, irmao.id, novoIrmao.id)
            .then(irmaoRel => {
                PopUp.sucesso('Irmão alterado com sucesso');
                this.aplicarGrupoGravado(irmaoRel);
                return true;
            })
            .catch(error => this.props.handleUnauthorized(error))
            .catch(error => {
                PopUp.erro(this.getMensagemErro(error, 'Erro na alteração do irmão'));
                return false;
            });
    }

    getMensagemErro(error, padrao) {
        return error?.status === 400 && typeof error.data === 'string' ? error.data : padrao;
    }

    onFotoDrop = (arq) => {
        const foto = new Foto(arq);
        const fotos = this.state.fotos.slice();
        fotos.push(foto);
        this.setState({fotos: fotos});

        this.attRelacionamento(this.state.irmaos, fotos);
    }

    removerFoto = (idx) => {
        const fotos = this.state.fotos.slice();
        if (fotos[idx].id) {
            const bk = fotos[idx];
            AlunoService.removerFotoIrmao(this.props.alunoId, fotos[idx].id)
            .then(() => {
                PopUp.sucesso('Foto removida com sucesso');
                this.attRelacionamento(this.state.irmaos, fotos);
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
        const gravados = this.state.irmaos.filter(irmao => irmao.turma);
        const idsNoGrupo = this.state.irmaos
            .filter(irmao => irmao.id != null)
            .map(irmao => irmao.id)
            .concat(this.props.alunoId ? [this.props.alunoId] : []);
        // aluno em edição + 1 irmão gravado: remover desfaz o grupo
        const desfazGrupo = gravados.length === 1;

        const rows = this.state.irmaos.map((irmao, idx) => {
            return (
                <IrmaoSelect
                    key={irmao.chave}
                    composedKey={irmao.chave}
                    irmao={irmao}
                    escolaId={this.props.escolaId}
                    alunoId={this.props.alunoId}
                    idsNoGrupo={idsNoGrupo}
                    desfazGrupo={desfazGrupo}
                    selecionar={(irmao) => this.relacionarIrmao(irmao, idx)}
                    substituir={(novoIrmao) => this.substituirIrmao(idx, novoIrmao)}
                    remover={() => this.removerIrmao(idx)}
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
                        key={`fotos-${this.state.id}`}
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
