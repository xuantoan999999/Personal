'use strict'

class AdminDashboardController {
    async index({ request, view }) {
        // let data = await Account.find().lean();
        return view.render('admin.dashboard', {
            // data,
            text: 'This is hello world'
        });
    }
}

module.exports = AdminDashboardController
