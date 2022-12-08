import React, { useEffect, useState, useRef } from "react";
import { Col, Row, Table, Button, Form, Card } from "react-bootstrap";
import { useRapyd } from "../../context/RapydContext";
import moment from "moment";
import Modal from "react-bootstrap/Modal";
import Step4 from "../stepper/Step4";
import Swal from "sweetalert2";
import TransferFunds from "./TransferFunds";
import Step3 from "../stepper/Step3";

const MyWallet = ({ user, setUser }) => {
  const { getWalletTransactions, listWallets } = useRapyd();
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [toggleRefresh, setToggleRefresh] = useState(0);
  const [currency, setCurrency] = useState();
  const [wallet, setWallet] = useState({});
  const [clickCurrency, setClickCurrency] = useState("");

  const handleClose = () => {
    setShowAdd(false);
    toggleRefresh === 0 ? setToggleRefresh(1) : setToggleRefresh(0);
  };

  const handleTransactions = (acnt) => {
    getWalletTransactions(user.RapydAcc.ewallet_id, acnt.currency).then((x) =>
      setTransactions(x.body.data)
    );
  };
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      const urlParams = new URLSearchParams(window.location.search);
      const message = urlParams["message"];
      if (message === "success") {
        Swal.fire("Funds added successfully!", "", "success");
      } else if (message === "failure") {
        Swal.fire("Failed to add funds!", "", "error");
      }
      isInitialMount.current = false;
    }
    console.log(user);
    listWallets(
      user.RapydAcc.ewallet_reference_id,
      user.Email === "johnhenry2@gmail.com" ? "company" : "person"
    ).then((x) => {
      const walletObj = { ...x.body.data[0] };
      const acnts = [...walletObj.accounts];
      setAccounts(acnts);
      setWallet(walletObj);
    });
  }, [user, toggleRefresh]);

  return (
    <>
      <Modal
        show={showAdd}
        onHide={handleClose}
        animation={false}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {modalTitle !== "Add Funds Enabled" ? modalTitle : "Add Funds"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalTitle.includes("Add Funds") ? (
            modalTitle === "Add Funds" ? (
              <Step4 user={user} currencyVal={clickCurrency} showSkip="false" />
            ) : (
              <Step4 user={user} currencyVal="" showSkip="false" />
            )
          ) : modalTitle === "Verify Identity" ? (
            <Step3 user={user} setUser={setUser} doSignUp="false" />
          ) : (
            <TransferFunds user={user} currency={clickCurrency} />
          )}
        </Modal.Body>
      </Modal>
      <Row className="m-3">
        <Col sm={2}>
          <b>E-Wallet Id :</b>{" "}
        </Col>
        <Col lg={4}>{user.RapydAcc.ewallet_id}</Col>
      </Row>
      <Row className="m-3">
        <Col sm={2}>
          <b>Wallet Status :</b>
        </Col>
        <Col lg={4}>
          {wallet &&
            (wallet.verification_status === "verified" ? (
              <>
                <div style={{ color: "green" }}>Verified</div>
              </>
            ) : (
              <>
                <Row>
                  <Col xs="3">
                    <div style={{ color: "red" }}>Not Verified</div>
                  </Col>
                  <Col xs={6}>
                    <Button
                      className="ms-auto"
                      variant="link"
                      onClick={() => {
                        setShowAdd(true);
                        setModalTitle("Verify Identity");
                      }}
                    >
                      Verify Identity
                    </Button>
                  </Col>
                </Row>
              </>
            ))}
        </Col>
      </Row>
      <Row className="mt-3">
        <Col xs={7}>
          <div class="d-flex align-items-end">
            <Button
              className="ms-auto"
              variant="link"
              onClick={() => {
                setShowAdd(true);
                setModalTitle("Add Funds Enabled");
              }}
            >
              Add Funds
            </Button>
          </div>

          <Card className="tblCard">
            <Card.Header style={{ color: "orange" }}>
              <h3>Accounts</h3>
            </Card.Header>
            <Card.Body>
              {accounts.length > 0 ? (
                <Table
                  responsive
                  striped
                  bordered
                  className="table table-hover"
                  size="sm"
                  style={{ marginBottom: "0" }}
                >
                  <thead>
                    <tr>
                      <th>Account</th>
                      <th>Currency</th>
                      <th>Balance</th>

                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.map((x) => {
                      return (
                        <tr>
                          <td>{x.id}</td>
                          <td>{x.currency}</td>
                          <td>{x.balance}</td>

                          <td>
                            <Button
                              className="badge mx-1"
                              variant="primary"
                              onClick={() => {
                                setShowAdd(true);
                                setModalTitle("Add Funds");
                                setClickCurrency(x.currency);
                              }}
                            >
                              Add Funds
                            </Button>
                            <Button
                              className="badge mx-1"
                              variant="info"
                              onClick={() => {
                                setShowAdd(true);
                                setModalTitle("Transfer Funds");
                                setClickCurrency(x.currency);
                              }}
                            >
                              Transfer
                            </Button>
                            <Button
                              className="badge mx-1"
                              variant="success"
                              onClick={() => handleTransactions(x)}
                            >
                              Transactions
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              ) : (
                "No accounts available..Click Add Funds!"
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col xs={5} style={{ "overflow-x": "auto" }}>
          <div className="my-3" style={{ color: "orange" }}>
            <h2>Wallet Transactions</h2>
          </div>
          {transactions.length > 0 ? (
            <Table
              responsive
              className="table table-hover"
              size="sm"
              style={{ maxHeight: "400px", overflow: "auto" }}
            >
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Amount</th>
                  <th>Currency</th>
                  <th>Type</th>
                  <th>Balance</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((x) => {
                  return (
                    <tr>
                      <td>{x.id}</td>
                      <td>{x.amount}</td>
                      <td>{x.currency}</td>
                      <td>{x.type}</td>
                      <td>{x.balance}</td>
                      <td>
                        {moment(x.created_at * 1000).format(
                          "DD-MM-YYYY h:mm:ss"
                        )}
                      </td>
                      <td>{x.status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            "No transaction available!"
          )}
        </Col>
      </Row>
    </>
  );
};

export default MyWallet;
