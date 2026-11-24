import BaseApiService from '../Services/BaseApiService/BaseApiService';

const BASE_URL = '/aluno';

class AlunoService extends BaseApiService {

    async getListPorTurma(idTurma) {
        try {
            const res = await this.axiosInstance.get(`${BASE_URL}/por-turma/${idTurma}`);
            return res.data;
        } catch (error) {
            throw this.parseError(error);
        }
    }

    async getListNomesPorTurma(idTurma) {
        try {
            const res = await this.axiosInstance.get(`${BASE_URL}/nomes/por-turma/${idTurma}`);
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

    async postAluno(aluno) {
        try {
            const res = await this.axiosInstance.post(BASE_URL, aluno);
            return res.data;
        } catch (error) {
            throw this.parseError(error);
        }
    }

    async patchAluno(id, aluno) {
        try {
            const res = await this.axiosInstance.patch(`${BASE_URL}/${id}`, { nome: aluno.nome, matricula: aluno.matricula });
            return res.data;
        } catch (error) {
            throw this.parseError(error);
        }
    }

    async deleteAluno(id) {
        try {
            await this.axiosInstance.delete(`${BASE_URL}/${id}`);
        } catch (error) {
            throw this.parseError(error);
        }
    }

    async uploadFotos(id, fotos) {
        try {
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
            return await this.axiosInstance.post(`${BASE_URL}/${id}/foto`, fotos, config);
        } catch (error) {
            throw this.parseError(error);
        }
    }

    async removerFoto(id, idFoto) {
        try {
            await this.axiosInstance.delete(`${BASE_URL}/${id}/foto/${idFoto}`);
        } catch (error) {
            throw this.parseError(error);
        }
    }

    async uploadFotosOpcionais(id, fotos) {
        try {
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
            return await this.axiosInstance.post(`${BASE_URL}/${id}/opcionais`, fotos, config);
        } catch (error) {
            throw this.parseError(error);
        }
    }

    async removerFotoOpcional(id, idFoto) {
        try {
            await this.axiosInstance.delete(`${BASE_URL}/${id}/opcionais/${idFoto}`)    
        } catch (error) {
            throw this.parseError(error);
        }
    }

    async relacionarIrmaos(id, idsIrmaos) {
        try {
            const res = await this.axiosInstance.post(`${BASE_URL}/${id}/irmaos`, idsIrmaos);
            return res.data;
        } catch (error) {
            throw this.parseError(error);
        }
    }

    // retorna o grupo atualizado, ou vazio quando o grupo foi desfeito (204)
    async removerIrmao(id, idIrmao) {
        try {
            const res = await this.axiosInstance.delete(`${BASE_URL}/${id}/irmaos/${idIrmao}`);
            return res.data || null;
        } catch (error) {
            throw this.parseError(error);
        }
    }

    async substituirIrmao(id, idIrmao, idIrmaoNovo) {
        try {
            const config = {
                headers: {
                    'content-type': 'application/json'
                }
            }
            const res = await this.axiosInstance.patch(`${BASE_URL}/${id}/irmaos/${idIrmao}`, JSON.stringify(idIrmaoNovo), config);
            return res.data;
        } catch (error) {
            throw this.parseError(error);
        }
    }

    async adicionarFotoIrmao(id, foto) {
        try {
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
            return await this.axiosInstance.post(`${BASE_URL}/${id}/foto-irmao`, foto, config);
        } catch (error) {
            throw this.parseError(error);
        }
    }

    async removerFotoIrmao(idTurma, idFoto) {
        try {
            await this.axiosInstance.delete(`${BASE_URL}/${idTurma}/foto-irmao/${idFoto}`)
        } catch (error) {
            throw this.parseError(error);
        }
    }

}
export default new AlunoService();
