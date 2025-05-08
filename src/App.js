import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import './App.css';
import './Plant.css';

// Nutrient icons
import { FaRegHeart, FaBrain, FaHandshake, FaPeopleCarry } from 'react-icons/fa';

function App() {
  const sunRef = useRef(null);
  const [stemHeight, setStemHeight] = useState(0);
  const [plant, setPlant] = useState([]);
  const [waterLevel, setWaterLevel] = useState(50);
  const [sunlightLevel, setSunlightLevel] = useState(50);
  const [plantHealth, setPlantHealth] = useState('neutral');
  const [deadLeaves, setDeadLeaves] = useState(3);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => {
    setStemHeight(plant?.length * 30)
  }, [plant]);

  useEffect(() => {
    
  }, [stemHeight]);

  const handleWaterPlant = () => {
    const newLevel = Math.min(waterLevel + 10, 100);
    setWaterLevel(newLevel);
    evaluatePlant(newLevel, sunlightLevel);
  };

  const handleSunDrag = (e, data) => {
    let newSunlight = Math.min(Math.max(sunlightLevel + data.deltaY * -0.5, 0), 100);
    setSunlightLevel(newSunlight);
    evaluatePlant(waterLevel, newSunlight);
  };

  const evaluatePlant = (water, sun) => {
    if (water > 70 || sun > 70) {
      setPlantHealth('drooping');
      showFeedback('Too much care can be overwhelming.');
    } else if (water < 30 || sun < 30) {
      setPlantHealth('thirsty');
      showFeedback('Neglect causes stagnation.');
    } else {
      setPlantHealth('happy');
      showFeedback('Balance helps everything thrive.');
    }
  };

  const showFeedback = (msg) => {
    setPopupMessage(msg);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const pruneLeaves = () => {
    if (deadLeaves > 0) {
      setDeadLeaves(deadLeaves - 1);
      showFeedback('Dead leaves removed. Plant visibly stronger!');
    }
  };

  const addNutrient = (nutrient) => {
    showFeedback(`Added ${nutrient}. The plant grows stronger.`);
  };

  const increment = () => {
    setPlant([...plant, {}])
  }

  return (
    <>
      <div className="game-container">
        <h2>🌱 Plant Care Game</h2>
        <button onClick={() => increment()}>Increment</button>

        {/* <div className={`plant ${plantHealth}`} /> */}

        <div class="box">
          <div class="stem" style={{
            height: stemHeight
          }}>
            {
              plant?.map((item, key) => (
                <>
                  <div className={`${plantHealth} leaf`} style={{
                    bottom: `${((stemHeight/plant?.length * key) + 30)}px`,
                    ...(key % 2 === 1 && { rotate: `25deg` }), 
                    ...(key % 2 !== 1 && { rotate: `-25deg` }),
                    ...(key % 2 === 1 && { right: '0' }), 
                    ...(key % 2 !== 1 && { left: '0' })
                  }}>
                    <div className="line"></div>
                  </div>
                </>
              ))
            }

            {/* <div class={`${plantHealth} leaf leaf01`}>
                <div class="line"></div>
            </div>
            <div class={`${plantHealth} leaf leaf02`}>
                <div class="line"></div>
            </div>
            <div class={`${plantHealth} leaf leaf03`}>
                <div class="line"></div>
            </div>
            <div class={`${plantHealth} leaf leaf04`}>
                <div class="line"></div>
            </div>
            <div class={`${plantHealth} leaf leaf05`}>
                <div class="line"></div>
            </div>
            <div class={`${plantHealth} leaf leaf06`}>
                <div class="line"></div>
            </div> */}
          </div>
          <div class="pot"></div>
          <div class="pot-top"></div>
        </div>

        <button onClick={handleWaterPlant}>💧 Water the Plant</button>
        <p>Water: {Math.round(waterLevel)}% | Sunlight: {Math.round(sunlightLevel)}%</p>

        <Draggable nodeRef={sunRef} axis="y" bounds={{ top: -50, bottom: 50 }} onDrag={handleSunDrag}>
          <div ref={sunRef}>
            <div className="sun">☀️</div>
          </div>
        </Draggable>
        
        {Array.from({ length: deadLeaves }, (_, i) => (
          <div key={i} className="dead-leaf" onClick={pruneLeaves}>
            🍂
          </div>
        ))}

        {/* Nutrients */}
        <div className="nutrients">
          <button onClick={() => addNutrient('Empathy')}><FaRegHeart /> Empathy</button>
          <button onClick={() => addNutrient('Psychological Safety')}><FaBrain /> Safety</button>
          <button onClick={() => addNutrient('Trust')}><FaHandshake /> Trust</button>
          <button onClick={() => addNutrient('Support')}><FaPeopleCarry /> Support</button>
        </div>

        {showPopup && (
          <div className="popup">
            Watering & Sunlight = Feedback & Guidance. {popupMessage}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
