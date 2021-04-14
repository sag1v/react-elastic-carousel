import React, { useState, useRef, useEffect } from "react";
import Carousel from "../../src/react-elastic-carousel/components/Carousel";
import styled from "styled-components";

const Item = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  background-color: green;
  width: 100%;
  height: 150px;
  margin: 15px;
`;

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
`;

const ControlsLayout = styled.div`
  display: flex;
  flex-direction: column;
  margin: 25px;
`;

const StyledControlFields = styled.div`
  display: flex;
  margin: 5px;
`;

const breakPoints = [
  { width: 200, itemsToShow: 1 },
  { width: 600, itemsToShow: 2 },
];
const toggle = (updater) => () => updater((o) => !o);

const CheckBox = ({ label, onToggle, ...rest }) => {
  return (
    <StyledControlFields>
      <label htmlFor={label}>{label}</label>
      <input {...rest} id={label} type="checkbox" onChange={toggle(onToggle)} />
    </StyledControlFields>
  );
};

const serverItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const DemoApp = () => {
  const [show, setShow] = useState(true);
  const [enableAutoPlay, setEnableAutoPlay] = useState(false);
  const [items, setItems] = useState([]);
  const [itemsToShow, setItemsToShow] = useState(3);
  const [showArrows, setShowArrows] = useState(true);
  const [pagination, setPagination] = useState(true);
  const [verticalMode, setVerticalMode] = useState(false);
  const carouselRef = useRef();

  const addItem = () => {
    setItems((currentItems) => [...currentItems, currentItems.length + 1]);
  };

  const removeItem = () => {
    setItems((currentItems) => currentItems.slice(0, currentItems.length - 1));
  };

  const updateItemsToShow = ({ target }) =>
    setItemsToShow(Number(target.value));

  const goTo = ({ target }) => carouselRef.current.goTo(Number(target.value));

  useEffect(() => {
    setTimeout(() => {
      setItems(serverItems);
    }, 2500);
  }, []);

  return (
    <Layout>
      <ControlsLayout>
        <StyledControlFields>
          <button onClick={() => setShow((o) => !o)}>
            {`${show ? "Hide" : "Show"} Carousel`}
          </button>
        </StyledControlFields>
        <StyledControlFields>
          <button onClick={addItem}>Add Item</button>
          <button onClick={removeItem}>Remove Item</button>
        </StyledControlFields>
        <StyledControlFields>
          <label>goTo</label>
          <input type="number" onChange={goTo} />
        </StyledControlFields>
        <StyledControlFields>
          <label>itemsToShow</label>
          <input
            type="number"
            value={itemsToShow}
            onChange={updateItemsToShow}
          />
        </StyledControlFields>
        <CheckBox
          label="showArrows"
          checked={showArrows}
          onToggle={setShowArrows}
        />
        <CheckBox
          label="pagination"
          checked={pagination}
          onToggle={setPagination}
        />
        <CheckBox
          label="verticalMode"
          checked={verticalMode}
          onToggle={setVerticalMode}
        />
        <CheckBox
          label="Auto Play"
          checked={enableAutoPlay}
          onToggle={setEnableAutoPlay}
        />
      </ControlsLayout>
      {show && (
        <Carousel
          enableAutoPlay={enableAutoPlay}
          ref={carouselRef}
          verticalMode={verticalMode}
          itemsToShow={itemsToShow}
          showArrows={showArrows}
          pagination={pagination}
        >
          {items.map((item) => (
            <Item key={item}>{item}</Item>
          ))}
        </Carousel>
      )}
    </Layout>
  );
};

export default DemoApp;
