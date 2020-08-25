import React, { Component, Fragment } from 'react';
import Select from '../../../Utils/Select/Select';
import PedidoItens from '../Models/PedidoItens';
import PedidoExtras from '../Models/PedidoExtras';
import Cleave from 'cleave.js/react';
import './SelecaoPedido.scss'

export default class SelecaoPedido extends Component {

    constructor(props) {
        super(props);

        this.itens = PedidoItens.get();

        this.state = {
            itemSel: undefined,
            extrasSel: PedidoExtras.get()
        };

        this.cleaveRefs = new Array(this.state.extrasSel.length);

    }

    selectItem(idx) {
        const item = this.itens[idx];
        this.setState({itemSel: item});
        this.montaSelecao(item, this.state.extrasSel.slice());
    }

    selecionarFotoTurma(idxItem, idxOpcao) {
        const item = Object.assign({}, this.itens[idxItem]);
        item.opcao = this.props.opcoesTurma[idxOpcao].nome;
        this.setState({itemSel: item});
        this.montaSelecao(item, this.state.extrasSel.slice());
    }

    selecionarFotoIrmao(idxOpcao) {
        const item = this.state.itemSel;
        item.opcao += ` + ${this.props.opcoesIrmaos[idxOpcao].nome}`;
        this.setState({itemSel: item});
        this.montaSelecao(item, this.state.extrasSel.slice());
    }

    checkExtra(checked, idx) {
        checked ? this.setQtdExtra(idx, 1) : this.setQtdExtra(idx, 0);
    }

    onChangeQtdExtra(idx, qtd, cleaveRef) {
        if (this.state.extrasSel[idx].isDigital && qtd > 1) {
            if (cleaveRef) {
                cleaveRef.setRawValue('1');
            }
            qtd = 1;
        }
        this.setQtdExtra(idx, qtd)
    }

    setQtdExtra(idx, qtd) {
        const extras = this.state.extrasSel.slice();
        const campo = extras[idx];
        campo.qtd = qtd;
        campo.total = campo.val * campo.qtd;
        this.setState({extrasSel: extras});
        this.montaSelecao(this.state.itemSel, extras);
    }

    getOpcoes(modeloOpcao) {
        switch (modeloOpcao) {
            case 'T':
                return this.props.opcoesTurma?.slice();
            case 'I':
                return this.props.opcoesIrmaos?.slice();
            default:
                return [];
        }
    }

    inicializaOpcao(extra, opcao) {
        if (!extra.opcao) {
            extra.opcao = new Map();
        }
        if (!extra.opcao.has(opcao.nome)) {
            extra.opcao = extra.opcao.set(opcao.nome, 0);
        }
    }

    onChangeQtdOpcaoExtra(idxExtra, nome, qtd, cleaveRef) {
        if (this.state.extrasSel[idxExtra].isDigital && qtd > 1) {
            if (cleaveRef) {
                cleaveRef.setRawValue('1');
            }
            qtd = 1;
        }
        this.selecionaQtdOpcao(idxExtra, nome, qtd)
    }

    selecionaQtdOpcao(idxExtra, nome, qtd) {
        const extras = this.state.extrasSel.slice();
        const extra = extras[idxExtra];
        extra.opcao.set(nome, qtd);
        this.setState({extrasSel: extras});
        this.montaSelecao(this.state.itemSel, extras);
    }

    montaSelecao(item, extrasSel) {
        const extras = extrasSel.filter(extra => extra.qtd > 0);
        item.qtd = 1;
        item.total = item.val;
        const opcoes = {
            item: item,
            extras: extras
        };
        this.props.seleciona(opcoes);
    }

