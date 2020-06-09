import './App.css';
import 'materialize-css/dist/css/materialize.min.css'
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import NotFound from './Pages/NotFound/NotFound'
import Home from './Pages/Home/Home'
import Sobre from './Pages/Sobre/Sobre';
import Contato from './Pages/Contato/Contato';
import AreaAdmin from './Pages/AreaAdmin/AreaAdmin';

function App() {
    return (
        <BrowserRouter> 
            <Switch>
                <Route path="/" exact={true} component={Home} />
                <Route path="/sobre" exact={true} component={Sobre} />
                <Route path="/contato" exact={true} component={Contato} />
                <Route path="/admin" component={AreaAdmin} />
                <Route component={NotFound} />
            </Switch>
        </BrowserRouter>
    );
}

export default App;
