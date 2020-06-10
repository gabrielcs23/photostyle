import './AreaAdmin.css'
import React, { Fragment } from 'react';
import { Route, NavLink } from 'react-router-dom';
import BasePage from "../BasePage/BasePage";
import ListaEscola from "./Escola/lista-escola/ListaEscola"
import EscolaForm from './Escola/EscolaForm';

class AreaAdmin extends BasePage {

    constructor(props) {
        super(props);
        this.state = {
            escola: undefined,
            turma: undefined,
            aluno: undefined
        }
    }

    renderPage() {
        return (
            <Fragment>
                <div className="container">
                    <nav className="breadcrumb-nav">
                        <div className="nav-wrapper white mt-1">
                            <div className="center-align">
                                <NavLink to="/admin/escola" className="breadcrumb">
                                    <i className="material-icons">account_balance</i>
                                    <span className="pl-2">Escola</span>
                                </NavLink>
                                
                                <a href="#!" className="breadcrumb">
                                    <i className="material-icons">menu_book</i>
                                    <span className="pl-2">Turma</span>
                                </a>
                                <a href="#!" className="breadcrumb">
                                    <i className="material-icons">school</i>
                                    <span className="pl-2">Aluno</span>
                                </a>
                            </div>
                        </div>
                    </nav>
                    <div className="row mt-3">
                        <div className="col s12">
                            <Route path="/admin/escola" exact={true} component={ListaEscola} />
                            <Route path="/admin/escola/novo" exact={true} component={EscolaForm} />
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}
export default AreaAdmin;