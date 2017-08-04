import $ from 'jquery';

export default class DoneLoading {
    constructor() {
        this.removeLoading();
    }

    removeLoading() {
        setTimeout(function () { $('#loading-wrapper').fadeOut(); }, 100);
    }
}

new DoneLoading()
