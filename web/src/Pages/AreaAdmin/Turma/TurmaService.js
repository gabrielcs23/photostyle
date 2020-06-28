import axios from 'axios';
import ServiceConstants from '../../Utils/ServiceUtils/ServiceConstants'

const BASE_URL = ServiceConstants.BACKEND_URL + '/turma';

const TurmaService = {

    getListPorEscola: async (idEscola) => {
        const res = await axios.get(BASE_URL + `/por-escola/${idEscola}`);
        return res.data;
    },

    getListNomesPorEscola: async (idEscola) => {
        const res = await axios.get(BASE_URL + `/nomes/por-escola/${idEscola}`);
        return res.data;
    },

    getPorId: async (id) => {
        const res = await axios.get(BASE_URL + `/${id}`)
        return res.data;
    },

    postTurma: async (turma) => {
        const res = await axios.post(BASE_URL, turma);
        return res.data;
    },

    deleteTurma: async (id) => {
        await axios.delete(BASE_URL + `/${id}`);
    },

    adicionarFoto: (id, foto) => {
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        return axios.post(BASE_URL + `/${id}/foto`, foto, config);
    },

    removerFoto: async (idTurma, idFoto) => {
        await axios.delete(BASE_URL + `/${idTurma}/foto/${idFoto}`)
    }

}
export default TurmaService;
