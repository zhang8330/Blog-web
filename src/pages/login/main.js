import Vue from "vue";
import App from "./App";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css"
import router from "@/pages/login/router";
Vue.use(ElementUI);
Vue.config.productionTip = true;

new Vue({
    render: h=>h(App),
    router
}).$mount("#app");
