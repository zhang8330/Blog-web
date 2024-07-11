import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

let projectRouterConfig = [
    {
        path:"/",
        redirect:"/dataView"
    },
    {
        path:"/dataView",
        name:"Data View",
        component:()=>import("./views/DBA")
    },
    {
        path:"/review",
        name:"Data Review",
        component:()=>import("./views/Review")
    },
    {
        path:"/tipOff",
        name:"Tip Off",
        component:()=>import("./views/tipOff")
    },
    {
        path:"/article/:id",
        name:"articleDetail",
        component:()=>import("../../components/articleDetail")
    },
    {
        path:"/permission",
        name:"Permission",
        component:()=>import("./views/Permission")
    },
    {
        path:"/dbmanager",
        name:"DBManager",
        component:()=>import("./views/DBManager")
    }
]
export default new VueRouter({
    routes:projectRouterConfig
})