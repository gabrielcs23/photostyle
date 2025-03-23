import React from "react";

const ConfirmacaoPedido = ({ nPedido, styles }) => (
  <div className="container mt-5">
    <div className="card z-depth-2" style={{ cursor: "initial" }}>
      <div className="card-content">
        <div className="card-title center">
          <span className="d-inline-flex">
            <i className="small material-icons" style={{ color: "green" }}>
              check_circle
            </i>
            <span className="pl-2">
              Pedido {nPedido} encaminhado
            </span>
          </span>
        </div>
        <p className={`${styles.confirm} ${styles.agradecimento}`}>
          Obrigado por seu pedido!
        </p>
        <p className={`${styles.confirm}`}>
          Por favor, verifique seu e-mail, incluindo a caixa de spam, para garantir o recebimento.
        </p>
        <p className={`${styles.confirm}`}>
          Enviamos um resumo do seu pedido, juntamente com as informações para pagamento.
        </p>
        <p className={`${styles.confirm}`}>
          Se precisar de ajuda, estamos à disposição!
        </p>
      </div>
    </div>
  </div>
);

export default ConfirmacaoPedido;
