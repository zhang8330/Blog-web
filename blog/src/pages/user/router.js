import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

let projectRouterConfig = [
    {
        path:"/",
        redirect:"/home/articles"
    },{
        path:"/home/:module",
        name:"home",
        component:()=>import("./views/Home")
    },{
        path:"/chatHome",
        name:"chatHome",
        component:()=>import("./views/chatHome")
    },{
        path:"/editArticle",
        name:"articleEdit",
        component:()=>import("./views/articleEdit")
    },{
        path:"/article/:id",
        name:"articleDetail",
        component:()=>import("../../components/articleDetail")
    },{
        path:"/blogList/:searchKey",
        name:"blogList",
        component:()=>import("./views/blogList")
    }
]
export default new VueRouter({
    routes:projectRouterConfig
})