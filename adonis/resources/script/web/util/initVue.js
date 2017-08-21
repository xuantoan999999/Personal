import Vue from 'vue'

export default class initVue {
    static createVue(elementId, contentObj = {}) {
        if (document.getElementById(elementId)) {
            contentObj.el = `#${elementId}`;
            contentObj.delimiters = ['[[', ']]']
            return new Vue(contentObj);
        }
        return null;
    }
}