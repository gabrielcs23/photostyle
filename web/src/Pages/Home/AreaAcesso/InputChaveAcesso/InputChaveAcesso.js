import React from 'react';
import Cleave from 'cleave.js/react';

const InputChaveAcesso = props => {

    const onChange = event => {
        props.onChange(event.target.value, event.target.rawValue);
    };

    const formatOptions = {
        delimiter: '-',
        blocks: [4, 6],
        uppercase: true
    }

    return (
        <Cleave placeholder="Insira aqui sua chave de acesso"
                options={formatOptions}
                onChange={onChange} />
    );
}
export default InputChaveAcesso
