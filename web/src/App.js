import './App.css';
import './materialize-custom.css'
import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import rotas from './AppRotas'

import Home from './Pages/Home/Home'
import Sobre from './Pages/Sobre/Sobre';
import Contato from './Pages/Contato/Contato';
import AreaAdmin from './Pages/AreaAdmin/AreaAdmin';
import Mostruario from './Pages/Mostruario/Mostruario';

function App() {
    return (
        <BrowserRouter> 
            <Switch>
                <Route path={rotas.HOME} exact={true} component={Home} />
                <Route path={rotas.SOBRE} exact={true} component={Sobre} />
                <Route path={rotas.CONTATO} exact={true} component={Contato} />
                <Route path={rotas.ADMIN} component={AreaAdmin} />
                <Route path={rotas.MOSTRUARIO} component={Mostruario} />
                <Route path="*">
                    <Redirect to={rotas.HOME} />
                </Route>
            </Switch>
        </BrowserRouter>
    );
}

export default App;
