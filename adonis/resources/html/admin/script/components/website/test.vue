<template>
    <div>
        <div class="row">
            <div class="col-xs-2 text-center">
                <button class="btn btn-primary waves-effect" type="button" @click="decrement">
                    <i class="material-icons">exposure_neg_1</i>
                    <span>Trừ</span>
                </button>
            </div>
            <div class="col-xs-2 text-center">
            </div>
            <div class="col-xs-2 text-center">
                <button class="btn btn-primary waves-effect" type="button" @click="increment">
                    <i class="material-icons">exposure_plus_1</i>
                    <span>Cộng</span>
                </button>
            </div>
            <div class="col-xs-3">
                {{countPlusLocalState}}
                <button class="btn btn-primary waves-effect" type="button" @click="test()">
                    afsf asfa f
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapState,mapMutations } from 'vuex'

// @click="decrement"
// @click="increment"
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };

export default {
    data() {
        return {
            localCount: 100,
        }
    },
    props:[],
    computed: mapState({
        countPlusLocalState (state) {
            return state.count + this.localCount
        },
        doneTodosCount (state, getters) {
            return getters.lengthTodos;
        }
    }),
    mounted() {
    },
    methods: {
        ...mapMutations([
            'increment',
            'decrement'
        ]),
        test(){
            console.log("sjd sbdgjbsjdg");
        }
    },
}
</script>