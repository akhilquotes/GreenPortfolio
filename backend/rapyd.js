const express = require("express");
const router = express.Router();

const makeRequest = require("./utilities").makeRequest;

router.post("/createWallet", async (req, res) => {
  try {
    const body = req.body;
    const result = await makeRequest("POST", "/v1/user", body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

router.post("/createSender", async (req, res) => {
  try {
    const body = req.body;
    const result = await makeRequest("POST", "/v1/payouts/sender", body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

router.get("/retrieveSender", async (req, res) => {
  try {
    const sender = req.query.sender;
    const result = await makeRequest("GET", "/v1/payouts/sender/" + sender);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

router.post("/addFundsToWallet", async (req, res) => {
  try {
    const body = req.body;
    const result = await makeRequest("POST", "/v1/account/deposit", body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

router.get("/getWalletBalance", async (req, res) => {
  try {
    const wallet = req.query.ewallet;
    const result = await makeRequest("GET", "/v1/user/" + wallet + "/accounts");
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

router.get("/getListOfDocs", async (req, res) => {
  try {
    const country = req.query.country;
    const result = await makeRequest(
      "GET",
      "/v1/identities/types?country=" + country
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

router.get("/getWalletTransactions", async (req, res) => {
  try {
    const ewallet = req.query.ewallet;
    const currency = req.query.currency;
    const result = await makeRequest(
      "GET",
      "/v1/user/" + ewallet + "/transactions?currency=" + currency
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

router.get("/listPayoutMethods", async (req, res) => {
  try {
    const country = req.query.country;
    const payoutCurrency = req.query.payoutCurrency;
    const senderCurrency = req.query.senderCurrency;
    const category = req.query.category;
    const result = await makeRequest(
      "GET",
      `/v1/payouts/supported_types?sender_currency=${senderCurrency}&payout_currency=${payoutCurrency}&category=${category}&sender_country=${country}&beneficiary_country=${country}&limit=60`
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

router.get("/listPayoutMethodFields", async (req, res) => {
  try {
    const payoutMethod = req.query.payoutMethod;
    const country = req.query.country;
    const senderCurrency = req.query.senderCurrency;
    const beneficiaryCurrency = req.query.beneficiaryCurrency;
    const amount = req.query.amount;
    const result = await makeRequest(
      "GET",
      `/v1/payouts/${payoutMethod}/details?beneficiary_country=${country}&beneficiary_entity_type=individual&payout_amount=${amount}&payout_currency=${beneficiaryCurrency}&sender_country=${country}&sender_currency=${senderCurrency}&sender_entity_type=individual`
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

router.get("/listWallets", async (req, res) => {
  try {
    const ewalletRefId = req.query.walletReferenceId;
    const type = req.query.type;
    const result = await makeRequest(
      "GET",
      `/v1/user/wallets/?type=${type}&ewallet_reference_id=${ewalletRefId}`
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

router.get("/listContacts", async (req, res) => {
  try {
    const ewalletId = req.query.walletId;
    const result = await makeRequest(
      "GET",
      "/v1/ewallets/" + ewalletId + "/contacts"
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

router.get("/listCountries", async (req, res) => {
  try {
    const result = await makeRequest("GET", "/v1/data/countries");
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

router.get("/listCurrencies", async (req, res) => {
  try {
    const result = await makeRequest("GET", "/v1/data/currencies");
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

router.post("/createCheckoutPage", async (req, res) => {
  try {
    const body = req.body;
    const result = await makeRequest("POST", "/v1/checkout", body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

router.post("/walletTransfer", async (req, res) => {
  try {
    const body = req.body;
    const result = await makeRequest("POST", "/v1/account/transfer", body);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

router.post("/createPayout", async (req, res) => {
  try {
    const body = req.body;
    const result = await makeRequest("POST", "/v1/payouts", body);
    //console.log(result);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

router.post("/confirmPayout", async (req, res) => {
  try {
    const payoutId = req.body.payoutId;
    const body = {};
    const result = await makeRequest(
      "POST",
      "/v1/payouts/confirm/" + payoutId,
      body
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

router.post("/verifyIdentity", async (req, res) => {
  try {
    const body = req.body;
    const result = await makeRequest("POST", "/v1/identities", body);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

router.post("/webhooks", async (req, res) => {
  try {
    const lbody = req.body;
    let result = null;
    if (req.body.type === "TRANSFER_FUNDS_BETWEEN_EWALLETS_CREATED") {
      const body = {
        id: req.body.data.id,
        metadata: {
          merchant_defined: "accepted",
        },
        status: "accept",
      };
      result = await makeRequest("POST", "/v1/account/transfer/response", body);
    } else if (req.body.type === "TRANSFER_FUNDS_BETWEEN_EWALLETS_RESPONSE") {
      result = req.body;
    } else if (req.body.type === "PAYOUT_CREATED") {
      let lresult = req.body;
      const payoutId = lresult.body.data.id;
      const payoutAmount = lresult.body.data.amount;
      const body = {};
      const presult = await makeRequest(
        "POST",
        "/v1/payouts/complete/" + payoutId + "/" + payoutAmount,
        body
      );
      result = presult;
    } else if (req.body.type === "PAYOUT_COMPLETED") {
      result = req.body;
    } else if (req.body.type === "IDENTITY_VERIFICATION") {
      result = req.body;
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
});

module.exports = router;
