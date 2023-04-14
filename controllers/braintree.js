const braintree = require('braintree');

var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY
})

module.exports = {
    generateToken(req, res){
        gateway.clientToken.generate({}, function(err, data){
            if(err){
                console.log(err)
                res.status(500).send(err);
            } else {
                res.send(data);
            }
        })
    },

    processPayment(req, res){
        let nonceFromTheClient = req.body.paymentMethodNonce;
        let amountFromTheClient = req.body.amount;
        // charge
        let newTransaction = gateway.transaction.sale({
            amount: amountFromTheClient,
            paymentMethodNonce: nonceFromTheClient,
            options: {
                submitForSettlement: true
            }
        }, (error, result) => {
            if(error){
                res.status(500).json(error);
            } else {
                res.json(result);
            }
        });        
    }
}