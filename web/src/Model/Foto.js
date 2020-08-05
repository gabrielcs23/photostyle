class Foto {
    id;
    url;
    descricao;
    formData;

    constructor(file) {
        const formData = new FormData();
        formData.append('file', file, file.name);
        this.formData = formData;
    }

}
export default Foto;
