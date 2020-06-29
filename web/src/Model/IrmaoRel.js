import Aluno from "./Aluno";

class IrmaoRel {
    id;
    irmaos;
    fotos;

    constructor(irmaos, fotos) {
        this.irmaos = [];
        irmaos.forEach(irmao => {
            const irmaoCopia = new Aluno();
            irmaoCopia.id = irmao.id;
            irmaos.push(irmaoCopia);
        });
        this.fotos = fotos;
    }

}
export default IrmaoRel;
