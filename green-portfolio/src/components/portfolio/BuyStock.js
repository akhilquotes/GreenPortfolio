import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { Alert } from "react-bootstrap";
import { Button, Row, Col } from "react-bootstrap";
import { getGlobalQuote } from "../Lib/StocksApi";
import { useRapyd } from "../../context/RapydContext";
import { useFirestore } from "../../context/FirestoreContext";
import Swal from "sweetalert2";

const BuyStock = ({ stock, user, portfolio, setPortfolio, setGreenCoins }) => {
  const [error, setError] = useState("");
  const [lots, setLots] = useState(0);
  const [globalQuote, setGlobalQuote] = useState({});
  const { getWalletBalance, walletTransfer } = useRapyd();
  const [balance, setBalance] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const { addDocument, getDocuments } = useFirestore();
  let multiplier = stock["Currency"] === "INR" ? 1 / 80 : 1;
  const [coins, setCoins] = useState(0);
  useEffect(() => {
    console.log(user);
    getWalletBalance(user.RapydAcc.ewallet_id).then((x) => {
      const reqWallet = x.body.data.filter(
        (x) => x.currency === stock["Currency"]
      );
      if (reqWallet.length === 1) {
        setBalance(reqWallet[0].balance);
      } else {
        setBalance("0");
      }
    });
    getGlobalQuote(stock["AlphaTicker"])
      .then((resp) => resp.json())
      .then((item) => {
        setGlobalQuote(item["Global Quote"]);
        //console.log(item);
      });
  }, []);
  const fetchAmount = (e) => {
    setLots(e.target.value);
    const lots = e.target.value;
    const amount = parseInt(lots) * parseFloat(globalQuote["05. price"]);
    setTotalAmount(parseFloat(amount.toFixed(2)));
    const coin = Math.round(
      0.003 *
        globalQuote["08. previous close"] *
        parseInt(lots) *
        (1 - stock["CDP Value"] / 9) *
        multiplier
    );
    setCoins(coin);
  };
  const executeOrder = () => {
    let date = new Date();

    if (parseFloat(totalAmount) > parseFloat(balance)) {
      Swal.fire({
        icon: "error",
        title: "Insufficient funds in wallet!",
        //text: 'Something went wrong!',
        footer: '<a href="/mywallet">Do u want to add funds?</a>',
      });
    } else {
      Swal.fire({
        title: "processing order..please wait",
      });
      Swal.showLoading();
      let doc = {
        Email: user.Email,
        Symbol: stock["AlphaTicker"],
        CompanyName: stock["Company Name"],
        Price: globalQuote["08. previous close"],
        Quantity: parseInt(lots),
        Currency: stock["Currency"],
        CO2E: stock["CO2E"],
        TransactionDate: `${
          date.getMonth() + 1
        }-${date.getDate()}-${date.getFullYear()}`,
      };
      let greenDoc = {
        Email: user.Email,
        Name: stock["AlphaTicker"] + "_Buy",
        Coins: coins,
        TransactionValue: (
          parseFloat(globalQuote["08. previous close"]) * parseInt(lots)
        ).toFixed(2),
        CDPScore: stock["CDP Score"],
        Co2e: 0,
        Currency: stock["Currency"],
        TransactionDate: `${
          date.getMonth() + 1
        }-${date.getDate()}-${date.getFullYear()}`,
      };
      walletTransfer(
        user.RapydAcc.ewallet_id,
        totalAmount,
        stock["Currency"],
        "buy"
      ).then((x) => {
        if ([200, 201].includes(x.statusCode) === false) {
          Swal.close();
          Swal.fire(x.body.status.error_code, x.body.status.message, "error");
        } else {
          addDocument(doc, "UserPortfolio").then((res) => {
            getDocuments(user.Email, "UserPortfolio", "Email").then((res) => {
              setPortfolio(res);
              addDocument(greenDoc, "GreenCoins").then((resu) => {
                getDocuments(user.Email, "GreenCoins", "Email").then((resp) => {
                  setGreenCoins(resp);
                  Swal.close();
                  Swal.fire("Purchase successful!", "", "success");
                });
              });
            });
          });
        }
      });
    }
  };

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        <Col xs={9}></Col>
        <Col xs={3}>
          <b>Available Funds : </b>
          {balance} {stock["Currency"]}
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <Form.Group className="mb-3" controlId="formBasicLots">
            <Form.Label>Lots</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter no.of stocks to buy"
              name="Lots"
              onChange={fetchAmount}
              value={lots}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3" controlId="formBasicPrice">
            <Form.Label>Stock Price</Form.Label>
            <Form.Control
              type="text"
              disabled
              placeholder="Close Price"
              name=""
              value={globalQuote["05. price"]}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col xs={6}></Col>
        <Col xs={3}>
          <Form.Group className="mb-3" controlId="formBasicCoins">
            <Form.Label>Green Coins</Form.Label>
            <Form.Control
              type="number"
              disabled
              placeholder="Total Coins"
              value={coins}
            />
          </Form.Group>
        </Col>
        <Col xs={3}>
          <Form.Group className="mb-3" controlId="formBasicLots">
            <Form.Label>Total Amount</Form.Label>
            <Form.Control
              type="text"
              disabled
              placeholder="Total amount"
              value={totalAmount}
            />
          </Form.Group>
        </Col>
      </Row>
      <div class="d-flex align-items-end" style={{ height: "6vh" }}>
        <Button className="ms-auto" variant="primary" onClick={executeOrder}>
          Execute order
        </Button>
      </div>
    </>
  );
};

export default BuyStock;