    render() {
        const radioItens = this.itens.map((item, idx) => {
            const opcoesTurma = this.getOpcoes('T');
            const opcoesIrmaos = this.getOpcoes('I');
            return (
                <div className="row" key={`item${idx}`}>
                    <div className="col s12 mb-2">
                        <label style={{color: 'initial'}}>
                            <input
                                className="with-gap"
                                type="radio"
                                id={`item${idx}`}
                                name={`item${idx}`}
                                checked={this.state.itemSel?.nome === item.nome}
                                onChange={() => this.selectItem(idx)}
                            />
                            <span>{item.nome} <b>+R${item.val}</b></span>
                        </label>
                    </div>

                    { item.qtd > 0 && this.state.itemSel?.nome === item.nome ?    
                        <>
                            <div
                                className="input-field col s12 m6 select-opcoes select-opcoes-fotos"
                                style={{paddingLeft: "3.5rem"}}
                            >
                                <Select
                                    composedKey={`item${idx}.opcao`}
                                    label={'Foto Turma'}
                                    options={opcoesTurma}
                                    disabled={false}
                                    selecionar={idxFoto => this.selecionarFotoTurma(idx, idxFoto)}
                                />
                            </div>
                            {
                                // Se ft de turma selecionada e é kit c irmão então escolhe irmão
                                this.state.itemSel.opcao && item.modeloOpcao === 'I' ?
                                    <div
                                        className="input-field col s12 m6 select-opcoes select-opcoes-fotos"
                                        style={{paddingLeft: "3.5rem"}}
                                    >
                                        <Select
                                            composedKey={`item${idx}.opcao`}
                                            label={'Foto Irmãos'}
                                            options={opcoesIrmaos}
                                            disabled={false}
                                            selecionar={idxFoto => this.selecionarFotoIrmao(idxFoto)}
                                        />
                                    </div>
                                : null
                            }
                        </>
                        : null
                    }
                </div>
            );
        });
        const checkBoxExtras = this.state.extrasSel.map((extra, idx) => {
            return (
                <Fragment key={`extra${idx}`}>
                    <div
                        className="col s12 mb-2"
                        style={{paddingLeft: "0.9rem"}}
                    >
                        <label style={{color: 'initial'}}>
                            <input
                                className="filled-in"
                                type="checkbox"
                                id={`extra${idx}`}
                                name={`extra${idx}`}
                                onChange={e => this.checkExtra(e.target?.checked, idx)}
                            />
                            <span>{extra.nome} <b>+R${extra.val}</b></span>
                        </label>
                    </div>
                    { extra.qtd > 0 && extra.modeloOpcao == null ?    
                        <div
                            className="col s6 m4 l3 xl2 mb-3"
                            style={{paddingLeft: "3.5rem"}}
                        >
                            <label>Quantidade</label>
                            <Cleave
                                className="validate"
                                type="text"
                                id={`extra${idx}.qtd`}
                                name={`extra${idx}.qtd`}
                                value={extra.qtd}
                                options={{numeral: true}}
                                onInit={cleave => this.cleaveRefs[idx] = cleave}
                                onChange={e => this.onChangeQtdExtra(idx, parseInt(e.target.value), this.cleaveRefs[idx])}
                            />
                        </div>
                        : null
                    }
                    { extra.qtd > 0 && extra.modeloOpcao != null ?
                        this.getOpcoes(extra.modeloOpcao).map((opcao, idxOpcao) => {
                            this.inicializaOpcao(extra, opcao);
                            return (
                                <div className="row" key={`extra${idx}.opcao${idxOpcao}`}>
                                    <div
                                        className="col s6 m4 l3 xl2 mb-3"
                                        style={{paddingLeft: "3.5rem"}}
                                    >
                                        <label>Quantidade</label>
                                        <Cleave
                                            className="validate"
                                            type="text"
                                            id={`extra${idx}.opcao${idxOpcao}.qtd`}
                                            name={`extra${idx}.opcao${idxOpcao}.qtd`}
                                            value={extra.opcao.get(opcao.nome)}
                                            options={{numeral: true}}
                                            onInit={cleave => this.cleaveRefs[idx] = cleave}
                                            onChange={e => this.onChangeQtdOpcaoExtra(idx, opcao.nome, parseInt(e.target.value), this.cleaveRefs[idx])}
                                        />
                                    </div>
                                    <div className="input-field col s12 m6 mb-3 select-opcoes">
                                        <Select
                                            composedKey={`extra${idx}.opcao${idxOpcao}.select`}
                                            label={'Opção'}
                                            options={[opcao]}
                                            autoSelect
                                            disabled
                                        />
                                    </div>
                                </div>
                            )
                        })
                        : null
                    }
                </Fragment>
            );
        })

        return (
            <>
                <div>
                    <h6>Kit (obrigatório)</h6>
                </div>

                <div className="row input-field mb-2">
                    {radioItens}
                </div>

                {this.state.itemSel != null ? 
                    <>
                        <div>
                            <h6>Extras (opcional)</h6>
                        </div>
                        <div className="row input-field">
                            {checkBoxExtras}
                        </div>
                    </>
                    : null
                }
            </>
        )
    }
}