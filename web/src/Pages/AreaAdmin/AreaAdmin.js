import './AreaAdmin.css'
import React, { Fragment } from 'react';
import { Route, NavLink } from 'react-router-dom';
import Rotas from './AreaAdminRotas';
import BasePage from "../BasePage/BasePage";
import ListaEscola from "./Escola/lista-escola/ListaEscola"
import EscolaForm from './Escola/EscolaForm';
import ListaTurma from './Turma/lista-turma/ListaTurma';
import TurmaForm from './Turma/TurmaForm';

class AreaAdmin extends BasePage {

    constructor(props) {
        super(props);

        this.stateInicial = {
            escola: undefined,
            turma: undefined,
            aluno: undefined
        };

        this.state = this.stateInicial;
    }

    selecionarEscola = escola => {
        this.setState({escola: escola});
        this.props.history.push(Rotas.TURMA_LISTA);
    }

    selecionarTurma = turma => {
        this.setState({turma: turma});
    }

    resetState = () => {
        this.setState(this.stateInicial);
    }

    resetTurma = () => {
        this.setState({turma: this.stateInicial.turma});
    }

    resetAluno = () => {
        this.setState({aluno: this.stateInicial.aluno});
    }

    renderPage() {
        return (
            <Fragment>
                <div className="container">
                    <nav className="breadcrumb-nav">
                        <div className="nav-wrapper white mt-1">
                            <div className="center-align">
                                <NavLink to={Rotas.ESCOLA_LISTA} onClick={this.resetState} className="breadcrumb">
                                    <i className="material-icons">account_balance</i>
                                    <span className="pl-2">
                                        { this.state.escola ? 
                                            this.state.escola.apelido ? this.state.escola.apelido
                                            : this.state.escola.nome
                                            : 'Escola'}
                                    </span>
                                </NavLink>
                                
                                {this.state.escola ? 
                                    (
                                        <NavLink to={Rotas.TURMA_LISTA} onClick={this.resetTurma} className="breadcrumb">
                                            <i className="material-icons">menu_book</i>
                                            <span className="pl-2">
                                                {this.state.turma ? this.state.turma.nome : 'Turma'}
                                            </span>
                                        </NavLink>
                                    ) : ''
                                }

                                {this.state.escola && this.state.turma ?
                                    (
                                        <a href="#!" className="breadcrumb">
                                            <i className="material-icons">school</i>
                                            <span className="pl-2">
                                                {this.state.aluno ? this.state.escola.aluno : 'Aluno'}
                                            </span>
                                        </a>
                                    ) : ''
                                }
                            </div>
                        </div>
                    </nav>
                    <div className="row mt-3">
                        <div className="col s12">
                            <Route path={Rotas.ESCOLA_LISTA} exact={true} render={routeProps => (
                                <ListaEscola {...routeProps} selecionar={this.selecionarEscola} />
                            )} />
                            <Route path={Rotas.ESCOLA_NOVO} exact={true} render={routeProps => (
                                <EscolaForm {...routeProps} selecionar={this.selecionarEscola} />
                            )} />
                            <Route path={Rotas.TURMA_LISTA} exact={true} render={routeProps => (
                                <ListaTurma {...routeProps} escola={this.state.escola} selecionar={this.selecionarTurma} />
                            )} />
                            <Route path={Rotas.TURMA_NOVO} exact={true} render={routeProps => (
                                <TurmaForm {...routeProps} escola={this.state.escola} selecionar={this.selecionarTurma} />
                            )} />
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}
export default AreaAdmin;