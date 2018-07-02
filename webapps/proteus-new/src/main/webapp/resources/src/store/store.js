import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex);

const store = new Vuex.Store({
    state:{
        progress:false,
        currentRepo:''
    },
    mutations:{
        invert(state){
            state.progress = !state.progress;
        },
        setprogress(state,val){
            state.progress = val;
        },
        setCurrentRepo(state,newVal){
            state.currentRepo = newVal;
        }
    },
    getters:{
        getprog(state){
            return state.progress;
        },
        getcurrentrepo(state){
            return state.currentRepo;
        }
    }
});
export default store;