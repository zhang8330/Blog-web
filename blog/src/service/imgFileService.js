import axios from "./config/axiosDefaultConfig";
import defaultConfig from "@/config/configDefault";

class imgFileService{
    async uploadImgFile(uploadData){
        return axios.post(`${defaultConfig.baseApiUrl}/uploadImg`,uploadData);
    }
}
export default new imgFileService();