import $ from 'jquery';

export default class DoneLoading {
    constructor() {
        setTimeout(function () { $('#loading-wrapper').fadeOut(); }, 50);
    }
}

new DoneLoading()
