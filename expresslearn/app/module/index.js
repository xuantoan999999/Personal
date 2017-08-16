module.exports = {
    get,
    get2
};

function get(request, reply) {
    reply.send('Hello World!')
}

function get2(request, reply) {
    reply.send('Hello Testttttttttt!')
}