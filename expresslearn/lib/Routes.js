
const app = require('./../app');
const path = require("path");
const fs = require('fs');

class Route {

    constructor() {
        this.controller = {};
        this.registerController(path.resolve(__dirname, './../app/module'));
    }

    // Http all method
    all(route, controller) {
        let { name, func } = this.convertController(controller);
        app.all(route, this.controller[name][func]);
    }

    // Http get method
    get(route, controller) {
        let { name, func } = this.convertController(controller);
        app.get(route, this.controller[name][func]);
    }

    // Http put method
    put(route, controller) {
        let { name, func } = this.convertController(controller);
        app.put(route, this.controller[name][func]);
    }

    // Http post method
    post(route, controller) {
        let { name, func } = this.convertController(controller);
        app.post(route, this.controller[name][func]);
    }

    // Http delete method
    delete(route, controller) {
        let { name, func } = this.convertController(controller);
        app.delete(route, this.controller[name][func]);
    }

    group(name, routes){
        routes();
    }

    // Register controller to route method
    registerController(url, dirBefore) {
        if (!dirBefore) dirBefore = '';
        fs.readdirSync(url).forEach(item => {
            let link = `${url}/${item}`;

            if (fs.lstatSync(link).isDirectory()) return this.registerController(link, `${dirBefore}${item}/`);
            else {
                let controller = `${dirBefore}${item.split('.')[0]}`;
                this.controller[controller] = require(link);
            }
        });
    }

    convertController(controller) {
        let controllerArr = controller.split('.');
        return {
            name: controllerArr[0],
            func: controllerArr[1]
        }
    }
}

module.exports = new Route();