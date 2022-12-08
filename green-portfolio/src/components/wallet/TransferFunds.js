import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useRapyd } from "../../context/RapydContext";
import Swal from "sweetalert2";
import { createPath } from "react-router-dom";

const TransferFunds = ({ user, currency }) => {
  const {
    listPayoutMethods,
    listPayoutMethodFields,
    createPayout,
    confirmPayout,
    listCurrencies,
  } = useRapyd();
  const [beneCurrency, setBeneCurrency] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amount, setAmount] = useState();
  const [payoutMethods, setPayoutMethods] = useState([]);
  const [beneRequiredFields, setBeneRequiredFields] = useState([]);
  const [beneficiary, setBeneficiary] = useState({});
  const [fxRate, setFxRate] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [payoutId, setPayoutId] = useState("");
  const [currencies, setCurrencies] = useState();

  const onBeneCurrencyChange = (e) => {
    setBeneCurrency(e.target.value);
    listPayoutMethods(user.Country, currency, e.target.value).then((x) => {
      setPayoutMethods(x.body.data);
    });
  };
  const onChange = (e) => {
    setBeneficiary({ ...beneficiary, [e.target.name]: e.target.value });
  };
  const onBeneBankChange = (e) => {
    setPaymentMethod(e.target.value);
    const reqBank = payoutMethods.filter(
      (x) => x.payout_method_type === e.target.value
    );
    listPayoutMethodFields(
      e.target.value,
      user.Country,
      currency,
      beneCurrency,
      reqBank[0].amount_range_per_currency[0].maximum_amount
    ).then((x) => {
      setBeneRequiredFields(x.body.data.beneficiary_required_fields);
    });
  };

  const handleTransfer = () => {
    Swal.fire({
      title: "initiating transaction..please wait",
    });
    Swal.showLoading();
    createPayout(
      user,
      beneficiary,
      currency,
      beneCurrency,
      payoutMethods.filter((x) => x.payout_method_type === paymentMethod)[0]
        .name,
      paymentMethod,
      amount
    ).then((x) => {
      // if (x.body.data.status === "Completed") {
      //   Swal.close();
      //   Swal.fire("Transferred successfully!", "", "success");
      // } else {
      //   Swal.close();
      //   Swal.fire("Error!", x.body.data.error, "error");
      // }
      Swal.close();
      setShowConfirm(true);
      setFxRate(
        "1 " + currency + " = " + x.body.data.fx_rate + " " + beneCurrency
      );
      setPayoutId(x.body.data.id);
    });
  };

  const handleConfirm = () => {
    Swal.fire({
      title: "processing transaction..please wait",
    });
    Swal.showLoading();
    confirmPayout(payoutId).then((x) => {
      if (x.body.status.status === "SUCCESS") {
        Swal.close();
        Swal.fire("Transferred successfully!", "", "success");
      } else {
        Swal.close();
        Swal.fire("Error!", x.body.status.error_code, "error");
      }
    });
  };

  useEffect(() => {
    listCurrencies().then((res) => {
      setCurrencies(res.body.data);
    });
  }, []);
  return (
    <>
      <Row>
        <Col xs={4}>
          <Form.Select
            name="beneCurrency"
            onChange={onBeneCurrencyChange}
            value={beneCurrency}
            required
          >
            <option>Select Payout Currency</option>
            {currencies &&
              currencies.map((x) => <option value={x.code}>{x.name}</option>)}
          </Form.Select>
        </Col>
        <Col>
          <Form.Select
            name="paymentMethod"
            onChange={onBeneBankChange}
            value={paymentMethod}
            required
          >
            <option>Select Beneficiary Bank</option>
            {payoutMethods &&
              payoutMethods
                .filter(
                  (x) => x.amount_range_per_currency[0].maximum_amount != null
                )
                .map((x) => (
                  <option value={x.payout_method_type}>{x.name}</option>
                ))}
          </Form.Select>
        </Col>
      </Row>
      <Row>
        {beneRequiredFields && (
          <h4 className="my-3">Enter Beneficiary Details</h4>
        )}
        {beneRequiredFields &&
          beneRequiredFields.map((x) => {
            if (x.name === "identification_type") {
              let fields = x.regex.substring(1, x.regex.length - 2).split("|");
              return (
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      {x.name} <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Select
                      name={x.name}
                      required
                      className="mb-3"
                      onChange={onChange}
                    >
                      <option>Select Identification Type</option>
                      {fields.map((y) => (
                        <option value={y}>{y}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              );
            } else {
              return (
                <Col xs={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      {x.name} <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={x.description}
                      name={x.name}
                      onChange={onChange}
                      value={beneficiary[x.name]}
                    />
                  </Form.Group>
                </Col>
              );
            }
          })}
      </Row>
      <Row>
        <Col xs={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              Enter amount in {currency}
              <span style={{ color: "red" }}>*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Amount"
              name="amount"
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
            />
          </Form.Group>
        </Col>
        <Col xs={6}>
          <Form.Group className="mb-3">
            <Form.Label>FX Rate</Form.Label>
            <Form.Control
              type="text"
              placeholder=""
              name="fx"
              value={fxRate}
              disabled
              style={
                showConfirm === false ? { display: "none" } : { display: "" }
              }
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex align-items-end">
          {/* <div class="d-flex align-items-end" style={{ height: "12vh" }}> */}
          <Button
            className="ms-auto"
            variant="primary"
            onClick={handleTransfer}
            style={showConfirm === true ? { display: "none" } : { display: "" }}
          >
            Transfer
          </Button>
          <Button
            className="ms-auto"
            variant="warning"
            onClick={handleConfirm}
            style={
              showConfirm === false ? { display: "none" } : { display: "" }
            }
          >
            Confirm
          </Button>
          {/* </div> */}
        </Col>
      </Row>
    </>
  );
};

export default TransferFunds;
