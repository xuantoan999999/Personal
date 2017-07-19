'use strict'

const mongoose = use('mongoose');
const _ = require('lodash');

const User = mongoose.model('User');

class UserController {

    * index(request, response) {
        // let new_user = new User({ email: 'skecgash@gmail.com', name: 'skecgash' });
        // yield new_user.save();
        let users = yield User.find().lean();
        users.forEach(function (item) {
            item.edit = false;
            item.delete = false;
            item.show = false;
        });
        yield response.json({ users })
    }

    * create(request, response) {
        //
    }

    * store(request, response) {
        //
    }

    * show(request, response) {
        //
    }

    * edit(request, response) {
        //
    }

    * update(request, response) {
        let params = request.params();
        let data = request.all();
        let user = yield User.findById(params.id);
        let userUpdate = _.extend(user, data.data);
        yield userUpdate.save();
        yield response.json({ success: true })
    }

    * destroy(request, response) {
        let params = request.params();
        let removeUser = yield User.findByIdAndRemove(params.id);
        yield response.json({ success: true })
    }

    * changePassword(request, response) {
        yield response.json({ success: true })
    }
}

module.exports = UserController
