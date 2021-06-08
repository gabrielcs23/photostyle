import React from "react";
import ImgBox from "../../Utils/ImgBox/ImgBox";
import DisplayFotos from "../DisplayFotos/DisplayFotos";

function Mostruario({ styles, kit, mostraExtras, showHelper }) {
  const {
    codigoAcesso,
    escola,
    turma,
    nomeAluno,
    fotoIndividual,
    fotosIrmaos,
    fotosTurma,
    fotosOpcionais,
    fotosMostruarioEscola,
  } = kit;

  function temFotosIrmaos(kit) {
    return kit?.fotosIrmaos?.length > 0;
  }

  function getFotosDisplay(ftsTurma, ftsIrmaos) {
    let fotos = [];
    if (ftsTurma && ftsTurma.length > 0) {
      fotos = [...ftsTurma];
    }
    if (ftsIrmaos && ftsIrmaos.length > 0) {
      fotos = [...fotos, ...ftsIrmaos];
    }
    return fotos;
  }

  function getFotosMostruario(fotosMostruarioEscola, mostraExtras) {
    if (fotosMostruarioEscola && fotosMostruarioEscola.length > 0) {
      return fotosMostruarioEscola;
    }
    return mostraExtras;
  }

  return (
    <>
      {showHelper ? (
        <blockquote style={{ fontStyle: "italic" }}>
          O kit é composto por 2 (duas) fotos diagramadas, sendo:
          <ul className="browser-default">
            <li>Uma individual com legenda: nome, turma e ano.</li>
            <li>
              Uma foto do grupo com legenda: nomes dos alunos em ordem, nome dos
              professores, turma e ano.
            </li>
          </ul>
          <p>
            As fotos são impressas em papel profissional mate (fosco) e
            entregues dentro de um folder.
          </p>
        </blockquote>
      ) : null}

      <div className="header">
        <div className="left-align">
          <p>
            <b>Código de Acesso:</b> {codigoAcesso}
          </p>
          <p>
            <b>Escola:</b> {escola}
          </p>
          <p>
            <b>Turma:</b> {turma}
          </p>
          <p>
            <b>Aluno:</b> {nomeAluno}
          </p>
        </div>
      </div>

      <hr />

      <div className={`${styles.title} center`}>
        <h4>Foto Individual</h4>
      </div>

      <div
        className={`center mb-5 ${styles.fotoIndividual}`}
        id="fotoIndividual"
      >
        <ImgBox img={fotoIndividual?.url} alt="foto individual" />
      </div>

      {fotosTurma?.length ? (
        <>
          <hr />
          <div className={`${styles.title} center`}>
            <h4>{`Foto${fotosTurma.length > 1 ? "s" : ""} de Turma ${
              temFotosIrmaos(kit) ? "e de Irmãos" : ""
            }`}</h4>
          </div>

          <div className={styles.explicacaoCenter}>
            <blockquote>
              Mostra das fotos de turma oficial e funny
              {`${temFotosIrmaos(kit) ? " e foto de Irmãos" : ""}`}
            </blockquote>
          </div>

          <div className="row mb-5">
            <div className="col s12 mt-2">
              <DisplayFotos fotos={getFotosDisplay(fotosTurma, fotosIrmaos)} />
            </div>
          </div>
        </>
      ) : null}

      {fotosOpcionais?.length ? (
        <>
          <hr />
          <div className={`${styles.title} center`}>
            <h4>Fotos Opcionais</h4>
          </div>

          <div className="row mb-5">
            <div className="col s12 mt-2">
              <DisplayFotos fotos={fotosOpcionais} />
            </div>
          </div>
        </>
      ) : null}

      <hr />

      <div className={`${styles.title} center`}>
        <h4>Modelos</h4>
      </div>

      <div className={styles.explicacaoCenter}>
        <blockquote>
          Mostra das artes do Kit Fotográfico Escolar e opções de fotos extras.
        </blockquote>
      </div>

      <div className="row mb-5">
        <div className="col s12 mt-2">
          <DisplayFotos
            fotos={getFotosMostruario(fotosMostruarioEscola, mostraExtras)}
          />
        </div>
      </div>

      <hr />

      <div className={`${styles.title}`}>
        <h4>Pedido</h4>
      </div>
    </>
  );
}

export default Mostruario;
