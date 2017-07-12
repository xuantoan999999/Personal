import $ from 'jquery';

export default class DoneLoading {
    constructor() {
        this.removeLoading();
    }

    removeLoading() {
        setTimeout(function () { $('#loading-wrapper').fadeOut(); }, 50);
    }
}

new DoneLoading()
