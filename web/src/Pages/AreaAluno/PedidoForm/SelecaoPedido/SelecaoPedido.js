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
    }

    selectItem(idx) {
        this.setState({itemSel: idx});
        this.montaSelecao(idx, this.state.extrasSel.slice());
    }

    checkExtra(checked, idx) {
        checked ? this.setQtdExtra(idx, 1) : this.setQtdExtra(idx, 0);
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

    setOpcao(idx, modeloOpcao, idxOpcao) {
        const extras = this.state.extrasSel.slice();
        const campo = extras[idx];
        let opcao;
        switch (modeloOpcao) {
            case 'T':
                opcao = this.props.opcoesTurma[idxOpcao]?.nome;
                break;
            case 'I':
                opcao = this.props.opcoesIrmaos[idxOpcao]?.nome;
                break;
            default:
                opcao = '';
                break;
        }
        campo.opcao = opcao;
        this.setState({extrasSel: extras});
        this.montaSelecao(this.state.itemSel, extras);
    }

    montaSelecao(itemIdx, extrasSel) {
        const extras = extrasSel.filter(extra => extra.qtd > 0);
        const item = this.itens[itemIdx];
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
            return (
                <div className="col s12 mb-2" key={`item${idx}`}>
                    <label style={{color: 'initial'}}>
                        <input
                            className="with-gap"
                            type="radio"
                            id={`item${idx}`}
                            name={`item${idx}`}
                            checked={this.state.itemSel === idx}
                            onChange={() => this.selectItem(idx)}
                        />
                        <span>{item.nome} <b>+R${item.val}</b></span>
                    </label>
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
                    { extra.qtd > 0 ?    
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
                                onChange={e => this.setQtdExtra(idx, parseInt(e.target.value))}
                            />
                        </div>
                        : null
                    }
                    { extra.qtd > 0 && extra.modeloOpcao != null ?
                        <div className="input-field col s12 m6 mb-3 select-opcoes">
                            <Select
                                composedKey={`extra${idx}.opcao`}
                                label={'Opção'}
                                options={this.getOpcoes(extra.modeloOpcao)}
                                disabled={false}
                                selecionar={idxOpcao => this.setOpcao(idx, extra.modeloOpcao, idxOpcao)}
                            />
                        </div>
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