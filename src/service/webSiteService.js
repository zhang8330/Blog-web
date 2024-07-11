import axios from './config/axiosDefaultConfig';
import defaultConfig from "@/config/configDefault";

class webSiteService {
    async getWebSiteData(args) {
        return axios.get(`${defaultConfig.baseApiUrl}/websiteData/websiteData`,{
            params: args
        });
    }
}

export default new webSiteService()