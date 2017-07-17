'use strict'

const mongoose = use('mongoose');
const User = mongoose.model('User');

class UserController {

    * index(request, response) {
        // let new_user = new User({ email: 'skecgash@gmail.com', name: 'skecgash' });
        // yield new_user.save();
        let users = yield User.find().lean();
        users.forEach(function (item) {
            item.edit = false;
            item.delete = false;
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
        //
    }

    * destroy(request, response) {
        let params = request.params();
        let removeUser = yield User.findByIdAndRemove(params.id);
        yield response.json({ success: true })
    }

}

module.exports = UserController
