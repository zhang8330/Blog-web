import axios from "./config/axiosDefaultConfig";
import defaultConfig from "@/config/configDefault";

class tipOffService{
    async tipOffBlog(data){
        return axios.post(`${defaultConfig.baseApiUrl}/tipOff/article`,data);
    }

    async getTipOffData(args){
        return axios.get(`${defaultConfig.baseApiUrl}/tipOff/article`,{
            params:args
        });
    }

    async ignoreTipOffDataById(args){
        return axios.delete(`${defaultConfig.baseApiUrl}/tipOff/tipOffData/${args.tipOffId}`,{
            params:args
        });
    }

    async deleteTipOffDataById(args){
        return axios.delete(`${defaultConfig.baseApiUrl}/tipOff/article/${args.tipOffId}`,{
            params:args
        });
    }
}
export default new tipOffService();