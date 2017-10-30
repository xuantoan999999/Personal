import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex);

export default new Vuex.Store({
    state:{
        facebook: {
            
        }
    },
    getters:{
        getFacebook(state, getters) {
            return state.facebook;
        }
    },
    // actions,
    mutations:{
        mutateFacebook(state, payload) {
            state.facebook = payload;
        }
    }
  })