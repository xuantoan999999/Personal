angular.module('Checkout')
    .controller("checkoutCtrl", checkoutCtrl);

function checkoutCtrl($scope, Cart, KEY_LOCAL_STORAGE, Option, CheckoutSv, toastr) {
    var vmCheckout = this;
    ////////////////////// VARIABLE //////////////////////
    vmCheckout.ALLOW_SUBMIT_ORDER = false; // enanle/disable button Đặt mua
    const KEY_INFO_CHECKOUT_LOCAL = KEY_LOCAL_STORAGE.key_info_checkout || 'info_checkout'; // key to set or get info local storage
    const KEY_INFO_SHIPPING_LOCAL = KEY_LOCAL_STORAGE.key_shipping_info || 'info_shiping'; // enanle/disable button Đặt mua
    vmCheckout.mapVN = Option.mapVN();
    vmCheckout.Verhicle = null;
    vmCheckout.listAgent = [];
    vmCheckout.Agents = [];
    vmCheckout.STEP = {
        _1: {
            name: 'ENTER-CONTACT',
            status: 'NONE' // SHOW-FORM || DONE
        },
        _2: {
            name: 'ENTER-SHIPING-INFO',
            status: 'NONE'// SHOW-FORM || DONE
        },
        _3: {
            name: 'CHOOSE-PAYMENT-METHOD',
            status: 'NONE'// SHOW-FORM || DONE
        }
    }
    vmCheckout.Coupon = {
        formStatus: 'LOCK', // LOCK | SHOW_INPUT | HASCOUPON,
        code: '',
        object: null,
        error: false,
        message: ''
    }

    vmCheckout.formData = {
        customer_info: {
            customer: null,
            name: '',
            phone: '',
            email: '',
        },
        shipping_info: {
            agent: null,
            name: '',
            email: '',
            phone: '',
            address: '',
            province: '',
            district: '',
        },
        products: [],
        coupon: {
            id: null,
            code: '',
            name: '',
            value: 0
        },
        payment_method: 'COD',
        type: 'XE',
        status: 'NEW',
        total: 0,
        total_pay: 0,
        total_deposit: 0,
        total_extant: 0
    }



    ////////////////////// METHODS //////////////////////
    vmCheckout.initData = initData;
    vmCheckout.filterAgent = filterAgent;
    vmCheckout.showFormAddCoupon = showFormAddCoupon;
    vmCheckout.checkCoupon = checkCoupon;
    vmCheckout.cancelCoupon = cancelCoupon;
    vmCheckout.onEnterCoupon = onEnterCoupon;
    vmCheckout.onChangeAgent = onChangeAgent;

    vmCheckout.doneStep1 = doneStep1;
    vmCheckout.doneStep2 = doneStep2;
    vmCheckout.doneStep3 = doneStep3;

    // open form
    vmCheckout.openFormStep = openFormStep;
    // hide form
    vmCheckout.closeForm = closeForm;
    // user click edit form done
    vmCheckout.editInfoStep = editInfoStep;

    vmCheckout.submitOrder = submitOrder;

    ////////////////////// FUNCTION //////////////////////
    function initData() {
        initInfoLocal();
        initVerhicle();
    }

    function initInfoLocal() {
        CheckoutSv.getAgents().then(function (res) {
            vmCheckout.Agents = res.data;
            var infoCheckout = CheckoutSv.getInfoLocal(KEY_INFO_CHECKOUT_LOCAL);
            if (infoCheckout) {
                angular.extend(vmCheckout.formData.customer_info, infoCheckout);
                doneStep1(true);
                var infoShipping = CheckoutSv.getInfoLocal(KEY_INFO_SHIPPING_LOCAL); {
                    if (infoShipping) {
                        angular.extend(vmCheckout.formData.shipping_info, infoCheckout);
                        doneStep2(true);
                    }
                }
            }
            else {
                openFormStep(1);
            }
        }).catch(function (err) {
            openFormStep(1);
        });
    }

    function initVerhicle() {
        var idVerhicle = Cart.getVerhicleId() || '592e8a05fa0c0b58a972c710';
        CheckoutSv.getVerhicle(idVerhicle).then(function (verhicle) {
            vmCheckout.Verhicle = verhicle;
            // console.log(111, verhicle);

            // 1. Set order detail info
            var itemOrder = {
                product: vmCheckout.Verhicle._id,
                qty: 1,
                price: vmCheckout.Verhicle.price_user,
                total: vmCheckout.Verhicle.price_user
            };
            vmCheckout.formData.products = [itemOrder];

            // 2. Set order info
            var orderInfo = {
                total: vmCheckout.Verhicle.price_user,
                total_pay: vmCheckout.Verhicle.price_user,
                total_deposit: vmCheckout.Verhicle.deposit,
                total_extant: vmCheckout.Verhicle.price_user - vmCheckout.Verhicle.deposit
            }
            angular.extend(vmCheckout.formData, orderInfo);


        }).catch(function (err) {
            console.log(err)
        })
    }


    // on change district || province => filter agent
    function filterAgent(type) {
        vmCheckout.formData.shipping_info.agent = null;
        if (vmCheckout.formData.shipping_info.province != '') {
            CheckoutSv.filterAgent({
                province: vmCheckout.formData.shipping_info.province,
                district: vmCheckout.formData.shipping_info.district != '' ? vmCheckout.formData.shipping_info.district : null
            }).then(function (res) {
                if (res.success) {
                    vmCheckout.listAgent = res.data;
                    if (res.data.length == 0) {
                    }
                }
            }).catch(function (err) {
                vmCheckout.listAgent = [];
                console.log('err', err)
                toastr.error("Không thể tải danh sách đại lý", 'Đại lý');
            });
        }
    }

    // show form add coupon => change status form
    function showFormAddCoupon() {
        if (vmCheckout.Coupon.formStatus === 'LOCK')
            vmCheckout.Coupon.formStatus = 'SHOW_INPUT';
        if (vmCheckout.Coupon.formStatus === 'HASCOUPON') {
            cancelCoupon();
            vmCheckout.Coupon.formStatus = 'SHOW_INPUT';
        }
    }

    // send request checkCoupon
    function checkCoupon() {

    }


    function cancelCoupon() {
        // reset coupon's order data
        angular.extend(vmCheckout.formData.coupon,
            {
                coupon: {
                    id: null,
                    code: '',
                    name: '',
                    value: 0
                }
            });

        // reset form data
        vmCheckout.Coupon = {
            code: '',
            object: null,
            error: false,
            message: ''
        }
    }

    function onEnterCoupon() {
        vmCheckout.Coupon.code = vmCheckout.Coupon.code.toUpperCase();
    }

    function onChangeAgent() {
        var agent = vmCheckout.listAgent.find(e => {
            return e._id == vmCheckout.formData.shipping_info.agent;
        });
        if (agent) {
            angular.extend(vmCheckout.formData.shipping_info, agent);
        }
    }

    // change to process to next step
    function doneStep1(isValid) {
        if (isValid) {
            CheckoutSv.saveInfoCheckout(KEY_INFO_CHECKOUT_LOCAL, vmCheckout.formData.customer_info)
            vmCheckout.STEP._1.status = 'DONE'
            vmCheckout.STEP._2.status = 'SHOW-FORM'
        }
        else {
            toastr.error("Thông tin liên hệ chưa hợp lệ!", 'Lỗi');
        }
    }

    function doneStep2(isValid) {
        if (isValid) {
            CheckoutSv.saveInfoCheckout(KEY_INFO_SHIPPING_LOCAL, vmCheckout.formData.shipping_info)
            vmCheckout.STEP._2.status = 'DONE'
            vmCheckout.STEP._3.status = 'SHOW-FORM'
        }
        else {
            toastr.error("Thông tin giao hàng chưa hợp lệ!", 'Lỗi');
        }
    }

    function doneStep3(isValid) {

    }

    function openFormStep(step) {
        if (step == 1) {
            vmCheckout.STEP._1.status = 'SHOW-FORM'
        }
        if (step == 2) {
            vmCheckout.STEP._2.status = 'SHOW-FORM'
        }
        if (step == 3) {
            vmCheckout.STEP._3.status = 'SHOW-FORM'
        }
    }

    function closeForm(step) {
        if (step == 1) {
            vmCheckout.STEP._1.status = 'NONE'
        }
        if (step == 2) {
            vmCheckout.STEP._2.status = 'NONE'
        }
        if (step == 3) {
            vmCheckout.STEP._3.status = 'NONE'
        }
    }

    function editInfoStep(step) {
        if (step == 1) {
            openFormStep(1);
            closeForm(2); closeForm(3);
        }
        if (step == 2) {
            openFormStep(2);
            closeForm(1); closeForm(3);
        }
        if (step == 3) {
            openFormStep(3);
            closeForm(1); closeForm(2);
        }
    }

    function submitOrder() {

    }
};