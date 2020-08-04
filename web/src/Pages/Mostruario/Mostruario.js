import React from 'react';
import BasePage from '../BasePage/BasePage';

export default class Mostruario extends BasePage {

    componentDidMount() {
        const { match: { params: {chave} } } = this.props;
        console.log(chave)
    }

    renderPage() {
        return (
            <span></span>
        );
    }

}