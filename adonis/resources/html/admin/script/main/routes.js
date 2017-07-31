import Dashboard from './../module/dashboard.vue';
import Account from './../module/account.vue';
import User from './../module/user.vue';

export default {
    list: [
        {
            path: '/',
            name: 'dashboard',
            component: Dashboard
        },
        {
            path: '/tai-khoan',
            name: 'account',
            component: Account,
        },
        {
            path: '/nguoi-dung',
            name: 'user',
            component: User,
        }
    ]
};