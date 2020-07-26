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

    async postEscola(escola) {
        try {
            const res = await this.axiosInstance.post(BASE_URL, escola);
            return res.data;
        } catch (error) {
            throw this.parseError(error);
        }
    }

}
export default new EscolaService();
