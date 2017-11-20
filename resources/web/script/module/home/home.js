import initVue from './../../util/initVue.js';
import facebookComponent from './facebookComponent.vue';
import storeHome from './store';

let app = initVue.createVue('mod-home', {
  data: {
    message: 'VueJS: Include success',
    footRollInput: {
      footRoll: 0,
      bendLimitAngle: 45,
      toeStraightAngle: 70,
    },
    footRollOutput: {
      heelX: 0,
      ballX: 0,
      toeX: 0
    }
  },
  computed: {
    facebookContent: function () {
      return storeHome.getters.getFacebook;
    },
  },
  components: {
    facebookComponent
  },
  mounted() {
    this.footRollFunction();
  },
  methods: {
    footRollFunction: function () {
      this.footRollInput.footRoll = parseFloat(this.footRollInput.footRoll);
      if (this.footRollInput.footRoll <= 0) {
        this.footRollOutput.heelX = this.footRollInput.footRoll;
      }
      if (0 < this.footRollInput.footRoll && this.footRollInput.footRoll < this.footRollInput.bendLimitAngle) {
        this.footRollOutput.ballX = this.footRollInput.footRoll;
      }
      if (this.footRollInput.bendLimitAngle <= this.footRollInput.footRoll && this.footRollInput.footRoll <= this.footRollInput.toeStraightAngle) {
        let substractBetwwen = this.footRollInput.toeStraightAngle - this.footRollInput.bendLimitAngle;
        let divideToe = this.footRollInput.toeStraightAngle / substractBetwwen;
        this.footRollOutput.toeX = (this.footRollInput.footRoll - this.footRollInput.bendLimitAngle) * divideToe;
        let divideBall = this.footRollInput.bendLimitAngle / substractBetwwen;
        this.footRollOutput.ballX = (this.footRollInput.toeStraightAngle - this.footRollInput.footRoll) * divideBall;
      }
    }
  }
})