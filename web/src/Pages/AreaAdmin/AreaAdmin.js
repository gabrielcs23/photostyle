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
                <ul className="sidenav sidenav-fixed">
                    <li>
                        <NavLink to="/admin/escola"><i className="material-icons">account_balance</i>Escola</NavLink>
                    </li>
                    <li>
                        <a href="#item2"><i className="material-icons">menu_book</i>Turma</a>
                        </li>
                    <li>
                        <a href="#item3"><i className="material-icons">school</i>Aluno</a>
                    </li>
                </ul>
                <div className="row mt-1">
                    <div className="col s2">
                    </div>
                    <div className="col s10">
                        <Route path="/admin/escola" exact={true} component={ListaEscola} />
                        <Route path="/admin/escola/novo" exact={true} component={EscolaForm} />
                    </div>
                </div>
            </Fragment>
        );
    }
}
export default AreaAdmin;