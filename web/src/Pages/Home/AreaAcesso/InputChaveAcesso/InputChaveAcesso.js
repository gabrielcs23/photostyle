import React from 'react';
import Cleave from 'cleave.js/react';

const InputChaveAcesso = props => {
    const onChange = event => {
        // props.onChange(event.target.value);
        // formatted pretty value
        console.log(event.target.value);

        // raw value
        console.log(event.target.rawValue);
    };

    const formatOptions = {
        delimiter: '-',
        blocks: [4, 4],
        uppercase: true
    }

    return (
        // <div className="input-field">
        //     <label className="center-align" for="chave">Insira aqui sua chave de acesso</label>
        //     <input 
        //         id="chave"
        //         type="text"
        //         maxlength="8"
        //         value={props.value}
        //         onChange={onChange}
        //     />
        // </div>
        <Cleave placeholder="Insira aqui sua chave de acesso"
                options={formatOptions}
                onChange={onChange} />
    );
}
export default InputChaveAcesso
