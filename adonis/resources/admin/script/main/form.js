import $ from 'jquery';

export default class Select {
    constructor() {
        this.activate();
    }

    activate() {
        if ($.fn.selectpicker) { $('select:not(.ms)').selectpicker(); }
    }
}

new Select()
