import axios from "./config/axiosDefaultConfig";
import defaultConfig from "@/config/configDefault";

class userDetailsService {
    async setLikes(args) {
        return axios.post(`${defaultConfig.baseApiUrl}/userDetails/likes`, args)
    }

    async unLikes(args) {
        return axios.delete(`${defaultConfig.baseApiUrl}/userDetails/likes/${args.blogId}`)
    }
    async setStars(args) {
        return axios.post(`${defaultConfig.baseApiUrl}/userDetails/star`, args)
    }

    async unStars(args) {
        return axios.delete(`${defaultConfig.baseApiUrl}/userDetails/star/${args.userName}`)
    }
    async setBlackList(args) {
        return axios.post(`${defaultConfig.baseApiUrl}/userDetails/blackList`, args)
    }

    async unBlackList(args) {
        return axios.delete(`${defaultConfig.baseApiUrl}/userDetails/blackList/${args.userName}`)
    }
    async getCommentsList(args) {
        return axios.get(`${defaultConfig.baseApiUrl}/userDetails/comments`,{
            params:args
        })
    }async getStarsList(args) {
        return axios.get(`${defaultConfig.baseApiUrl}/userDetails/star`,{
            params:args
        })
    }async getBlackList(args) {
        return axios.get(`${defaultConfig.baseApiUrl}/userDetails/blacklist`,{
            params:args
        })
    }
}

export default new userDetailsService();