import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import Lottie, { useLottie } from "lottie-react";

// Import your JSON animations
import stemJson from "./../Assets/stem.json";
import leafJson from "./../Assets/leaf.json";
import flowerJson from "./../Assets/flower.json";

import "./../Assets/PlantAnimation.css";

const PlantAnimation = forwardRef((props, ref) => {
  const stemRef = useRef(null);

  const [leaves, setLeaves] = useState([]);
  const [flowers, setFlowers] = useState([]);
  
  const { 
    View: StemView, 
    // play, 
    // pause, 
    // stop, 
    // setSpeed,
    playSegments 
  } = useLottie({
    animationData: stemJson,
    loop: false,
    autoplay: false,          
    lottieRef: stemRef     
  });

  useImperativeHandle(ref, () => ({
    growPlant,
    addLeaf,
    addFlower,
    randomizeLeaves: () => randomize(leaves, setLeaves, "falling"),
    randomizeFlowers: () => randomize(flowers, setFlowers, "falling"),
  }));

  const growPlant = () => {
    playSegments([0, 140], true);

    setTimeout(() => {
      leafTemplates.forEach((_, i) => {
        setTimeout(() => addLeaf(i), i * 300);
      });
    }, 4000);

    setTimeout(() => {
      flowerTemplates.forEach((_, i) => {
        setTimeout(() => addFlower(i), i * 300);
      });
    }, 5000);
  };

  const addLeaf = (idx) => {
    setLeaves((prev) => {
      if (prev.some((leaf) => leaf.key === idx)) return prev; // already exists
      return [...prev, { key: idx, dead: false, falling: false }];
    });
  };

  const addFlower = (idx) => {
    setFlowers((prev) => {
      if (prev.some((flower) => flower.key === idx)) return prev;
      return [...prev, { key: idx, dead: false, falling: false }];
    });
  };

  const randomize = (items, setItems, type) => {
    const candidates = items.filter((i) => !i[type]);
    if (!candidates.length) return;

    const count = Math.min(candidates.length, Math.floor(Math.random() * 2) + 2);
    const selected = candidates.slice(0, count);

    setItems((prev) =>
      prev.map((i) =>
        selected.includes(i) ? { ...i, [type]: true } : i
      )
    );

    if (type === "falling") {
      selected.forEach((item) => {
        setTimeout(() => {
          setItems((prev) => prev.filter((i) => i.key !== item.key));
        }, (Math.random() * 3 + 2) * 1000);
      });
    }
  };

  return (
    <div className="lottie-container">
      <div id="lottie-wrapper" style={{ right: "130px" }}>
        <div className="lottie-layer">{StemView}</div>
        <div className="lottie-layer">
          {leaves.map((leaf) => (
            <div
              key={leaf.key}
              className={`leaf ${leaf.dead ? "dead-leaf" : ""} ${
                leaf.falling ? "falling-leaf" : ""
              }`}
              style={leafTemplates[leaf.key]}
            >
              <Lottie animationData={leafJson} loop={false} autoplay />
            </div>
          ))}
        </div>
        <div className="lottie-layer">
          {flowers.map((flower) => (
            <div
              key={flower.key}
              className={`flower ${flower.dead ? "dead-flower" : ""} ${
                flower.falling ? "falling-flower" : ""
              }`}
              style={flowerTemplates[flower.key]}
            >
              <Lottie animationData={flowerJson} loop={false} autoplay />
            </div>
          ))}
        </div>
      </div>

      {/* <div className="lottie-panel" style={{ display: "flex", flexDirection: "column", width: "15%" }}>
        <button onClick={growPlant}>Grow Plant</button>
        <button onClick={() => addLeaf(leaves.length)}>Add Leaf</button>
        <button onClick={() => addFlower(flowers.length)}>Add Flower</button>
        <button onClick={() => randomize(leaves, setLeaves, "falling")}>Falling Leaf</button>
        <button onClick={() => randomize(flowers, setFlowers, "falling")}>Falling Flower</button>
        <button onClick={() => randomize(leaves, setLeaves, "dead")}>Dead Leaf</button>
        <button onClick={() => randomize(flowers, setFlowers, "dead")}>Dead Flower</button>

        <button onClick={play}>Play</button>
        <button onClick={pause}>Pause</button>
        <button onClick={stop}>Stop</button>
        
        <button onClick={() => setSpeed(2)}>Double Speed</button>
        <button onClick={() => setSpeed(0.5)}>Half Speed</button>
      </div> */}
    </div>
  );
});

const leafTemplates = [
  { 
    width: 100, 
    height: 150, 
    left: 305, 
    top: 340, 
    transform: "rotate(-15deg) scaleX(-1)" 
  },
  { 
    width: 100, 
    height: 150, 
    left: 375, 
    top: 320, 
    transform: "rotate(15deg)" 
  },
  { 
    width: 100, 
    height: 150, 
    left: 300, 
    top: 300, 
    transform: "scaleX(-1)" 
  },
  { 
    width: 100, 
    height: 150, 
    left: 375, 
    top: 275, 
    transform: "" 
  },
  { 
    width: 80, 
    height: 150, 
    left: 320, 
    top: 255, 
    transform: "scaleX(-1)" 
  },
  { 
    width: 80, 
    height: 150, 
    left: 375, 
    top: 240, 
    transform: "rotate(10deg)" 
  },
  { 
    width: 70, 
    height: 70, 
    left: 335, 
    top: 215, 
    transform: "scaleX(-1)" 
  },
  { 
    width: 70, 
    height: 70, 
    left: 385, 
    top: 200, 
    transform: "rotate(30deg)" 
  },
];

const flowerTemplates = [
  {
    width: 300,
    height: 300,
    left: 230,
    top: 255,
    transform: 'rotate(10deg)',
    className: 'flower'
  },
  {
    width: 300,
    height: 300,
    left: 220,
    top: 215,
    transform: 'rotate(22deg) scaleX(-1)',
    className: 'flower'
  },
  {
    width: 300,
    height: 300,
    left: 245,
    top: 165,
    transform: '',
    className: 'flower'
  },
  {
    width: 300,
    height: 300,
    left: 265,
    top: 100,
    transform: 'rotate(-20deg)',
    className: 'flower'
  }
];

export default PlantAnimation;
