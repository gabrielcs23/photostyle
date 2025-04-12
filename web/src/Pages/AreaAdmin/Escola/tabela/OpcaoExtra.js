import Cleave from "cleave.js/react";
import React from "react";
import CustomSelect from "../../../Utils/CustomSelect/CustomSelect";

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

const OpcaoExtra = ({extra, id, onChange}) => {
    const { nome, valor, isIrmao, isTurma, isDigital, isOpcional } = extra;
    
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
                    <label htmlFor={`extra-nome-${id}`}>Nome</label>
                    <input 
                        className="validate"
                        id={`extra-nome-${id}`}
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
                        id={`extra-valor-${id}`}
                        name={`valor`}
                        type="text"
                        value={valor}
                        options={{numeral: true}}
                        onChange={onChange}
                    />
                </div>
                <div className="input-field col s12 m4 mb-3">
                    <CustomSelect
                        composedKey={`extra-turma-${id}`}
                        label={'Turma'}
                        options={opcoes}
                        selecionar={sel => selecionar(sel, "isTurma")}
                        valorInicial={getOpcaoSelecionada(isTurma)}
                    />
                </div>
                <div className="input-field col s12 m4 mb-3">
                    <CustomSelect
                        composedKey={`extra-irmao-${id}`}
                        label={'Irmão'}
                        options={opcoes}
                        selecionar={sel => selecionar(sel, "isIrmao")}
                        valorInicial={getOpcaoSelecionada(isIrmao)}
                    />
                </div>
            </div>
            <div className="row">
                <div className="input-field col s12 m4 mb-3">
                    <CustomSelect
                        composedKey={`extra-digital-${id}`}
                        label={'Digital'}
                        options={opcoes}
                        selecionar={sel => selecionar(sel, "isDigital")}
                        valorInicial={getOpcaoSelecionada(isDigital)}
                    />
                </div>
                <div className="input-field col s12 m4 mb-3">
                    <CustomSelect
                        composedKey={`extra-opcional-${id}`}
                        label={'Opcional'}
                        options={opcoes}
                        selecionar={sel => selecionar(sel, "isOpcional")}
                        valorInicial={getOpcaoSelecionada(isOpcional)}
                    />
                </div>
            </div>
            
            <span style={divisoria} />
        </>
    );
}

export default OpcaoExtra;
