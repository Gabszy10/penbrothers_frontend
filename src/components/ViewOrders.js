import { useEffect, useState } from "react";
import { ToastContainer, Flip } from "react-toastify";
import dominoLogo from "../assets/domino_logo.png";
import axios from "axios";
import { Link } from "react-router-dom";
import { Table, Label, Input, Col, Row } from "reactstrap";
import Toppings from "./Toppings/Toppings";
import { debounce } from "../helper/helper";

const host = process.env.REACT_APP_URL;

function ViewOrders() {
  const [orders, setorders] = useState([]);
  const [filter, setfilter] = useState({
    elements: "",
    count_of_toppings: "",
  });

  const fetchAllOrders = async () => {
    try {
      const res = await axios.post(`${host}/api/pizza/orders`, filter);
      if (res) {
        setorders(res.data.orders);
      }
    } catch (err) {}
  };

  const handleOnChange = debounce((e) => {
    let textFilter = e.target.value;

    setfilter({ ...filter, [e.target.name]: textFilter });
  }, 250);

  useEffect(() => {
    fetchAllOrders();
  }, [filter]);

  const filterToppings = (toppings) => {
    const whole = [];
    const first_half = [];
    const second_half = [];

    toppings.map((topping, i) => {
      if (topping.toppings_type_id === 1) {
        whole.push(topping.title);
      } else if (topping.toppings_type_id === 2) {
        first_half.push(topping.title);
      } else if (topping.toppings_type_id === 3) {
        second_half.push(topping.title);
      }

      return true;
    });

    return (
      <>
        <Toppings title="Whole" items={whole} />
        <Toppings title="First-Half" items={first_half} />
        <Toppings title="Second-Half" items={second_half} />
      </>
    );
  };

  return (
    <>
      <ToastContainer autoClose={3000} transition={Flip} />

      <img
        className="text-center"
        src={dominoLogo}
        alt="Dominos Pizza"
        style={{ width: "15em", marginBottom: "1em", textAlign: "center" }}
      />

      <h1 style={{ color: "#007eb1", fontWeight: "800", textAlign: "center" }}>
        ORDERS
      </h1>

      <Label for="exampleEmail" style={{ color: "#007eb1", fontWeight: 600 }}>
        <Link to="/" style={{ marginLeft: "0.3em" }}>
          Create Order
        </Link>

        <Row>
          <Col sm="6">
            {" "}
            <Input
              type="text"
              name="elements"
              id="exampleEmail"
              placeholder="Size, Crust, Type"
              onChange={handleOnChange}
            />
          </Col>
          <Col sm="6">
            {" "}
            <Input
              type="text"
              name="count_of_toppings"
              id="exampleEmail"
              placeholder="Number of toppings"
              onChange={handleOnChange}
            />
          </Col>
        </Row>
      </Label>

      <Table>
        <thead>
          <tr>
            <th>Order #</th>
            <th>Pizza #</th>

            <th>Toppings</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, i) => {
            return (
              <tr key={i}>
                <th scope="row">{order.order_number}</th>
                <td>
                  {order.pizza_items.map((pizza, i) => {
                    return (
                      <h6>
                        Pizza {pizza.number} - ({pizza.type}, {pizza.size},{" "}
                        {pizza.crust})
                      </h6>
                    );
                  })}
                </td>

                <td>{filterToppings(order.toppings)}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
}

export default ViewOrders;
