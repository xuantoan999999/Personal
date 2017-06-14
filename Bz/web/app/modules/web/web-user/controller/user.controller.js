module.exports = {
    login,
    register,
    account,
    forgot,
    reset,
    changepassword,
};

function login(request, reply) {
    let meta = {
        title: 'Login',
        description: ''
    }
    reply.view('web/html/web-user/login', meta);
}

function register(request, reply) {
    let meta = {
        title: 'Register',
        description: ''
    }
    reply.view('web/html/web-user/register', meta);
}

function account(request, reply) {
    let meta = {
        title: 'My account',
        description: ''
    }
    reply.view('web/html/web-user/account', meta);
}

function account(request, reply) {
    let meta = {
        title: 'My account',
        description: ''
    }
    reply.view('web/html/web-user/account', meta);
}

function forgot(request, reply) {
    let meta = {
        title: 'Forgot Password',
        description: ''
    }
    reply.view('web/html/web-user/forgot', meta);
}

function reset(request, reply) {
    let token = request.query.token;
    let meta = {
        title: 'Reset password',
        description: ''
    }
    reply.view('web/html/web-user/forgot', { token: token, meta: meta });
}

function changepassword(request, reply) {
    let meta = {
        title: 'Change password',
        description: ''
    }
    reply.view('web/html/web-user/changepassword', meta);
}
