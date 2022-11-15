import React, { Component } from 'react';
import M from 'materialize-css';
import Select from 'react-select';

class CustomSelect extends Component {
    
    constructor(props) {
        super(props);

        this.composedKey = this.props.composedKey;
        
        // se valor foi carregado do banco
        if (this.props.disabled && this.props.options?.length === 1) {
            this.state = {
                selecionado: true
            }
        } else if(this.props.valorInicial) {
            this.state = {
                selecionado: this.props.valorInicial
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
        if (this.props.selecionar) {
            const valor = event.value;
            this.setState({selecionado: valor});
            this.props.selecionar(valor);
        }
    }

    render() {
        const options = this.props.options.slice().map((option, idx) => {
            return {
                value: idx,
                label: option.nome
            }
        })

        return (
            <>
                <span>{this.props.label}</span>
                <Select
                    options={options}
                    defaultValue={this.state.selecionado && options[0]}
                    onChange={event => this.select(event)}
                    isDisabled={this.props.disabled}
                    placeholder={'Selecione...'}
                    isClearable={false}
                    backspaceRemovesValue={false}             
                />
            </>
        )
    }

}
export default CustomSelect;