import React, { Component, Fragment } from 'react';
import Header from '../Utils/Header/Header';

class BasePage extends Component {

    render() {
        return (
            <Fragment>
                <Header />
                {this.renderPage()}
            </Fragment>
        );
    }

}

export default BasePage;