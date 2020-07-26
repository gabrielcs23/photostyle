import axios from 'axios';
import ServiceConstants from '../../../Utils/ServiceUtils/ServiceConstants';

class BaseApiService {

    constructor() {
        this.axiosInstance = axios.create(
            {
                baseURL: ServiceConstants.API_URL,
                withCredentials: true,
                headers: {
                    'Access-Control-Allow-Origin' : '*'
                }
            }
        );
    }

    parseError(error) {
        return error.response ? error.response : error;
    }

}
export default BaseApiService;