import BaseApiService from '../Services/BaseApiService/BaseApiService';

const BASE_URL = '/turma';

class TurmaService extends BaseApiService {

    async getListPorEscola(idEscola) {
        try {
            const res = await this.axiosInstance.get(`${BASE_URL}/por-escola/${idEscola}`);
            return res.data;
        } catch (error) {
            return error;
        }
    }

    async getListNomesPorEscola(idEscola) {
        try {
            const res = await this.axiosInstance.get(`${BASE_URL}/nomes/por-escola/${idEscola}`);
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

    async postTurma(turma) {
        try {
            const res = await this.axiosInstance.post(BASE_URL, turma);
            return res.data;
        } catch (error) {
            return error;
        }
    }

    async deleteTurma(id) {
        try {
            await this.axiosInstance.delete(`${BASE_URL}/${id}`);
        } catch (error) {
            return error;
        }
    }

    async adicionarFoto(id, foto) {
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

    async removerFoto(idTurma, idFoto) {
        try {
            await this.axiosInstance.delete(`${BASE_URL}/${idTurma}/foto/${idFoto}`)    
        } catch (error) {
            return error;
        }
    }

}
export default new TurmaService();
