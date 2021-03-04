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
          Obrigado por realizar seu pedido!
        </p>
        <p className={`${styles.confirm}`}>
          Verifique seu e-mail, não se esquecendo da caixa de spam
        </p>
        <p className={`${styles.confirm}`}>
          Enviamos um resumo de seu pedido com os dados para pagamento.
        </p>
      </div>
    </div>
  </div>
);

export default ConfirmacaoPedido;
