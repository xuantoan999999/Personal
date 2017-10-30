import initVue from './../util/initVue.js'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

let app = initVue.createVue('mod-exercice-1', {
    data: {
        text: 'VueJS: Include success',
        notNextTick: true,
        swiperOption: {
            initialSlide: 1,
            autoplay: 3000,
            grabCursor: true,
            setWrapperSize: true,
            autoHeight: true,
            paginationClickable: true,
            prevButton: '.swiper-button-prev',
            nextButton: '.swiper-button-next',
            observeParents: true,
            loop: true,
        }

    },
    components: { swiper, swiperSlide },
    computed: {
        swiper() {
            return this.$refs.mySwiper.swiper
        }
    },
    mounted() {

    },
    methods: {
    }
})