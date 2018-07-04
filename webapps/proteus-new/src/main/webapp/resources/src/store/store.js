import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex);

const store = new Vuex.Store({
    state:{
        progress:false,
        currentRepo:'',
        origin:''
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
        },
        setOrigin(state,neworigin){
            state.origin = neworigin;
        }
    },
    getters:{
        getprog(state){
            return state.progress;
        },
        getcurrentrepo(state){
            return state.currentRepo;
        },
        getCurrentOrigin(state){
            return state.origin;
        }
    }
});
export default store;