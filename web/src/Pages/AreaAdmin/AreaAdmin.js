import './AreaAdmin.css'
import React, { Fragment } from 'react';
import { Route, NavLink } from 'react-router-dom';
import Rotas from './AreaAdminRotas';
import BasePage from "../BasePage/BasePage";
import ListaEscola from "./Escola/lista-escola/ListaEscola"
import EscolaForm from './Escola/EscolaForm';

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
    }

    resetState = () => {
        this.setState(this.stateInicial);
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
                                        {this.state.escola ? this.state.escola.nome : 'Escola'}
                                    </span>
                                </NavLink>
                                
                                {this.state.escola ? 
                                    (
                                        <a href="#!" className="breadcrumb">
                                            <i className="material-icons">menu_book</i>
                                            <span className="pl-2">
                                                {this.state.turma ? this.state.escola.turma : 'Turma'}
                                            </span>
                                        </a>
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
                                <ListaEscola {...routeProps} seleciona={this.selecionarEscola} />
                            )} />
                            <Route path={Rotas.ESCOLA_NOVO} exact={true} render={routeProps => (
                                <EscolaForm {...routeProps} seleciona={this.selecionarEscola} />
                            )} />
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}
export default AreaAdmin;