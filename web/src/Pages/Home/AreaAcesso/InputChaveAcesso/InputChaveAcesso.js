import React from "react";
import Cleave from "cleave.js/react";

const InputChaveAcesso = ({ onChange, onEnterKeyDown }) => {
  const onChangeInput = (event) => {
    onChange(event.target.value, event.target.rawValue);
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onEnterKeyDown();
    }
  };

  const formatOptions = {
    delimiter: "-",
    blocks: [4, 6],
    uppercase: true,
  };

  return (
    <Cleave
      placeholder="Insira aqui sua chave de acesso"
      options={formatOptions}
      onChange={onChangeInput}
      onKeyDown={onKeyDown}
    />
  );
};
export default InputChaveAcesso;
