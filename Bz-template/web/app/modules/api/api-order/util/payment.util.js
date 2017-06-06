'use strict';

const querystring = require('querystring');
const _ = require('lodash');

class Payment {
    constructor (server) {
        this.server = server;
        this.configManager = server.configManager;
        this.configOnepay = server.configManager.get('web.onepay');
    }
    onlinePayment (type, data, dataExtend){
        /*setup config*/
        var secret = this.configOnepay[type].config.secret || '';
        var vpcUrl = this.configOnepay[type].config.vpcUrl || '';
        data = _.assign(data, this.configOnepay.general);
        data.vpc_AccessCode = this.configOnepay[type].config.vpc_AccessCode;
        data.vpc_Merchant = this.configOnepay[type].config.vpc_Merchant;

        /*get link payment Online*/
        data = this.ksort(data);
        var query = querystring.stringify(data);
        if(dataExtend)
            query += '&'+querystring.stringify(dataExtend)
        delete data.Title;

        var data_hash = this.jsonToQueryStringNotEncode(data);

        vpcUrl += query+'&vpc_SecureHash='+this.hash_mac(secret,data_hash);

        return vpcUrl;
    }
    confirmHash (type, response) {
        /*set config*/
        var secret = this.configOnepay[type].config.secret || '';
        var vpcUrl = this.configOnepay[type].config.vpcUrl || '';

        var vpc_Txn_Secure_Hash = response['vpc_SecureHash'] || '';
        delete response['vpc_SecureHash'];

        // set a flag to indicate if hash has been validated

        this.ksort(response);


        if (secret.length > 0 && response["vpc_TxnResponseCode"] != "7" && response["vpc_TxnResponseCode"] != "No Value Returned") {

            var stringHashData = this.jsonToQueryStringNotEncode(response) || '';

            if (vpc_Txn_Secure_Hash.toUpperCase() == this.hash_mac(secret,stringHashData)) {
                var hashValidated = "CORRECT";
            } else {
                var hashValidated = "INVALID HASH";
            }

        } else {
            var hashValidated = "INVALID HASH";
        }

        var fields = {
            'amount' : this.null2unknown ( response["vpc_Amount"] ),
            'locale' : this.null2unknown ( response["vpc_Locale"] ),
            'command' : this.null2unknown ( response["vpc_Command"] ),
            'version' : this.null2unknown ( response["vpc_Version"] ),
            'orderInfo' : this.null2unknown ( response["vpc_OrderInfo"] ),
            'merchantID' : this.null2unknown ( response["vpc_Merchant"] ),
            'merchTxnRef' : this.null2unknown ( response["vpc_MerchTxnRef"] ),
            'transactionNo' : this.null2unknown ( response["vpc_TransactionNo"] ),
            'txnResponseCode' : this.null2unknown ( response["vpc_TxnResponseCode"] ),
        };


        var transStatus = "";
        let error = true;

        if(hashValidated=="CORRECT" && fields.txnResponseCode=="0"){
            error = false;
            transStatus = "Giao dịch thành công";
        } else if (hashValidated=="INVALID HASH" && fields.txnResponseCode=="0"){
            transStatus = "Giao dịch Pendding";
        }else {
            transStatus = "Giao dịch thất bại";
        }

        return {
            error : error,
            messageStatus : transStatus,
            messageCode : (type=='domestic')
            ? this.getResponseDomesticDescription(fields.txnResponseCode)
            :getResponseInternalDescription(fields.txnResponseCode),
            fields: fields,
        };

    }
    null2unknown(data) {
        if (data == "") {
            return "No Value Returned";
        } else {
            return data;
        }
    }
    hash_mac(secret, data) {
        let crypto = require('crypto');

        return crypto.createHmac('SHA256', new Buffer(secret, "hex"))
        .update(data.trim())
        .digest('hex')
        .toUpperCase();
    }
    ksort(obj){
        var keys = Object.keys(obj).sort()
        , sortedObj = {};

        for(var i in keys) {
            sortedObj[keys[i]] = obj[keys[i]];
        }

        return sortedObj;
    }
    jsonToQueryStringNotEncode(json) {

        let stringHashData = '';

        Object.keys(json).map(function(key) {
            if (json[key].length > 0) {
                if (key != 'vpc_SecureHash' && (json[key].length > 0) && ((key.substr(0,4)=="vpc_") || (key.substr(0,5) =="user_"))) {
                    stringHashData += key + "=" + json[key] + "&";
                }
            }
        });

        return stringHashData.replace(/&+$/, '');
    }
    getResponseDomesticDescription(responseCode) {

        switch (responseCode) {
            case "0" :
            var result = "Giao dịch thành công - Approved";
            break;
            case "1" :
            var result = "Ngân hàng từ chối giao dịch - Bank Declined";
            break;
            case "3" :
            var result = "Mã đơn vị không tồn tại - Merchant not exist";
            break;
            case "4" :
            var result = "Không đúng access code - Invalid access code";
            break;
            case "5" :
            var result = "Số tiền không hợp lệ - Invalid amount";
            break;
            case "6" :
            var result = "Mã tiền tệ không tồn tại - Invalid currency code";
            break;
            case "7" :
            var result = "Lỗi không xác định - Unspecified Failure ";
            break;
            case "8" :
            var result = "Số thẻ không đúng - Invalid card Number";
            break;
            case "9" :
            var result = "Tên chủ thẻ không đúng - Invalid card name";
            break;
            case "10" :
            var result = "Thẻ hết hạn/Thẻ bị khóa - Expired Card";
            break;
            case "11" :
            var result = "Thẻ chưa đăng ký sử dụng dịch vụ - Card Not Registed Service(internet banking)";
            break;
            case "12" :
            var result = "Ngày phát hành/Hết hạn không đúng - Invalid card date";
            break;
            case "13" :
            var result = "Vượt quá hạn mức thanh toán - Exist Amount";
            break;
            case "21" :
            var result = "Số tiền không đủ để thanh toán - Insufficient fund";
            break;
            case "22" :
            var result = " Thông tin tài khoản không đúng - Invalid Account";
            break;
            case "23" :
            var result = " Tài khoản bị khóa - Account Lock";
            break;
            case "24" :
            var result = "Thông tin thẻ không đúng - Invalid Card Info ";
            break;
            case "25" :
            var result = "OTP không đúng - Invalid OTP";
            break;
            case "253" :
            var result = "Quá thời gian thanh toán - Transaction timeout";
            break;
            case "99" :
            var result = "Người sủ dụng hủy giao dịch - User cancel";
            break;
            default :
            var result = "Giao dịch thất bại - Failured";
        }
        return result;
    }
    getResponseInternalDescription(responseCode) {

        switch (responseCode) {
            case "0" :
            result = "Giao dịch thành công";
            break;
            case "?" :
            result = "Transaction status is unknown";
            break;
            case "1" :
            result = "Ngân hàng phát hành thẻ không cấp phép";
            break;
            case "2" :
            result = "Ngân hàng phát hành từ chối cấp phép";
            break;
            case "3" :
            result = "Cổng thanh toán không nhận được kết quả trả về từ ngân hàng phát hành thẻ.";
            break;
            case "4" :
            result = " Thẻ hết hạn sử dụng";
            break;
            case "5" :
            result = " Thẻ không đủ hạn mức hoặc tài khoản không đủ số dư thanh toán.";
            break;
            case "6" :
            result = "Lỗi từ ngân hàng phát hành thẻ.";
            break;
            case "7" :
            result = " Lỗi phát sinh trong quá trình xử lý giao dịch";
            break;
            case "8" :
            result = "Ngân hàng phát hành thẻ không hỗ trợ giao dịch Internet";
            break;
            case "9" :
            result = "Ngân hàng phát hành thẻ từ chối giao dịch.";
            break;
            case "A" :
            result = "Transaction Aborted";
            break;
            case "B" :
            result = "không xác thực được 3DSecure. Liên hệ ngân hàng phát hành để được hỗ trợ";
            break;
            case "C" :
            result = "Transaction Cancelled";
            break;
            case "D" :
            result = "Deferred transaction has been received and is awaiting processing";
            break;
            case "E" :
            result = " Bạn nhập sai CSC hoặc thẻ vượt quá hạn mức lần thanh toán";
            break;
            case "F" :
            result = "Không xác thực được 3D";
            break;
            case "I" :
            result = "Card Security Code verification failed";
            break;
            case "L" :
            result = "Shopping Transaction Locked (Please try the transaction again later)";
            break;
            case "N" :
            result = "Cardholder is not enrolled in Authentication scheme";
            break;
            case "P" :
            result = "Transaction has been received by the Payment Adaptor and is being processed";
            break;
            case "R" :
            result = "Transaction was not processed - Reached limit of retry attempts allowed";
            break;
            case "S" :
            result = "Duplicate SessionID (OrderInfo)";
            break;
            case "T" :
            result = "Address Verification Failed";
            break;
            case "U" :
            result = "Card Security Code Failed";
            break;
            case "V" :
            result = "Address Verification and Card Security Code Failed";
            break;
            case "Z" :
            result = "Bị chặn bởi hệ thống ODF";
            break;
            case "99" :
            result = "Người dùng hủy giao dịch";
            break;
            default  :
            result = "Giao dịch không thành công";
        }
        return result;
    }
}

module.exports = Payment;


