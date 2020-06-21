import './AreaAdmin.css'
import React, { Fragment } from 'react';
import { Route, NavLink, Switch } from 'react-router-dom';
import Rotas from './AreaAdminRotas';
import BasePage from "../BasePage/BasePage";
import ListaEscola from "./Escola/lista-escola/ListaEscola"
import EscolaForm from './Escola/EscolaForm';
import ListaTurma from './Turma/lista-turma/ListaTurma';
import TurmaForm from './Turma/TurmaForm';
import ListaAluno from './Aluno/lista-aluno/ListaAluno';
import AlunoForm from './Aluno/AlunoForm';

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
        this.props.history.push(Rotas.ALUNO_LISTA);
    }

    editarTurma = (id) => {
        this.props.history.push(Rotas.TURMA_EDICAO.replace(':id', id));
    }

    editarAluno = (id) => {
        this.props.history.push(Rotas.ALUNO_EDICAO.replace(':id', id));
    }

    resetState = () => {
        this.setState(this.stateInicial);
    }

    resetTurma = () => {
        this.setState({
            turma: this.stateInicial.turma,
            aluno: this.stateInicial.aluno
        });
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
                                            <span className="pl-2 text-truncate">
                                                {this.state.turma ? this.state.turma.nome : 'Turma'}
                                            </span>
                                        </NavLink>
                                    ) : ''
                                }

                                {this.state.escola && this.state.turma ?
                                    (
                                        <NavLink to={Rotas.ALUNO_LISTA} onClick={this.resetAluno} className="breadcrumb">
                                            <i className="material-icons">school</i>
                                            <span className="pl-2 text-truncate">
                                                {this.state.aluno ? this.state.aluno.nome : 'Aluno'}
                                            </span>
                                        </NavLink>
                                    ) : ''
                                }
                            </div>
                        </div>
                    </nav>
                    <div className="row mt-3">
                        <div className="col s12">
                            <Switch>
                                <Route path={Rotas.ESCOLA_LISTA} exact={true} render={routeProps => (
                                    <ListaEscola {...routeProps} selecionar={this.selecionarEscola} />
                                )} />
                                <Route path={Rotas.ESCOLA_NOVO} exact={true} render={routeProps => (
                                    <EscolaForm {...routeProps} selecionar={this.selecionarEscola} />
                                )} />


                                <Route path={Rotas.TURMA_LISTA} exact={true} render={routeProps => (
                                    <ListaTurma {...routeProps} escola={this.state.escola} selecionar={this.selecionarTurma} editar={this.editarTurma} />
                                )} />
                                <Route path={Rotas.TURMA_EDICAO} exact={true} render={routeProps => (
                                    <TurmaForm {...routeProps} />
                                )} />
                                <Route path={Rotas.TURMA_NOVO} exact={true} render={routeProps => (
                                    <TurmaForm {...routeProps} escola={this.state.escola} selecionar={this.selecionarTurma} />
                                )} />


                                <Route path={Rotas.ALUNO_LISTA} exact={true} render={routeProps => (
                                    <ListaAluno {...routeProps} turma={this.state.turma} editar={this.editarAluno} />
                                )} />
                                <Route path={Rotas.ALUNO_EDICAO} exact={true} render={routeProps => (
                                    <AlunoForm {...routeProps} turma={this.state.turma} />
                                )} />
                                <Route path={Rotas.ALUNO_NOVO} exact={true} render={routeProps => (
                                    <AlunoForm {...routeProps} turma={this.state.turma} />
                                )} />
                            </Switch>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}
export default AreaAdmin;