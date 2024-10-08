import Vue from "vue";
import App from "./App";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css"
import router from "@/pages/user/router";
import "highlight.js/styles/atelier-forest-light.css";
Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
    render: h=>h(App),
    router
}).$mount("#app");