import axios from 'axios';
import ServiceConstants from '../../Utils/ServiceUtils/ServiceConstants'

const BASE_URL = ServiceConstants.BACKEND_URL + '/aluno';

const AlunoService = {

    getListPorTurma: async (idTurma) => {
        const res = await axios.get(BASE_URL + `/por-turma/${idTurma}`);
        return res.data;
    },

    getListNomesPorTurma: async (idTurma) => {
        const res = await axios.get(BASE_URL + `/nomes/por-turma/${idTurma}`);
        return res.data;
    },

    getPorId: async (id) => {
        const res = await axios.get(BASE_URL + `/${id}`)
        return res.data;
    },

    postAluno: async (aluno) => {
        const res = await axios.post(BASE_URL, aluno);
        return res.data;
    },

    deleteAluno: async (id) => {
        await axios.delete(BASE_URL + `/${id}`);
    },

    uploadFoto: (id, foto) => {
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        return axios.post(BASE_URL + `/${id}/foto`, foto, config);
    },

    removerFoto: async (id) => {
        await axios.delete(BASE_URL + `/${id}/foto`);
    },

    adicionarFotoIrmao: (id, foto) => {
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        return axios.post(BASE_URL + `/${id}/foto-irmao`, foto, config);
    },

    removerFotoIrmao: async (idTurma, idFoto) => {
        await axios.delete(BASE_URL + `/${idTurma}/foto-irmao/${idFoto}`)
    }

}
export default AlunoService;
