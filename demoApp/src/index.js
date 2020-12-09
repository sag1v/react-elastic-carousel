import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Carousel from "react-elastic-carousel";
import styled from "styled-components";

const Item = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  background-color: green;
  width: 100%;
  height: 150px;
  margin: 0 15px;
`;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const ControlsLayout = styled.div`
  display: flex;
  flex-direction: column;
  margin: 25px;
`;

    const ControlFields = styled.div`
        display: flex;
        margin: 5px;
    `;

const DemoApp = () => {
  const [items, setItems] = useState([1, 2, 3, 4, 5]);
  const [itemsToShow, setItemsToShow] = useState(3);
  const [showArrows, setShowArrows] = useState(true);
  const [pagination, setPagination] = useState(true);

  const addItem = () => {
    setItems((currentItems) => [...currentItems, currentItems.length + 1]);
  };

  const removeItem = () => {
    setItems((currentItems) => currentItems.slice(0, currentItems.length - 1));
  };

  const updateItemsToShow = ({ target }) =>
    setItemsToShow(Number(target.value));

  const toggle = (updater) => () => updater((o) => !o);

  return (
    <Layout>
      <ControlsLayout>
        <ControlFields>
          <button onClick={addItem}>Add Item</button>
          <button onClick={removeItem}>Remove Item</button>
        </ControlFields>
        <ControlFields>
          <label>itemsToShow</label>
          <input
            type="number"
            value={itemsToShow}
            onChange={updateItemsToShow}
          />
        </ControlFields>
        <ControlFields>
          <label>showArrows</label>
          <input
            type="checkbox"
            checked={showArrows}
            onChange={toggle(setShowArrows)}
          />
        </ControlFields>
        <ControlFields>
          <label>pagination</label>
          <input
            type="checkbox"
            checked={pagination}
            onChange={toggle(setPagination)}
          />
        </ControlFields>
      </ControlsLayout>
      <Carousel
        itemsToShow={itemsToShow}
        showArrows={showArrows}
        pagination={pagination}
      >
        {items.map((item) => (
          <Item key={item}>{item}</Item>
        ))}
      </Carousel>
    </Layout>
  );
};

ReactDOM.render(<DemoApp />, document.getElementById("app"));
