import React from "react";

function Toppings(props) {
  const { title, items } = props;

  return (
    <>
      {items.length ? (
        <div>
          <h6>Topping {title}</h6>
          {items.map((item, i) => {
            return <p>-{item}</p>;
          })}
        </div>
      ) : null}
    </>
  );
}

export default Toppings;
