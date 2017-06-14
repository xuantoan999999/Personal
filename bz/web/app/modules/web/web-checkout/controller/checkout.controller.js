module.exports = {
    checkout
};

function checkout(request, reply) {
    let meta = {
        title: 'Checkout',
        description: 'Checkout'
    };
    return reply.view('web/html/web-checkout/client/template/checkout.html', meta);
}
