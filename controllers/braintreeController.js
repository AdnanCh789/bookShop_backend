const braintree = require("braintree");
const { User } = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const config = require("config");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: config.get("braintree.BRAINTREE_MERCHANT_ID"),
  publicKey: config.get("braintree.BRAINTREE_PUBLIC_KEY"),
  privateKey: config.get("braintree.BRAINTREE_PRIVATE_KEY"),
});

exports.generateBraintreeToken = (req, res) => {
  gateway.clientToken.generate({}, function (err, response) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(response);
    }
  });
};

exports.processPayment = (req, res) => {
  gateway.transaction.sale(
    {
      amount: req.body.amount,
      paymentMethodNonce: req.body.nonce,
      options: {
        submitForSettlement: true,
      },
    },
    function (err, result) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(result);
      }
    }
  );
};
