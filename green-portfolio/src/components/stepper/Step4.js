import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useRapyd } from "../../context/RapydContext";
import { useFirestore } from "../../context/FirestoreContext";
import Swal from "sweetalert2";

const Step4 = ({ user, setUser, currencyVal, showSkip }) => {
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [currencies, setCurrencies] = useState();
  const { createCheckoutPage, listCurrencies } = useRapyd();
  const { getDocument, updateDocument } = useFirestore();
  const handleNext = async () => {
    try {
      Swal.fire({
        title: "Redirecting to payments page..please wait",
      });
      Swal.showLoading();
      // const res = await createSender(user, currency);
      // if ([200, 201].includes(res.statusCode)) {
      //   const sender = {
      //     Sender: [
      //       {
      //         id: res.body.data.id,
      //         currency: currency,
      //       },
      //     ],
      //   };
      //   const doc = await getDocument(user.Email, "Users", "Email");
      //   await updateDocument(doc.id, "Users", sender);
      //   const docUpdated = await getDocument(user.Email, "Users", "Email");
      //   setUser(docUpdated.data());
      // }
      //const data = await getWalletBalance(user.RapydAcc.ewallet_id);
      //const reqBal = data.body.data.filter((x) => x.currency === currency)[0]
      //  .balance;
      //Swal.close();
      // Swal.fire(
      //   "Funds added successfully!",
      //   `Balance : ${reqBal} ${currency}`,
      //   "success"
      // );
      //currencyVal === "" ? navigate("/myportfolio") : navigate("/mywallet");
      const checkout = await createCheckoutPage(
        amount,
        user.Country,
        currency,
        user.RapydAcc.ewallet_id
      );
      window.location.href = checkout.body.data.redirect_url;
    } catch (e) {
      alert(e);
    }
  };
  const handleSkip = async () => {
    try {
      window.location.href = "/myportfolio";
    } catch (e) {
      alert(e);
    }
  };
  useEffect(() => {
    listCurrencies().then((res) => {
      setCurrencies(res.body.data);
    });
    if (currencyVal !== "") {
      setCurrency(currencyVal);
    }
  }, []);
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div style={{ marginTop: "2vh" }}>
        <div className="p-4 box" style={{ height: "30em" }}>
          {currencyVal === "" && (
            <h2 className="mb-3">Rapyd Account Details</h2>
          )}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEWalletId">
              <Form.Control
                readOnly
                type="text"
                placeholder="EWalletId"
                name="EWalletId"
                value={user.RapydAcc.ewallet_id}
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCurrency">
              <Form.Select
                name="Country"
                onChange={(e) => setCurrency(e.target.value)}
                value={currency}
                disabled={currencyVal !== ""}
              >
                <option>Select Currency</option>
                {currencies &&
                  currencies.map((x) => (
                    <option value={x.code}>{x.name}</option>
                  ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicAmount">
              <Form.Control
                type="text"
                placeholder="Enter amount"
                name="Amount"
                onChange={(e) => setAmount(e.target.value)}
                value={amount}
              />
            </Form.Group>
            <div class="d-flex align-items-end" style={{ height: "30vh" }}>
              {showSkip === "true" && (
                <Button className="ms-auto" variant="link" onClick={handleSkip}>
                  Skip
                </Button>
              )}

              <Button
                className={showSkip !== "true" && "ms-auto"}
                variant="success"
                onClick={handleNext}
              >
                Add Funds
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Step4;
