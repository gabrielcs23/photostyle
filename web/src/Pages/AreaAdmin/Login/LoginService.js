import BaseApiService from '../Services/BaseApiService/BaseApiService';

class LoginService extends BaseApiService {

    async login(username, password) {
        try {
            await this.axiosInstance.post(`/authenticate`, {
                username,
                password
            });
        } catch (error) {
            throw this.parseError(error);
        }
    }

}
export default new LoginService();