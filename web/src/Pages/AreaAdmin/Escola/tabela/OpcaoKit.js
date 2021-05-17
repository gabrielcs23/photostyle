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

const OpcaoKit = ({kit, id, onChange}) => {
    const { nome, valor, isIrmao, isTurma } = kit;

    console.log(kit)
    
    const selecionar = (op) => onChange(op.value)

    return (
        <>
            {console.log(kit)}
            <span style={divisoria} />

            <div className="row">
                <div className="input-field col s12">
                    <label htmlFor={`nome-${id}`}>Nome</label>
                    <input 
                        className="validate"
                        id={`kit-nome-${id}`}
                        name={`kit-nome-${id}`}
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
                        name={`kit-valor-${id}`}
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
                        selecionar={selecionar}
                    />
                </div>
                <div className="input-field col s12 m4 mb-3">
                    <Select
                        composedKey={`kit-irmao-${id}`}
                        label={'Irmão'}
                        options={opcoes}
                        selecionar={selecionar}
                    />
                </div>
            </div>
            
            <span style={divisoria} />
        </>
    );
}

export default OpcaoKit;
