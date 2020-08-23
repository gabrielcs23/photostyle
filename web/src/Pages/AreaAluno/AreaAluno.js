import React from 'react';
import BasePage from '../BasePage/BasePage';
import service from './AreaAlunoService';
import PopUp from '../Utils/pop-up/PopUp';
import ImgBox from '../Utils/ImgBox/ImgBox';
import DisplayFotos from './DisplayFotos/DisplayFotos';
import styles from './AreaAluno.module.scss';
import PedidoForm from './PedidoForm/PedidoForm';

export default class AreaAluno extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            kit: null,
            nPedido: undefined
        }
    }

    componentDidMount() {
        const { match: { params: {chave} } } = this.props;
        service.getKit(chave)
            .then(kit => this.setState({kit: kit}))
            .catch(error => {
                if (error.status) {
                    PopUp.erro(`Erro ${error.status}: ${error.data}`);
                } else {
                    PopUp.erro(error);
                }
            });
    }

    getFotosDisplay(ftTurmas, ftIrmaos) {
        let fotos = [];
        if (ftTurmas && ftTurmas.length > 0) {
            ftTurmas.sort((a, b) => {
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
            fotos = [...ftTurmas];
        }
        if (ftIrmaos && ftIrmaos.length > 0) {
            fotos = [...fotos, ...ftIrmaos];
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
            return (
                <>
                    <div className={`${styles.title} center`}>
                        <h3>Kit Fotográfico Escolar 2020</h3>
                    </div>
                    <div className="content container">
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
    
                        <div className={`${styles.title}`}>
                            <h4>Pedido</h4>
                        </div>
    
                        <PedidoForm 
                            aluno={nomeAluno}
                            turma={turma}
                            escola={escola}
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
                                    Pedido {this.state.nPedido} realizado
                                </span>
                            </span>
                        </div>
                        <p>
                            Mussum Ipsum, cacilds vidis litro abertis. Suco de cevadiss deixa as pessoas mais interessantis. 
                            Mais vale um bebadis conhecidiss, que um alcoolatra anonimis. Delegadis gente finis, bibendum egestas 
                            augue arcu ut est. Aenean aliquam molestie leo, vitae iaculis nisl.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

}