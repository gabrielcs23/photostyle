import React, { Component } from 'react';
import M from 'materialize-css';

class Select extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            selecionado: ''
        }
    }

    componentDidMount() {
        this.formSelect = M.FormSelect.init(this.Select);
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.props.disabled !== prevProps.disabled) {
            if(this.state.selecionado !== prevState.selecionado) {
                this.setState({selecionado: ''});
            }
            this.formSelect.destroy();
            this.formSelect = M.FormSelect.init(this.Select);
        }
    }

    select(event) {
        const valor = event.target.value;
        this.setState({selecionado: valor});
        this.props.selecionar(valor);
    }

    render() {
        const option = this.props.options.slice().map((option, idx) => (
            <option value={idx} key={option.id}>
                {option.nome}
            </option>
        ));

        return (
            <>
                <select
                    ref={Select => {
                        this.Select = Select;
                    }}
                    value={this.state.selecionado}
                    onChange={event => this.select(event)}
                    disabled={this.props.disabled}
                >
                    <option value="" disabled={true}>Selecione</option>
                    {option}
                </select>
                <label>{this.props.label}</label>
            </>
        )
    }

}
export default Select;