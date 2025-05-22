import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import RainCanvas from './Components/RainCanvas';
import './App.css';
import './Plant.css';
import './Sun.css';
import './Rain.css';

// Nutrient icons
import { FaRegHeart, FaBrain, FaHandshake, FaPeopleCarry } from 'react-icons/fa';
import ProgressCircle from './Components/ProgressCircle';
import SunlightProgress from './Components/SunlightProgress';
import NutritionProgress from './Components/NutritionProgress';

function App() {
  const sunRef = useRef(null);
  const sunContainerRef = useRef(null);
  const [stemHeight, setStemHeight] = useState(0);
  const [plant, setPlant] = useState([]);
  const [waterLevel, setWaterLevel] = useState(0);
  const [sunlightLevel, setSunlightLevel] = useState(100);
  const [plantHealth, setPlantHealth] = useState('neutral');
  const [deadLeaves, setDeadLeaves] = useState(3);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isRaining, setIsRaining] = useState(false);
  const rainIntervalRef = useRef(null);

  useEffect(() => {
    setStemHeight(plant?.length * 30)
  }, [plant]);

  useEffect(() => {
    
  }, [stemHeight]);

  useEffect(() => {
    if (waterLevel === 100) handleStopRain();
  }, [waterLevel]);

  const handleWaterPlant = () => {
    const newLevel = Math.min(waterLevel + 10, 100);
    setWaterLevel(newLevel);
    evaluatePlant(newLevel, sunlightLevel);
  };

  const handleSunDrag = (e, data) => {
    const container = sunContainerRef.current;
    const sun = sunRef.current;
  
    if (container && sun) {
      const containerHeight = container.offsetHeight;
      const sunTop = data.y;
  
      let level = 100 - (sunTop / (containerHeight - sun.offsetHeight)) * 100;
  
      level = Math.min(Math.max(level, 0), 100);
  
      setSunlightLevel(level);
      evaluatePlant(waterLevel, level);
    }
  };

  const evaluatePlant = (water, sun) => {
    // actual sun location should be 50
    if( sun < 10 ) setPlantHealth('drooping');
    if( sun > 10 && sun < 80 ) setPlantHealth('happy');
    // if( sun > 80 ) setPlantHealth('thirsty');
    if( sun > 80 ) setPlantHealth('neutral');

    // if (water > 60 || sun > 60) {
    //   setPlantHealth('drooping');
    //   showFeedback('Too much care can be overwhelming.');
    // } else if (water < 30 || sun < 30) {
    //   setPlantHealth('thirsty');
    //   showFeedback('Neglect causes stagnation.');
    // } else {
    //   setPlantHealth('happy');
    //   showFeedback('Balance helps everything thrive.');
    // }
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

  // const handleGrowPlant = () => {
  //   if(plant?.length <= 11) setPlant([...plant, {
  //     // style: {height: 0, width: 0}
  //   }])
  // }

  const handleGrowPlant = () => {
    if (plant?.length <= 11) {
      setPlant((prevPlant) => {
        const newPlant = [...prevPlant, { style: { height: 0, width: 0 } }];
        return newPlant;
      });
  
      setTimeout(() => {
        setPlant((prevPlant) => {
          const updatedPlant = prevPlant.map((item, index) => {
            if (index === plant.length) {
              return { style: {} };
            }
            return item;
          });
          return updatedPlant;
        });
      }, 1000);
    }
  };

  const handleStartRain = () => {
    setIsRaining(true);

    if (rainIntervalRef.current) clearInterval(rainIntervalRef.current);

    rainIntervalRef.current = setInterval(() => {
      setWaterLevel(prev => {
        if (prev < 100) {
          return prev + 1;
        } else {
          clearInterval(rainIntervalRef.current);
          return 100;
        }
      });
    }, 100);
  }

  const handleStopRain = () => {
    setIsRaining(false);
    setWaterLevel(0);
    
    if (rainIntervalRef.current) {
      clearInterval(rainIntervalRef.current);
      rainIntervalRef.current = null;
    }
  }

  return (
    <>
      <div className="game-container">
        
        <RainCanvas isRaining={isRaining} />

        <div style={{
          display: 'flex',
          flex: 1
        }}>
          {/* <div className={`plant ${plantHealth}`} /> */}

          <div className="result-panel">
            <div className="progress-container">
              <div style={{ marginBottom: '30px' }}>
                <ProgressCircle level={waterLevel} defaultColor={`blue`} title={`Water`} />
              </div>
              <div style={{ marginBottom: '30px' }}>
                {/* <ProgressCircle defaultColor={`orange`} title={`Sunlight`} /> */}
                <SunlightProgress level={sunlightLevel}/>
              </div>
              <div style={{ marginBottom: '30px' }}>
                <NutritionProgress title={`Nutritions`} />
              </div>
              
            </div>
          </div>

          <div className="visual-panel">
            <div 
              ref={sunContainerRef} 
              className="sun-container"
            >
              <Draggable 
                // axis="y" 
                nodeRef={sunRef}
                bounds={{ top: 0, bottom: 300 }} 
                onDrag={handleSunDrag}
              >
                {/* <div className="sun" ref={sunRef}>☀️</div> */}
                <div className="sun theSun" ref={sunRef}>
                  <div className="ray_box">
                    <div className="ray ray1"></div>
                    <div className="ray ray2"></div>
                    <div className="ray ray3"></div>
                    <div className="ray ray4"></div>
                    <div className="ray ray5"></div>
                    <div className="ray ray6"></div>
                    <div className="ray ray7"></div>
                    <div className="ray ray8"></div>
                    <div className="ray ray9"></div>
                    <div className="ray ray10"></div>
                  </div>
                </div>
              </Draggable>
            </div>

            <div className="plant">
              <div className={`stem ${plantHealth}`} style={{
                height: stemHeight,
                transform: (plantHealth === 'neutral') ? `none` : `scale(1.2)`,
              }}>
                {
                  plant?.map((item, key) => (
                    <>
                      <div
                        className={`${plantHealth} leaf`}
                        style={{
                          bottom: `${((stemHeight / plant?.length) * key) + 30}px`,
                          ...(key % 2 === 1 && {
                            // transform: `rotate(25deg)`,
                            transform: (plantHealth === 'neutral') ? `rotate(25deg)` : `rotate(40deg)`,
                            borderTopRightRadius: '50%',
                            borderTopLeftRadius: '50%',
                            borderBottomRightRadius: '50%',
                          }),
                          ...(key % 2 !== 1 && {
                            transform: (plantHealth === 'neutral') ? `rotate(-25deg)` : `rotate(-40deg)`,
                            // transform: `rotate(-25deg)`,
                            borderTopRightRadius: '50%',
                            borderTopLeftRadius: '50%',
                            borderBottomLeftRadius: '50%',
                          }),
                          ...(key % 2 === 1 && { right: '0' }),
                          ...(key % 2 !== 1 && { left: '0' }),
                          ...(item?.style || {})
                        }}
                      >
                        <div className="line"></div>
                      </div>
                    </>
                  ))
                }

                {/* <div class={`${plantHealth} leaf leaf01`}>
                    <div className="line"></div>
                </div>
                <div class={`${plantHealth} leaf leaf02`}>
                    <div className="line"></div>
                </div>
                <div class={`${plantHealth} leaf leaf03`}>
                    <div className="line"></div>
                </div>
                <div class={`${plantHealth} leaf leaf04`}>
                    <div className="line"></div>
                </div>
                <div class={`${plantHealth} leaf leaf05`}>
                    <div className="line"></div>
                </div>
                <div class={`${plantHealth} leaf leaf06`}>
                    <div className="line"></div>
                </div> */}
              </div>
              <div className="pot"></div>
              <div className="pot-top"></div>
            </div>
          </div>
        
          <div className="operational-panel">
            <div className="operational-panel-control">
              <button onClick={() => handleGrowPlant()}>Grow Plant</button>
              <button onClick={() => handleStartRain()}>Start Rain</button>
              <button onClick={() => handleStopRain()}>Stop Rain</button>
            </div>
          </div>

          {/*
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
          */}
        </div>
      </div>
    </>
  );
}

export default App;
