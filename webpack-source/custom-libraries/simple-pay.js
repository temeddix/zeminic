window.simplePay = {

    payBack: function
    (artworkId, cardAlias, successCallback, failureCallback){
        
        axios.post('/ajax-tunnel/pay-card-alias',
        {
            artworkId: artworkId,
            cardAlias:cardAlias
        })

        .then(function (response) {
            response = response.data;
            if(response.isSuccessful){
                successCallback(response);
            } else {
                failureCallback(response);
            }
            /*
                성공하면 response.response
                response : {
                        amount : response.data.amount,
                        apply_num : response.data.apply_num,
                        card_name : response.data.card_name,
                        merchant_uid : response.data.merchant_uid,
                        paid_at : response.data.paid_at,
                        receipt_url : response.data.receipt_url
                    }
            */
        })

        .catch(function (error) {
            failureCallback(error);
        });
    },

    payFront: function
    (artworkId, paymentMethod, successCallback, failureCallback){

        axios.post('/ajax-tunnel/get-imp-param',
        {
            artworkId: artworkId,
            paymentMethod: paymentMethod
        })
    
        .then(function (response) {
            data = response.data;
    
            if (data.isSuccessful) {
                var IMP = window.IMP;
                IMP.init(data.impId);
                var msg;
    
                IMP.request_pay({
                    pg: data.impParam.pg,
                    pay_method: data.impParam.pay_method,
                    merchant_uid: data.impParam.merchant_uid,
                    name: data.impParam.name,
                    amount: Number(data.impParam.amount),
                }, function (rsp) {
                    if (rsp.success) {
                        //결제 성공시 실행될 코드
                        let retobj = {
                            merchant_uid : rsp.merchant_uid,
                            amount : rsp.paid_amount
                        };
                        successCallback(response);
                    } else {
                        //결제 실패시 실행될 코드
                        var msg = '결제에 실패하였습니다.';
                        msg += '에러내용 : ' + rsp.error_msg;
                        failureCallback(response);
                    }
                });
            } else {
                failureCallback(response);
            }
        })
    
        .catch(function (error) {
            failureCallback(error);
        });
    }
}