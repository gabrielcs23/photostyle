class Foto {
    id;
    url;
    formData;

    constructor(file) {
        const formData = new FormData();
        formData.append('file', file, file.name);
        this.formData = formData;
    }

}
export default Foto;
