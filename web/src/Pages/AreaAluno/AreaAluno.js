import React from 'react';
import BasePage from '../BasePage/BasePage';
import service from './AreaAlunoService';
import PopUp from '../Utils/pop-up/PopUp';
import ImgBox from '../Utils/ImgBox/ImgBox';
import DisplayFotos from './DisplayFotos/DisplayFotos';
import styles from './AreaAluno.module.scss';
import PedidoForm from './PedidoForm/PedidoForm';
import MostraExtras from './PedidoForm/Models/MostraExtras';

export default class AreaAluno extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            kit: null,
            nPedido: undefined
        }
        this.mostraExtras = MostraExtras.get();
    }

    componentDidMount() {
        const { match: { params: {chave} } } = this.props;
        service.getKit(chave)
            .then(kit => {
                kit.fotosTurma = this.ordenaFotos(kit.fotosTurma);
                this.setState({kit: kit});
            })
            .catch(error => {
                if (error.status) {
                    PopUp.erro(`Erro ${error.status}: ${error.data}`);
                } else {
                    PopUp.erro(error);
                }
            });
    }

    ordenaFotos(fts) {
        if (fts && fts.length > 0) {
            fts = fts.sort((a, b) => {
                const descA = a.descricao.toUpperCase();
                const descB = b.descricao.toUpperCase();
                if (descA < descB) {
                    return -1;
                }
                if (descA > descB) {
                    return 1;
                }
                return 0;
            });
        }
        return fts;
    }

    getFotosDisplay(ftsTurma, ftsIrmaos) {
        let fotos = [];
        if (ftsTurma && ftsTurma.length > 0) {
            fotos = [...ftsTurma];
        }
        if (ftsIrmaos && ftsIrmaos.length > 0) {
            fotos = [...fotos, ...ftsIrmaos];
        }
        return fotos;
    }

    getOpcoesFotos(ftsTurma, ftsIrmaos) {
        let fotos = {};
        if (ftsTurma && ftsTurma.length > 0) {
            fotos.turma = ftsTurma.map(ft => {
                return {nome : ft.descricao}
            });
        }
        if (ftsIrmaos && ftsIrmaos.length > 0) {
            fotos.irmaos = ftsIrmaos.map(ft => {
                return {nome : ft.descricao}
            });
        }
        return fotos;
    }

    onPedidoFeito(nPedido) {
        this.setState({nPedido});
    }

    renderPage() {
        const { kit } = this.state;
        if (kit == null) {
            return (
                <div className="container mt-5 center">
                    <div className="preloader-wrapper big active">
                        <div className="spinner-layer spinner-green-only">
                            <div className="circle-clipper left">
                                <div className="circle"></div>
                            </div>
                            <div className="gap-patch">
                                <div className="circle"></div>
                            </div>
                            <div className="circle-clipper right">
                                <div className="circle"></div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        if (!this.state.nPedido) {
            const { codigoAcesso, escola, turma, nomeAluno, fotoIndividual, fotosIrmaos, fotosTurma } = kit;
            const opcoes = this.getOpcoesFotos(fotosTurma, fotosIrmaos);
            return (
                <>
                    <div className={`${styles.title} center`}>
                        <h3>Kit Fotográfico Escolar 2020</h3>
                    </div>
                    <div className="content container">

                        <blockquote style={{fontStyle: 'italic'}}>
                            O kit é composto por 2 (duas) fotos diagramadas, sendo:
                            <ul className="browser-default">
                                <li>
                                    Uma individual com legenda: nome, turma e ano. 
                                </li>
                                <li>
                                    Uma foto do grupo com legenda: nomes dos alunos em ordem, nome dos professores, turma e ano.
                                </li>
                            </ul> 
                            <p>
                                As fotos são impressas em papel profissional mate ou fosco e entregues dentro de um folder.  
                            </p>
                        </blockquote>

                        <div className="header">
                            <div className="left-align">
                                <p>
                                    <b>Código de Acesso:</b> {codigoAcesso}
                                </p>
                                <p>
                                    <b>Escola:</b> {escola}
                                </p>
                                <p>
                                    <b>Turma:</b> {turma}
                                </p>
                                <p>
                                    <b>Aluno:</b> {nomeAluno}
                                </p>
                            </div>
                        </div>
    
                        <hr />
    
                        <div className={`${styles.title} center`}>
                            <h4>Foto Individual</h4>
                        </div>
    
                        
                        <div className={`center mb-5 ${styles.fotoIndividual}`} id="fotoIndividual">
                            <ImgBox img={fotoIndividual?.url} alt="foto individual" />
                        </div>
    
    
                        {fotosTurma?.length ?
                            <>
                                <hr />
                                <div className={`${styles.title} center`}>
                                    <h4>{`Foto${fotosTurma.length > 1 ? 's' : ''} de Turma ${fotosIrmaos?.length > 0 ? 'e de Irmãos' : ''}`}</h4>
                                </div>

                                <div className={styles.explicacaoCenter}>
                                    <blockquote>
                                        Mostra das fotos de turma oficial e funny
                                        {`${fotosIrmaos?.length > 0 ? ' e foto de Irmãos' : ''}`}
                                    </blockquote>
                                </div>

                                <div className="row mb-5">
                                    <div className="col s12 mt-2">
                                        <DisplayFotos
                                            fotos={this.getFotosDisplay(fotosTurma, fotosIrmaos)}
                                        />
                                    </div>
                                </div>
                            </>
                            : null
                        }

                        <hr />

                        <div className={`${styles.title} center`}>
                            <h4>Extras</h4>
                        </div>

                        <div className={styles.explicacaoCenter}>
                            <blockquote>
                                Mostra das artes do kit individual e grupo e opções de fotos extras.
                            </blockquote>
                        </div>

                        <div className="row mb-5">
                            <div className="col s12 mt-2">
                                <DisplayFotos
                                    fotos={this.mostraExtras}
                                />
                            </div>
                        </div>
                        
                        <hr />
    
                        <div className={`${styles.title}`}>
                            <h4>Pedido</h4>
                        </div>
    
                        <PedidoForm 
                            aluno={nomeAluno}
                            turma={turma}
                            escola={escola}
                            opcoes={opcoes}
                            onPedidoFeito={nPedido => this.onPedidoFeito(nPedido)}
                        />
    
                    </div>
                </>
            );
        }
        return(
            <div className="container mt-5">
                <div className="card z-depth-2"
                    style={{cursor: "initial"}}
                >
                    <div className="card-content">
                        <div className="card-title center">
                            <span className="d-inline-flex">
                                <i className="small material-icons" style={{color: 'green'}}>check_circle</i>
                                <span className="pl-2">
                                    Pedido {this.state.nPedido} encaminhado
                                </span>
                            </span>
                        </div>
                        <p className={`${styles.confirm} ${styles.agradecimento}`}>Obrigado por realizar seu pedido!</p>
                        <p className={`${styles.confirm}`}>
                            Enviamos para o e-mail informado uma confirmação com o resumo de seu pedido.
                        </p>
                        <p className={`${styles.confirm}`}>
                            Entraremos em contato para fechar seu pedido com as informações para o pagamento.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

}