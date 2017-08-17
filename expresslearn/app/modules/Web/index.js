module.exports = {
    get
};

function get(request, reply) {
    return reply.render('web/index.html', {
        title: 'Name'
    })
}