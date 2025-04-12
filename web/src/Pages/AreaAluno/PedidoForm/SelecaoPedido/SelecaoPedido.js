import React, { Component, Fragment } from 'react';
import CustomSelect from '../../../Utils/CustomSelect/CustomSelect';
import styles from "../../AreaAluno.module.scss";
import Cleave from 'cleave.js/react';
import './SelecaoPedido.scss'
import ModeloPedido from '../Models/ModeloPedido';

const parseOpcoes = (ops) => {
    return ops.map(op => new ModeloPedido(op.nome, op.valor, op.turma, op.irmao, op.opcional, op.digital))
}

export default class SelecaoPedido extends Component {

    constructor(props) {
        super(props);

        this.itens = parseOpcoes(props.tabela.opcaoKits);

        this.state = {
            itemSel: undefined,
            extrasSel: parseOpcoes(props.tabela.opcaoExtras)
        };

        this.cleaveRefs = new Array(this.state.extrasSel.length);

    }

    componentDidMount() {
        if (this.itens.length === 1) {
            this.selectItem(0);
        }
        this.inicializaOpcoes();
    }

    inicializaOpcoes() {
        const extras = this.state.extrasSel.slice();
        for (const extra of extras) {
            if (extra.temEscolha()) {
                if (extra.isTurma && !this.possuiFotoTurma()) {
                    continue;
                }
                if (extra.isIrmao && !this.possuiFotosIrmaos()) {
                    continue;
                }
                if (extra.isOpcional && !this.possuiFotoAdicional()) {
                    continue;
                }
                for (const opcao of this.getOpcoes(extra.isTurma, extra.isIrmao, extra.isOpcional)) {
                    this.inicializaOpcao(extra, opcao);
                }
            }
        }
        this.setState({extrasSel: extras});
    }

    selectItem(idx) {
        const itemSel = this.itens[idx]
        const item = new ModeloPedido(itemSel.nome, itemSel.val, itemSel.isTurma, itemSel.isIrmao, itemSel.isOpcional, itemSel.isDigital);
        item.qtd = 1;
        item.total = item.val;
        item.opcao = {individual: '', turma: '', irmao: ''}
        
        this.setState({itemSel: item});
        this.montaSelecao(item, this.state.extrasSel.slice());
    }

    selecionarFotoIndividual(idxOpcao) {
        const item = this.state.itemSel;
        item.opcao.individual = this.props.opcoesIndividual[idxOpcao].nome;
        this.setState({itemSel: item});
        this.montaSelecao(item, this.state.extrasSel.slice());
    }

    selecionarFotoTurma(idxOpcao) {
        const item = this.state.itemSel;
        item.opcao.turma = this.props.opcoesTurma[idxOpcao].nome;
        this.setState({itemSel: item});
        this.montaSelecao(item, this.state.extrasSel.slice());
    }

    selecionarFotoIrmao(idxOpcao) {
        const item = this.state.itemSel;
        item.opcao.irmao = this.props.opcoesIrmaos[idxOpcao].nome;
        this.setState({itemSel: item});
        this.montaSelecao(item, this.state.extrasSel.slice());
    }

    checkExtra(checked, idx) {
        checked ? this.setQtdExtra(idx, 1) : this.uncheckExtra(idx);
    }

    uncheckExtra(idx) {
        const extras = this.state.extrasSel.slice();
        const extra = extras[idx];
        if (extra.opcao) {
            for (let key of extra.opcao.keys()) {
                extra.opcao.set(key, 0)
            }
            extra.qtd = 0;
            this.setValOpcao(extras, extra);
        } else {
            this.setQtdExtra(idx, 0)
        }
    }

    onChangeQtdExtra(idx, qtd, cleaveRef) {
        if (!qtd) {
           return
        }
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
        if (!campo.opcao) {
            campo.total = campo.val * campo.qtd;
        }
        this.setState({extrasSel: extras});
        this.montaSelecao(this.state.itemSel, extras);
    }

    getOpcoes(turma, irmao, opcional) {
        if (turma) {
            return this.props.opcoesTurma?.slice();
        }
        if (irmao) {
            return this.props.opcoesIrmaos?.slice();
        }
        if (opcional) {
            return this.props.opcoesAdicionais?.slice();
        }
        return [];
    }

    possuiFotoTurma() {
        return this.props.opcoesTurma?.length > 0;
    }

    possuiFotosIrmaos() {
        return this.props.opcoesIrmaos?.length > 0;
    }

    possuiFotoAdicional() {
        return this.props.opcoesAdicionais?.length > 0;
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
        if (!qtd) {
            return
        }
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

        extra.qtd = 0;
        for (let qtdItem of extra.opcao.values()) {
            extra.qtd += qtdItem;
        }
        this.setValOpcao(extras, extra);
    }

