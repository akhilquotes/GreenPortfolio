import React from "react";
import { Col, Row, Card, Button, Table, Form } from "react-bootstrap";
import DonateCard from "./DonateCard";

const GreenCoin = ({ user, greenCoins, setGreenCoins }) => {
  const donations = [
    {
      title: "Independence Day Sapling Plantation",
      text: "On the eve of independence day Save The Planet NGO is organizing sampling plantation across major cities in India. Your donation contributes for the reduction of CO2 in highly polluted cities. ",
      co2e: 4,
      image: "Plant.avif",
    },
    {
      title: "Cycling to Work Campaign",
      text: "Zero Carbon NGO is organizing cycling to work campaigns across the country to encourage employees go to work on Bicycles. This campaign helps in reducing commutation through automobiles that emit CO2",
      co2e: 2,
      image: "Cycling.jpeg",
    },
    {
      title: "World Economic Forum",
      text: "Your donations to WEF will be spent on funding new technologies that would bring drastic changes in Human lifestyle there by bringing down carbon emissions",
      co2e: 5,
      image: "Wef.jpeg",
    },
    {
      title: "Earth Justice",
      text: "Your donations to Earth Justice will be spent on funding legal councils to fight agaist lobbying, corporations and regulatory changes that would bringing down carbon emissions",
      co2e: 4,
      image: "earthjustice.jpeg",
    },
    {
      title: "Gram Chetna Kendra",
      text: "To address water scarcity in some of the rural areas of Rajasthan, many tanks and pools have been built for rainwater harvesting, thus ensuring the availability of drinking water throughout the year",
      co2e: 1,
      image: "gram.jpeg",
    },
  ];

  return (
    <>
      <Row className="mt-3">
        <Col xs={7}>
          <div>
            <Row className="mb-3">
              {donations.map((item) => (
                <Col xs={4} className="mb-3">
                  <DonateCard
                    item={item}
                    setGreenCoins={setGreenCoins}
                    greenCoins={greenCoins}
                    user={user}
                  ></DonateCard>
                </Col>
              ))}
            </Row>
          </div>
        </Col>
        <Col xs={5}>
          <>
            <>
              <Card className="tblCard border-light">
                <Card.Header
                  className="card-title  bg-transparent text-warning"
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.5em",
                  }}
                >
                  Green Coin Transactions
                </Card.Header>
                <Card.Body>
                  <Table style={{ marginBottom: "0" }} responsive size="sm">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Transaction Value</th>
                        <th>CDP Score</th>
                        <th>Coins</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    {greenCoins.length > 0 ? (
                      <tbody className="table-group-divider">
                        {greenCoins.map((x) => {
                          return (
                            <tr>
                              <td>{x.Name}</td>
                              <td>{x.TransactionValue}</td>
                              <td>{x.CDPScore}</td>
                              <td>{x.Coins}</td>
                              <td>{x.TransactionDate}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    ) : (
                      "No coins available!"
                    )}
                  </Table>
                </Card.Body>
              </Card>
            </>
          </>
        </Col>
      </Row>
    </>
  );
};

export default GreenCoin;
