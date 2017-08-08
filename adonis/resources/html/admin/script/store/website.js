import axios from 'axios';

const state = {
    listWeb: [],
    totalItems: 1,
    hasData: false,
    currentPage: 1,
    totalPage: 1,
    filterData: {
        search: ''
    }
};

const getters = {};

const actions = {
    getListWeb({ commit, state }, { params }) {
        setTimeout(() => {
            state.hasData = false;
            axios.get('api/v1/website', {
                params
            }).then((resp) => {
                commit('createListWeb', {
                    data: resp.data.data.websites,
                    currentPage: resp.data.data.currentPage,
                    totalItems: resp.data.data.totalItems,
                    totalPage: resp.data.data.totalPage
                });
            })
        }, 50);
    },
    addWeb({ commit, state }, { data }) {
        axios.post(`/api/v1/website`, {
            data
        }).then((resp) => { })
    },
    updateWeb({ commit, state }, { data }) {
        axios.post(`/api/v1/website/${data._id}`, {
            data
        }).then((resp) => { })
    },
    removeWeb({ commit, state }, { data }) {
        axios.delete(`/api/v1/website/${data._id}`, {
            data
        }).then((resp) => { })
    },
};

const mutations = {
    createListWeb(state, { data, currentPage, totalItems, totalPage }) {
        state.listWeb = data;
        state.hasData = true;
        state.currentPage = currentPage;
        state.totalItems = totalItems;
        state.totalPage = totalPage;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}