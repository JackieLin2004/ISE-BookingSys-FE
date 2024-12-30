import { createRouter, createWebHashHistory } from "vue-router";
import LoginPage from "../pages/LoginPage.vue";
import HomePage from "@/pages/HomePage.vue";

const router = createRouter({
    history:createWebHashHistory(),
    routes:[
        {
            path:'/login',
            name:'login',
            component:LoginPage
        },
        {
            path:'/',
            redirect:'/login'
        },
        {
            path:'/home',
            name:'home',
            component: HomePage
        }
    ]
})

export default router
