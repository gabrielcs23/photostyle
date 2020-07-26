import BaseApiService from '../Services/BaseApiService/BaseApiService';

const BASE_URL = '/aluno';

class AlunoService extends BaseApiService {

    async getListPorTurma(idTurma) {
        try {
            const res = await this.axiosInstance.get(`${BASE_URL}/por-turma/${idTurma}`);
            return res.data;
        } catch (error) {
            return error;
        }
    }

    async getListNomesPorTurma(idTurma) {
        try {
            const res = await this.axiosInstance.get(`${BASE_URL}/nomes/por-turma/${idTurma}`);
            return res.data;
        } catch (error) {
            return error;
        }
    }

    async getPorId(id) {
        try {
            const res = await this.axiosInstance.get(`${BASE_URL}/${id}`)
            return res.data;
        } catch (error) {
            return error;
        }
    }

    async postAluno(aluno) {
        try {
            const res = await this.axiosInstance.post(BASE_URL, aluno);
            return res.data;
        } catch (error) {
            return error;
        }
    }

    async deleteAluno(id) {
        try {
            await this.axiosInstance.delete(`${BASE_URL}/${id}`);
        } catch (error) {
            return error;
        }
    }

    async uploadFoto(id, foto) {
        try {
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
            return this.axiosInstance.post(`${BASE_URL}/${id}/foto`, foto, config);
        } catch (error) {
            return error;
        }
    }

    async removerFoto(id) {
        try {
            await this.axiosInstance.delete(`${BASE_URL}/${id}/foto`);
        } catch (error) {
            return error;
        }
    }

    async adicionarFotoIrmao(id, foto) {
        try {
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
            return this.axiosInstance.post(`${BASE_URL}/${id}/foto-irmao`, foto, config);
        } catch (error) {
            return error;
        }
    }

    async removerFotoIrmao(idTurma, idFoto) {
        try {
            await this.axiosInstance.delete(`${BASE_URL}/${idTurma}/foto-irmao/${idFoto}`)
        } catch (error) {
            return error;
        }
    }

}
export default new AlunoService();
