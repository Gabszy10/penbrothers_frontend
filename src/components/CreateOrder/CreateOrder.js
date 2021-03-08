import { useEffect, useState } from "react";
import { ToastContainer, Flip, toast } from "react-toastify";
import dominoLogo from "../../assets/domino_logo.png";
import { debounce, toppingsTitle } from "../../helper/helper";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import xml2js from "xml2js";
import axios from "axios";
import "./CreateOrder.css";
import { Link } from "react-router-dom";

const host = process.env.REACT_APP_URL;

function CreateOrder() {
  const [order_number, setorder_number] = useState("");
  const [pml_json, setpml_json] = useState(null);
  const [output, setoutput] = useState(null);

  useEffect(() => {
    try {
      for (var prop in pml_json) {
        let order_number = pml_json[prop]["$"]["number"];
        setorder_number(order_number);

        let pizza = pml_json[prop]["pizza"];

        const pizzas = pizza.map((item, i) => {
          let obj = {
            pizza_number: item["$"]["number"],
            pizza_elements: {
              size: item["size"][0],
              crust: item["crust"][0],
              type: item["type"][0],
            },
            pizza_toppings: item["toppings"]
              ? item["toppings"].map((topping, i) => {
                  return {
                    topping_level: topping["$"]["area"],
                    topping_items: topping["item"],
                  };
                })
              : [],
          };

          return obj;
        });

        setoutput(pizzas);
        break;
      }
    } catch (error) {
      toast.error("Invalid PML Data");
    }
  }, [pml_json]);

  const handleOnChange = debounce((e) => {
    let pml = e.target.value;

    if (e.target.value === "") {
      toast.error("Input cannot be empty.");
      setoutput("");
    }

    pml = pml.replaceAll("{", "<");
    pml = pml.replaceAll("}", ">");
    pml = pml.replaceAll(/\\/g, "/");

    let parser = new xml2js.Parser();

    parser.parseString(pml, (err, res) => {
      if (err) {
        toast.error("Invalid PML Data");
        setoutput(null);
      } else {
        setpml_json(res);
      }
    });
  }, 250);

  const showFile = async (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const targetValue = {
        target: {
          value: text,
        },
      };

      handleOnChange(targetValue);
    };
    reader.readAsText(e.target.files[0]);

    document.querySelector("#file-upload").value = "";
  };

  const createOrder = async (order) => {
    try {
      const res = await axios.post(`${host}/api/pizza`, order);
      if (res) {
        toast.success(res.data.msg);
      }
    } catch (err) {}
  };

  const handleSubmit = () => {
    const pizza = output.map((item, i) => {
      const toppings = item.pizza_toppings.map((topping, i) => {
        const obj = {
          type: toppingsTitle(topping["topping_level"]),
          toppings_item: topping["topping_items"],
        };

        return obj;
      });

      const obj = {
        number: item["pizza_number"],
        elements: {
          size: item["pizza_elements"]["size"],
          crust: item["pizza_elements"]["crust"],
          type: item["pizza_elements"]["type"],
        },
        toppings,
      };

      return obj;
    });

    const order = {
      order: order_number,
      pizza: pizza,
    };

    createOrder(order);
  };

  return (
    <>
      <ToastContainer autoClose={3000} transition={Flip} />

      <Form>
        <img
          className="text-center"
          src={dominoLogo}
          alt="Dominos Pizza"
          style={{ width: "15em", marginBottom: "1em", textAlign: "center" }}
        />

        <h1
          style={{ color: "#007eb1", fontWeight: "800", textAlign: "center" }}
        >
          PML READER
        </h1>

        <Label for="exampleEmail" style={{ color: "#007eb1", fontWeight: 600 }}>
          Insert PML here |{" "}
          <label
            htmlFor="file-upload"
            className="btn btn-secondary"
            style={{
              background: "#007eb1",
              fontSize: "0.9em",
            }}
          >
            Upload File
          </label>
          <input id="file-upload" type="file" onChange={(e) => showFile(e)} /> |
          <Link to="/orders" style={{ marginLeft: "0.3em" }}>
            View Orders
          </Link>
        </Label>
        <FormGroup>
          <Input
            type="textarea"
            name="text"
            onChange={handleOnChange}
            rows="8"
          />
        </FormGroup>

        <br />
        <Label for="exampleEmail" style={{ color: "#007eb1", fontWeight: 600 }}>
          Result here
        </Label>
        {output && order_number ? (
          <>
            <h4>Order No: {order_number}</h4>
            <hr />
            {output.map((item, i) => {
              return (
                <>
                  <h5>Pizza {item["pizza_number"]}</h5>
                  <h6
                    style={{ color: "#56c612e0", textTransform: "capitalize" }}
                  >
                    ({item["pizza_elements"]["size"]},
                    {item["pizza_elements"]["crust"]},
                    {item["pizza_elements"]["type"]})
                  </h6>
                  {item["pizza_toppings"].map((topping, i) => {
                    return (
                      <>
                        <h5>
                          Toppings {toppingsTitle(topping["topping_level"])}:
                        </h5>
                        {topping["topping_items"] &&
                          topping["topping_items"].map((item, i) => {
                            return (
                              <>
                                <h6
                                  style={{
                                    textTransform: "capitalize",
                                    color: "darkgoldenrod",
                                  }}
                                >
                                  -{item}
                                </h6>
                              </>
                            );
                          })}
                      </>
                    );
                  })}
                  <hr />
                </>
              );
            })}
            <div style={{ textAlign: "center" }}>
              <Button
                color="primary"
                style={{
                  background: "#e36938",
                  border: "none",
                  padding: "0.7em",
                }}
                onClick={handleSubmit}
              >
                SAVE ORDER
              </Button>
            </div>
          </>
        ) : null}
      </Form>
    </>
  );
}

export default CreateOrder;
