import Dashboard from './../module/dashboard.vue';
import Account from './../module/account.vue';
import User from './../module/user.vue';
import Website from './../module/website.vue';

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
        },
        {
            path: '/nguoi-dung',
            name: 'user',
            component: User,
        },
        {
            path: '/website',
            name: 'website',
            component: Website,
        }
    ]
};