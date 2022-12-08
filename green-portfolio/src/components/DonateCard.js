import { Button } from "react-bootstrap";
import React, { useState, useRef } from "react";
import { Card, Form, Overlay, Tooltip } from "react-bootstrap";
import { useFirestore } from "../context/FirestoreContext";
import Swal from "sweetalert2";

const DonateCard = ({ user, item, setGreenCoins, greenCoins }) => {
  const [coins, setCoins] = useState();
  const { addDocument, getDocuments } = useFirestore();
  const [show, setShow] = useState(false);
  const target = useRef(null);
  const [showTitle, setShowTitle] = useState(false);
  const targetTitle = useRef(null);
  const getTotalCoins = () => {
    let count = 0;
    greenCoins.forEach((x) => {
      count += x.Coins;
    });
    return count;
  };
  const handleDonate = () => {
    if (getTotalCoins() < parseInt(coins)) {
      Swal.fire({
        icon: "error",
        title: "Insufficient green coins!",
      });
    } else {
      let date = new Date();
      let greenDoc = {
        Email: user.Email,
        Name: item.title + "_Donate",
        Coins: -1 * parseInt(coins),
        TransactionValue: "NA",
        Co2e: item.co2e,
        CDPScore: "NA",
        Currency: "NA",
        TransactionDate: `${
          date.getMonth() + 1
        }-${date.getDate()}-${date.getFullYear()}`,
      };
      addDocument(greenDoc, "GreenCoins").then((resu) => {
        getDocuments(user.Email, "GreenCoins", "Email").then((resp) => {
          setGreenCoins(resp);
          Swal.close();
          Swal.fire("Donation completed!", "", "success");
          setCoins("");
        });
      });
    }
  };
  return (
    <>
      <Card>
        <Card.Img variant="top" src={item.image} style={{ height: "20vh" }} />
        <Card.Body>
          <Card.Title
            ref={targetTitle}
            onMouseOver={() => setShowTitle(true)}
            onMouseLeave={() => setShowTitle(false)}
          >
            {item.title.length > 20
              ? item.title.substring(0, 20) + ".."
              : item.title}
          </Card.Title>
          <Overlay
            target={targetTitle.current}
            show={showTitle}
            placement="right"
          >
            {(props) => (
              <Tooltip id="overlay-example" {...props}>
                {item.title}
              </Tooltip>
            )}
          </Overlay>
          <Card.Text
            ref={target}
            onMouseOver={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
          >
            {item.text.length > 100
              ? item.text.substring(0, 100) + "...."
              : item.text}
          </Card.Text>
          <Overlay target={target.current} show={show} placement="right">
            {(props) => (
              <Tooltip id="overlay-example" {...props}>
                {item.text}
              </Tooltip>
            )}
          </Overlay>
          <Form.Control
            type="number"
            placeholder="Enter GC"
            style={{
              width: "60%",
              display: "inline-block",
              marginRight: "10px",
            }}
            value={coins}
            onChange={(e) => setCoins(e.target.value)}
          />
          <Button variant="success" onClick={handleDonate}>
            Donate
          </Button>
        </Card.Body>
      </Card>
    </>
  );
};

export default DonateCard;