    setValOpcao(extras, extra) {
        extra.total = extra.val * extra.qtd;

        this.setState({extrasSel: extras});
        this.montaSelecao(this.state.itemSel, extras);
    }

    montaSelecao(item, extrasSel) {
        const extras = extrasSel.filter(extra => extra.qtd > 0);
        const opcoes = {
            item: item,
            extras: extras
        };
        this.props.seleciona(opcoes);
    }

    render() {
        const radioItens = this.itens.map((item, idx) => {
            if (item.isIrmao && !this.possuiFotosIrmaos()) {
                return null;
            }
            const opcoesIndividual = this.props.opcoesIndividual?.slice();
            const opcoesTurma = this.getOpcoes(true);
            const opcoesIrmaos = this.getOpcoes(false, true);

            const renderOpcaoKit = () => {
                let opcaoIndividual;
                let opcaoTurma;
                let opcaoIrmao;
                if (this.state.itemSel?.nome === item.nome && this.state.itemSel.qtd > 0) {
                    opcaoIndividual = (
                        <div
                                className="input-field col s12 m6 select-opcoes select-opcoes-fotos"
                                style={{paddingLeft: "3.5rem"}}
                            >
                                <CustomSelect
                                    composedKey={`item${idx}.opcao`}
                                    label={'Foto Individual'}
                                    options={opcoesIndividual}
                                    disabled={false}
                                    selecionar={idxFoto => this.selecionarFotoIndividual(idxFoto)}
                                />
                            </div>
                    )
                    if(this.possuiFotoTurma()) {
                        opcaoTurma = (
                            <div
                                className="input-field col s12 m6 select-opcoes select-opcoes-fotos"
                                style={{paddingLeft: "3.5rem"}}
                            >
                                <CustomSelect
                                    composedKey={`item${idx}.opcao`}
                                    label={'Foto Turma'}
                                    options={opcoesTurma}
                                    disabled={false}
                                    selecionar={idxFoto => this.selecionarFotoTurma(idxFoto)}
                                />
                            </div>
                        )
                    }
                    // Se ft de turma selecionada e é kit c irmão então escolhe irmão
                    if (this.state.itemSel.opcao && item.isIrmao) {
                        opcaoIrmao = (
                            <div
                                className="input-field col s12 m6 select-opcoes select-opcoes-fotos"
                                style={{paddingLeft: "3.5rem"}}
                            >
                                <CustomSelect
                                    composedKey={`item${idx}.opcao`}
                                    label={'Foto Irmãos'}
                                    options={opcoesIrmaos}
                                    disabled={false}
                                    selecionar={idxFoto => this.selecionarFotoIrmao(idxFoto)}
                                />
                            </div>
                        )
                    }
                }
                return (
                    <>
                    {opcaoIndividual}
                    {opcaoTurma}
                    {opcaoIrmao}
                    </>
                )
            }

            return (
                <div className="row" key={`item${idx}`}>
                    <div className="col s12 mb-2">
                        <label style={{color: 'initial'}}>
                            <input
                                className="filled-in"
                                type="checkbox"
                                id={`item${idx}`}
                                name={`item${idx}`}
                                checked={this.state.itemSel?.nome === item.nome}
                                onChange={() => this.selectItem(idx)}
                            />
                            <span>{item.nome} <b>+R${item.val}</b></span>
                        </label>
                    </div>

                    {renderOpcaoKit()}
                </div>
            );
        });
        const checkBoxExtras = this.state.extrasSel.map((extra, idx) => {
            if (extra.isIrmao && !this.possuiFotosIrmaos()) {
                return null;
            }
            if (extra.isOpcional && !this.possuiFotoAdicional()) {
                return null;
            }
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
                    { extra.qtd > 0 && !extra.temEscolha() ?    
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
                    { extra.qtd > 0 && extra.temEscolha() ?
                        this.getOpcoes(extra.isTurma, extra.isIrmao, extra.isOpcional).map((opcao, idxOpcao) => {
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
                                        <CustomSelect
                                            composedKey={`extra${idx}.opcao${idxOpcao}.select`}
                                            label={'Opção'}
                                            options={[opcao]}
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
                    <h5 className={`${styles.title}`} style={{fontWeight: 'bold'}}>
                        Kit Recordação Escolar
                        {/* <span style={{color: 'red'}}>*</span> */}
                    </h5>
                    {this.itens.length > 1 ? (
                        <blockquote style={{ fontStyle: "italic" }}>
                            Selecione a opção aqui! <b>E veja os extras.</b>
                        </blockquote>
                    ) : null}
                </div>

                <div className="row input-field mb-2">
                    {radioItens}
                </div>

                {this.state.itemSel != null ? 
                    <>
                        <div>
                            <h6  style={{fontWeight: 'bold'}}>Extras</h6>
                            <blockquote style={{fontStyle: 'italic'}}>
                                Fique a vontade para escolher opções adicionais
                            </blockquote>
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