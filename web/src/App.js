import './App.css';
import 'materialize-css/dist/css/materialize.min.css'
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import NotFound from './Components/Pages/NotFound/NotFound'
import Home from './Components/Pages/Home/Home'
import Sobre from './Components/Pages/Sobre/Sobre';
import Contato from './Components/Pages/Contato/Contato';

function App() {
    return (
        <BrowserRouter> 
            <Switch>
                <Route path="/" exact={true} component={Home} />
                <Route path="/sobre" exact={true} component={Sobre} />
                <Route path="/contato" exact={true} component={Contato} />
                <Route component={NotFound} />
            </Switch>
        </BrowserRouter>
    );
}

export default App;
