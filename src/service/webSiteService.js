import axios from './config/axiosDefaultConfig';
import defaultConfig from "@/config/configDefault";

class webSiteService {
    async setVisitorData(){
        return axios.get("https://api.map.baidu.com/location/ip?ak=1mKeNKCDy4m4tovuFnh4VEKrOrI0oVZw")
    }
    async getWebSiteData(args) {
        return axios.get(`${defaultConfig.baseApiUrl}/websiteData/websiteData`,{
            params: args
        });
    }
}

export default new webSiteService()
