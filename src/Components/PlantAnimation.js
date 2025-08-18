import React, { useState } from "react";
import Lottie, { useLottie } from "lottie-react";

// Import your JSON animations
import stemJson from "./../Assets/stem.json";
import leafJson from "./../Assets/leaf.json";
import flowerJson from "./../Assets/flower.json";

const PlantAnimation = () => {
  const [leaves, setLeaves] = useState([]);
  const [flowers, setFlowers] = useState([]);

  // Stem animation (get animation control from useLottie)
  const { View: StemView, animation: stemAnimation } = useLottie({
    animationData: stemJson,
    loop: false,
    autoplay: false,
  });

  const growPlant = () => {
    if (!stemAnimation) return;

    // Play stem animation first
    stemAnimation.playSegments([0, 140], true);

    // Sequential growth
    leafTemplates.forEach((_, idx) =>
      setTimeout(() => addLeaf(idx), 300 * (idx + 1))
    );
    flowerTemplates.forEach((_, idx) =>
      setTimeout(() => addFlower(idx), 300 * (idx + 1) + 5000)
    );
  };

  const addLeaf = (idx) => {
    if (leaves.length > idx) return;
    setLeaves((prev) => [...prev, { key: idx, dead: false, falling: false }]);
  };

  const addFlower = (idx) => {
    if (flowers.length > idx) return;
    setFlowers((prev) => [...prev, { key: idx, dead: false, falling: false }]);
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
    <div
      className="lottie-container"
      style={{ display: "flex", justifyContent: "space-between" }}
    >
      {/* Plant wrapper */}
      <div id="lottie-wrapper" style={{ position: "relative" }}>
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

      {/* Control panel */}
      <div
        className="lottie-panel"
        style={{ display: "flex", flexDirection: "column", width: "15%" }}
      >
        <button onClick={growPlant}>Grow Plant</button>
        <button onClick={() => addLeaf(leaves.length)}>Add Leaf</button>
        <button onClick={() => addFlower(flowers.length)}>Add Flower</button>
        <button onClick={() => randomize(leaves, setLeaves, "falling")}>
          Falling Leaf
        </button>
        <button onClick={() => randomize(flowers, setFlowers, "falling")}>
          Falling Flower
        </button>
        <button onClick={() => randomize(leaves, setLeaves, "dead")}>
          Dead Leaf
        </button>
        <button onClick={() => randomize(flowers, setFlowers, "dead")}>
          Dead Flower
        </button>
      </div>
    </div>
  );
};

// Leaf & flower positioning
const leafTemplates = [
  { width: 100, height: 150, left: 300, top: 340, transform: "rotate(-15deg) scaleX(-1)" },
  { width: 100, height: 150, left: 385, top: 320, transform: "rotate(15deg)" },
  { width: 100, height: 150, left: 305, top: 300, transform: "scaleX(-1)" },
  { width: 100, height: 150, left: 375, top: 275, transform: "" },
  { width: 80, height: 150, left: 315, top: 255, transform: "scaleX(-1)" },
  { width: 80, height: 150, left: 380, top: 225, transform: "rotate(10deg)" },
  { width: 70, height: 70, left: 330, top: 250, transform: "scaleX(-1)" },
  { width: 70, height: 70, left: 385, top: 230, transform: "rotate(30deg)" },
  { width: 60, height: 60, left: 340, top: 215, transform: "scaleX(-1)" },
  { width: 60, height: 60, left: 385, top: 200, transform: "rotate(30deg)" },
  { width: 50, height: 50, left: 350, top: 175, transform: "scaleX(-1)" },
  { width: 50, height: 50, left: 390, top: 170, transform: "rotate(30deg)" },
];

const flowerTemplates = [
  { width: 300, height: 300, left: 245, top: 190, transform: "rotate(10deg)" },
  { width: 300, height: 300, left: 240, top: 150, transform: "rotate(22deg) scaleX(-1)" },
  { width: 300, height: 300, left: 245, top: 100, transform: "" },
  { width: 300, height: 300, left: 240, top: 35, transform: "rotate(-20deg)" },
];

export default PlantAnimation;
