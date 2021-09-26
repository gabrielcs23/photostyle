import BaseApiService from '../Services/BaseApiService/BaseApiService';

const BASE_URL = '/escola';

class EscolaService extends BaseApiService {

    async getList() {
        try {
            const res = await this.axiosInstance.get(BASE_URL);
            return res.data;
        } catch (error) {
            throw this.parseError(error);
        }
    }

    async getPorId(id) {
        try {
            const res = await this.axiosInstance.get(`${BASE_URL}/${id}`)
            return res.data;
        } catch (error) {
            throw this.parseError(error);
        }
    }

    async postEscola(escola) {
        try {
            const res = await this.axiosInstance.post(BASE_URL, escola);
            return res.data;
        } catch (error) {
            throw this.parseError(error);
        }
    }

    async getTabelaPreco(idEscola) {
        try {
            const res = await this.axiosInstance.get(`${BASE_URL}/${idEscola}/tabela`);
            return res.data;
        } catch (error) {
            throw this.parseError(error);
        }
    }

    async postTabelaPreco(idEscola, tabela) {
        try {
            const res = await this.axiosInstance.post(`${BASE_URL}/${idEscola}/tabela`, tabela);
            return res.data;
        } catch (error) {
            throw this.parseError(error);
        }
    }

    async patchTabelaPreco(idTabela, tabela) {
        try {
            const res = await this.axiosInstance.patch(`${BASE_URL}/tabela/${idTabela}`, tabela);
            return res.data;
        } catch (error) {
            throw this.parseError(error);
        }
    }

    async getMostruario(idEscola) {
        try {
            const res = await this.axiosInstance.get(`${BASE_URL}/${idEscola}/mostruario`);
            return res.data;
        } catch (error) {
            throw this.parseError(error);
        }
    }

    async adicionarFotosMostruario(idMostruario, fotos) {
        try {
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
            return await this.axiosInstance.post(`${BASE_URL}/mostruario/${idMostruario}/fotos`, fotos, config);
        } catch (error) {
            throw this.parseError(error);
        }
    }

    async removerFotoMostruario(idMostruario, idFoto) {
        try {
            await this.axiosInstance.delete(`${BASE_URL}/mostruario/${idMostruario}/foto/${idFoto}`)    
        } catch (error) {
            throw this.parseError(error);
        }
    }

    async downloadCodigoAlunos(id) {
        try {
            return await this.axiosInstance.get(`${BASE_URL}/${id}/exportar-codigos`, { responseType: 'blob' })    
        } catch (error) {
            throw this.parseError(error);
        }
    }

    async listarTabelas() {
        try {
            const res = await this.axiosInstance.get(`${BASE_URL}/tabela`);
            return res.data;
        } catch (error) {
            throw this.parseError(error);
        }
    }

    async copiarTabela(id, idTabela) {
        try {
            const res = await this.axiosInstance.post(`${BASE_URL}/${id}/tabela/${idTabela}`);
            return res.data;
        } catch (error) {
            throw this.parseError(error);
        }
    }

}
export default new EscolaService();
