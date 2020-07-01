import Aluno from "./Aluno";

class IrmaoRel {
    id;
    irmaos;
    fotos;

    constructor(irmaos, fotos, id, idRemover) {
        this.irmaos = [];
        irmaos.forEach(irmao => {
            if (!idRemover || irmao.id !== idRemover) {
                const irmaoCopia = new Aluno();
                irmaoCopia.id = irmao.id;
                this.irmaos.push(irmaoCopia);
            }
        });
        this.fotos = fotos;
        this.id = id;
    }

}
export default IrmaoRel;
