import React, { Component } from 'react';
import M from 'materialize-css';

class Select extends Component {
    
    constructor(props) {
        super(props);

        this.composedKey = this.props.composedKey;
        
        // se valor foi carregado do banco
        if (this.props.disabled && this.props.options?.length === 1) {
            this.state = {
                selecionado: this.props.options[0]
            }
        } else {
            this.state = {
                selecionado: ''
            }
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
        const options = this.props.options.slice().map((option, idx) => (
            <option value={idx} key={this.composedKey + option.id}>
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
                    {options}
                </select>
                <label>{this.props.label}</label>
            </>
        )
    }

}
export default Select;