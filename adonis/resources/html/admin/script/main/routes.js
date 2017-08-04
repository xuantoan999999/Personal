import Dashboard from './../module/dashboard.vue';
import Account from './../module/account.vue';
import User from './../module/user.vue';

export default {
    list: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: Dashboard
        },
        {
            path: '/tai-khoan',
            name: 'account',
            component: Account,
            query: {
                query: {
                    page: 1,
                    limit: 15
                }
            }
        },
        {
            path: '/nguoi-dung',
            name: 'user',
            component: User,
        }
    ]
};