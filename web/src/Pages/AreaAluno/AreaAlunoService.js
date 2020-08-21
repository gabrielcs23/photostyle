import axios from 'axios'
import ServiceConstants from '../Utils/ServiceUtils/ServiceConstants'

class AreaAlunoService {

    constructor() {
        this.axiosInstance = axios.create(
            {
                baseURL: `${ServiceConstants.API_URL}/kit`,
            }
        );
    }

    parseError(error) {
        return error.response ? error.response : error;
    }

    async getKit(chave) {
        try {
            const res = await this.axiosInstance.get(`/${chave}`);
            return res.data;
        } catch (error) {
            throw this.parseError(error);
        }
    }

    async fazerPedido(pedido) {
        try {
            await this.axiosInstance.post('/pedido', pedido);
        } catch (error) {
            throw this.parseError(error);
        }
    }

}
export default new AreaAlunoService();