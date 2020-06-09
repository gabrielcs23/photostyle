import axios from 'axios';
import ServiceConstants from '../../Utils/ServiceUtils/ServiceConstants'

const BASE_URL = ServiceConstants.BACKEND_URL + '/escola';

const EscolaService = {

    getList: async () => {
        const res = await axios.get(BASE_URL);
        return res.data;
    },

    // getPorId: async () => {
    //     const res = await axios.get(BASE_URL)
    // },

    postEscola: async (escola) => {
        const res = await axios.post(BASE_URL, escola);
        return res.data;
    },

}
export default EscolaService;
