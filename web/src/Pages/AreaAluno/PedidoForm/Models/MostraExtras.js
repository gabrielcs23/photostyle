export default class MostraExtras {
    static get() {
        const BASE_URL = `${process.env.PUBLIC_URL}/assets/images/extras/`;
        return [
            {
                url: BASE_URL + 'Mostra Diagramado Aluno.jpg',
                descricao: 'Diagramado Aluno'
            },
            {
                url: BASE_URL + 'Mostra turma.jpg',
                descricao: 'Diagramado Turma'
            },
            {
                url: BASE_URL + 'Mostra Tag Lagoa.jpg',
                descricao: 'Tag Lagoa'
            },
            {
                url: BASE_URL + 'Mostra Tag Leblon.jpg',
                descricao: 'Tag Leblon'
            },
            {
                url: BASE_URL + 'Mostra kids.jpg',
                descricao: 'Scrap kids'
            },
            {
                url: BASE_URL + 'Mostra Frases.jpg',
                descricao: 'Scrap frases'
            },
            {
                url: BASE_URL + 'Mostra Teen 1.jpg',
                descricao: 'Scrap teen1'
            },
            {
                url: BASE_URL + 'Mostra Teen 2.jpg',
                descricao: 'Scrap teen2'
            },
            {
                url: BASE_URL + 'Mostra foto+ano.jpg',
                descricao: 'Scrap foto+ano'
            },
        ]
    }
}