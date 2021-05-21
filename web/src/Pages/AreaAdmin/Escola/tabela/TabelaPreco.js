import React, { Component } from 'react';
import M from 'materialize-css';
import EscolaService from '../EscolaService';
import OpcaoKit from './OpcaoKit';
import OpcaoExtra from './OpcaoExtra';
import PopUp from '../../../Utils/pop-up/PopUp'

class TabelaPreco extends Component {

    constructor(props) {
        super(props);

        this.divisoria = {
            display: 'flex',
            flexWrap: 'nowrap',
            flexGrow: 1,
            width: '100%',
            borderTop: '1px solid grey'
        }

        this.state = {
            id: '',
            opcoesKit: [],
            opcoesExtra: []
        }
    }

    inputChangeHandler = (event, op) => {
        const { name, value } = event.target;
        op[name] = value;
    }

    componentDidMount() {
        EscolaService.getTabelaPreco(this.props.idEscola)
            .then(tabela => {
                if (tabela) {
                    this.setState({
                        id: tabela.id,
                        opcoesKit: tabela.opcoesKit,
                        opcoesExtra: tabela.opcoesExtra
                    });
                    M.updateTextFields();
                }
            })
            .catch(error => this.props.handleUnauthorized(error))
            .catch(() => PopUp.erro('Erro'));
    }

    salvar() {
        const tabela = {
            escola: this.props.idEscola,
            opcoesKit: this.state.opcoesKit,
            opcoesExtra: this.state.opcoesExtra
        }
        if (!this.state.id) {
            EscolaService.postTabelaPreco(this.props.idEscola, tabela)
                .then(tabela => {
                    this.setState({...tabela});
                    PopUp.sucesso('Tabela cadastrada com sucesso');
                })
                .catch(error => this.props.handleUnauthorized(error))
                .catch(() => {
                    PopUp.erro('Erro no cadastro da tabela de preço');
                });
        }
    }

    addKit = () => {
        const kit = {
            nome: '',
            valor: 0,
            isIrmao: false,
            isTurma: false,
        }
        const opcoes = this.state.opcoesKit.slice();
        opcoes.push(kit);
        this.setState({opcoesKit: opcoes})
    }

    onChangeKit(event, idx) {
        const ops = this.state.opcoesKit.slice();
        const kit = ops[idx];
        this.inputChangeHandler(event, kit);
        this.setState({opcoesKit: ops})
    }

    addExtra = () => {
        const extra = {
            nome: '',
            valor: 0,
            isIrmao: false,
            isTurma: false,
            isDigital: false,
            isOpcional: false
        }
        const opcoes = this.state.opcoesExtra.slice();
        opcoes.push(extra);
        this.setState({opcoesExtra: opcoes})
    }

    onChangeExtra(event, idx) {
        const ops = this.state.opcoesExtra.slice();
        const extra = ops[idx];
        this.inputChangeHandler(event, extra);
        this.setState({opcoesExtra: ops})
    }

    render() {
        const opKit = this.state.opcoesKit.slice()
        const opExtra = this.state.opcoesExtra.slice()
        return (
            <form>
                <div className="row">
                    <div className="col left">
                        <h5>Tabela de Preços</h5>        
                    </div>
                    <div className="col right">
                        <button
                            className="btn btn-small waves-effect waves-light blue"
                            //disabled={!this.state.canSubmit}
                            onClick={() => this.salvar()}
                            type="button"
                            >
                            <span className="d-inline-flex">
                                <i className="material-icons">save</i>
                                <span className="pl-2">Salvar</span>
                            </span>
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <button 
                            className="btn btn-small waves-effect waves-light blue"
                            onClick={() => this.addKit()}
                            type="button"
                            >
                            <span className="d-inline-flex">
                                <i className="material-icons">add</i>
                                <span className="pl-2">Kit</span>
                            </span>
                        </button>
                    </div>
                </div>

                {opKit.map((opKit, idx) => (
                    <div className="mb-3" key={`kit-${idx}`}>
                        {console.log('lado de fora')}
                        <OpcaoKit kit={opKit} id={idx} onChange={e => this.onChangeKit(e, idx)} />
                    </div>
                ))}

                {/* <div className="row" style={this.divisoria} /> */}

                <div className="row">
                    <div className="col">
                        <button 
                            className="btn btn-small waves-effect waves-light blue"
                            onClick={() => this.addExtra()}
                            type="button"
                            >
                            <span className="d-inline-flex">
                                <i className="material-icons">add</i>
                                <span className="pl-2">Extra</span>
                            </span>
                        </button>
                    </div>
                </div>
                
                {opExtra.map((opExtra, idx) => (
                    <div className="mb-3" key={`extra-${idx}`}>
                        <OpcaoExtra extra={opExtra} id={idx} onChange={ e => this.onChangeExtra(e, idx)} />
                    </div>
                ))}
                
            </form>
        );
    }

}

export default TabelaPreco;
