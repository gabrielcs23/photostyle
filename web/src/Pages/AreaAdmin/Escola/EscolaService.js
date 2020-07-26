import BaseApiService from '../Services/BaseApiService/BaseApiService';

const BASE_URL = '/escola';

class EscolaService extends BaseApiService {

    async getList() {
        try {
            const res = await this.axiosInstance.get(BASE_URL);
            return res.data;
        } catch (error) {
            return error;
        }
    }
    
    // getList: async () => {
    //     const res = await axios.get(BASE_URL);
    //     return res.data;
    // },

    // getPorId: async () => {
    //     const res = await axios.get(BASE_URL)
    // },

    async postEscola(escola) {
        try {
            const res = await this.axiosInstance.post(BASE_URL, escola);
            return res.data;
        } catch (error) {
            return error;
        }
    }

    // postEscola: async (escola) => {
    //     const res = await axios.post(BASE_URL, escola);
    //     return res.data;
    // },

}
export default new EscolaService();
