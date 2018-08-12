/*
Licensed to the Apache Software Foundation (ASF) under one or more contributor
license agreements.  See the NOTICE.txt file distributed with this work for
additional information regarding copyright ownership.  The ASF licenses this
file to you under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License.  You may obtain a copy of
the License at
     http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
License for the specific language governing permissions and limitations under
the License.
*/

import Vuex from 'vuex';
import Vue from 'vue';
Vue.use(Vuex);

const store = new Vuex.Store({
    state:{
        progress:false,
        view:"summary",
        currentRepo:'',
        origin:'',
        currentActionRequest:'',
        currentActionStep:'IDLE'
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
        },
        setView(state,newVal){
            state.view = newVal;
        },
        setCurrentActionRequest(state,newVal){
            state.currentActionRequest = newVal;
        },
        setCurrentActionStep(state,newVal){
            state.currentActionStep = newVal;
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