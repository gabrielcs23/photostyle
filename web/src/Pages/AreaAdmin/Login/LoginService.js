import BaseApiService from '../Services/BaseApiService/BaseApiService';

class LoginService extends BaseApiService {

    login(username, password) {
        return this.axiosInstance.post(`/authenticate`, {
            username,
            password
        });
    }

}
export default new LoginService();