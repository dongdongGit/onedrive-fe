import Vue from 'vue'
import Vuex from 'vuex'
import { session } from '@/api/api'

Vue.use(Vuex)

const state = {
    token: null,
    expires_in: 5184000,
    user: {},
}

const mutations = {
    saveAuthUser(state, user) {
        state.user = userInfo;
    },
    saveAuthToken(state, token) {
        state.token = token
    },
    saveAuthExpiresIn(state, expires_in) {
        state.expires_in = expires_in
    }
}

const actions = {
    async getAuthUser({ commit }) {
        try {
            const res = await session()

            if (res.status == 1) {
                commit('saveAuthUser', res.data);
            } else {
                throw new Error(res.type)
            }
        } catch (err) {
            // console.log(err.message)
        }
    },
    // async getExpiresIn({ commit }) {
    //     try {
    //         const res = await session()

    //         if (res.status == 1) {
    //             commit('saveAuthUser', res.data);
    //         } else {
    //             throw new Error(res.type)
    //         }
    //     } catch (err) {
    //         // console.log(err.message)
    //     }
    // },
    // async getToken({ commit }) {
    //     try {
    //         const res = await session()

    //         if (res.status == 1) {
    //             commit('saveAuthUser', res.data);
    //         } else {
    //             throw new Error(res.type)
    //         }
    //     } catch (err) {
    //         // console.log(err.message)
    //     }
    // }
}

export default new Vuex.Store({
    state,
    actions,
    mutations,
})