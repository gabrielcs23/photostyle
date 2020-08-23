export default class MostraExtras {
    static get() {
        const BASE_URL = `${process.env.PUBLIC_URL}/assets/images/extras/`;
        return [
            {
                url: BASE_URL + 'Diagramado Aluno.jpg',
                descricao: 'Diagramado Aluno'
            },
            {
                url: BASE_URL + 'Diagramado Turma.jpg',
                descricao: 'Diagramado Turma'
            },
            {
                url: BASE_URL + 'Id Mochila.jpg',
                descricao: 'Identificador de mochila'
            },
            {
                url: BASE_URL + 'Scrap kids.jpg',
                descricao: 'Scrap kids'
            },
            {
                url: BASE_URL + 'Scrap frases.jpg',
                descricao: 'Scrap frases'
            },
            {
                url: BASE_URL + 'Scrap teen1.jpg',
                descricao: 'Scrap teen1'
            },
            {
                url: BASE_URL + 'Scrap teen2.jpg',
                descricao: 'Scrap teen2'
            },
            {
                url: BASE_URL + 'Scrap foto+ano.jpg',
                descricao: 'Scrap foto+ano'
            },
            {
                url: BASE_URL + 'Tabuada.jpg',
                descricao: 'Tabuada Divertida'
            },
        ]
    }
}