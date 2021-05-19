import Cleave from "cleave.js/react";
import React from "react";
import Select from "../../../Utils/Select/Select";

const divisoria = {
    display: 'flex',
    flexWrap: 'nowrap',
    flexGrow: 1,
    width: '100%',
    borderTop: '0.5px solid grey'
}

const opcoes = [
    {
        nome: 'Não',
        value: false
    },
    {
        nome : 'Sim',
        value: true
    }
]

const getOpcaoSelecionada = (valorCampo) => {
    return opcoes.findIndex(op => op.value === valorCampo)
}

const OpcaoKit = ({kit, id, onChange}) => {
    const { nome, valor, isIrmao, isTurma } = kit;
    
    const selecionar = (op, name) =>
        onChange({
            target: {
                name: name,
                value: opcoes[op].value,
            },
    });

    return (
        <>
            <span style={divisoria} />

            <div className="row">
                <div className="input-field col s12">
                    <label htmlFor={`kit-nome-${id}`}>Nome</label>
                    <input 
                        className="validate"
                        id={`kit-nome-${id}`}
                        name={`nome`}
                        type="text"
                        value={nome}
                        onChange={onChange}
                    />
                </div>
            </div>
            <div className="row">
                <div className="input-field col s12 m4">
                    <Cleave
                        className="validate"
                        id={`kit-valor-${id}`}
                        name={`valor`}
                        type="text"
                        value={valor}
                        options={{numeral: true}}
                        onChange={onChange}
                    />
                </div>
                <div className="input-field col s12 m4 mb-3">
                    <Select
                        composedKey={`kit-turma-${id}`}
                        label={'Turma'}
                        options={opcoes}
                        selecionar={sel => selecionar(sel, "isTurma")}
                        valorInicial={getOpcaoSelecionada(isTurma)}
                        autoSelect
                    />
                </div>
                <div className="input-field col s12 m4 mb-3">
                    <Select
                        composedKey={`kit-irmao-${id}`}
                        label={'Irmão'}
                        options={opcoes}
                        selecionar={sel => selecionar(sel, "isIrmao")}
                        valorInicial={getOpcaoSelecionada(isIrmao)}
                        autoSelect
                    />
                </div>
            </div>
            
            <span style={divisoria} />
        </>
    );
}

export default OpcaoKit;
