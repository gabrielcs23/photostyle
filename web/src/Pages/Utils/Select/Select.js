import React, { Component } from 'react';
import M from 'materialize-css';

class Select extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            options: props.options,
            label: props.label,
            disabled: props.disabled,
            selecionado: ''
        }
    }

    componentDidMount() {
        M.FormSelect.init(this.Select);
    }

    select(event) {
        const valor = event.target.value;
        this.setState({selecionado: valor});
        this.props.selecionar(valor);
    }

    render() {
        const option = this.state.options.slice().map((option, idx) => (
            <option value={idx} key={option.id}>
                {option.nome}
            </option>
        ));
        
        console.log(this.state.disabled)

        return (
            <>
                <select
                    ref={Select => {
                        this.Select = Select;
                    }}
                    value={this.state.selecionado}
                    onChange={event => this.select(event)}
                    disabled={this.state.disabled}
                >
                    <option value="" disabled={true}>Selecione</option>
                    {option}
                </select>
                <label>{this.state.label}</label>
            </>
        )
    }

}
export default Select;