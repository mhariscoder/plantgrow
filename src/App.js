import React, { useEffect, useRef, useState } from 'react';
import { DndContext} from "@dnd-kit/core";
import Draggable from 'react-draggable';
import RainCanvas from './Components/RainCanvas';
import './App.css';
import './Plant.css';
import './Sun.css';
import './Rain.css';
import './Nutrient.css';

import ProgressCircle from './Components/ProgressCircle';
import SunlightProgress from './Components/SunlightProgress';
import NutritionProgress from './Components/NutritionProgress';

import nitrogen from './Assets/nitrogen.png';
import phosphorus from './Assets/phosphorus.png';
import potassium from './Assets/potassium.png';
import rain from './Assets/rain.png';
import DropZone from './DropZone';
import DraggableItem from './DraggableItem';
import BirthdayConfetti from './BirthdayConfetti';

function App() {
  const sunRef = useRef(null);
  const sunContainerRef = useRef(null);
  const [stemHeight, setStemHeight] = useState(0);
  const [plant, setPlant] = useState([
    {},
    {},
    {}
  ]);

  // water states
  const [waterLevel, setWaterLevel] = useState(0);
  const [waterPoints, setWaterPoints] = useState(0);
  const [waterEffectClass, setWaterEffectClass] = useState(null);

  const [sunlightLevel, setSunlightLevel] = useState(100);
  const [plantHealth, setPlantHealth] = useState('neutral');
  const [deadLeaves, setDeadLeaves] = useState(3);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isRaining, setIsRaining] = useState(false);
  const [droppedItems, setDroppedItems] = useState([]);
  const [isDropped, setIsDropped] = useState(false);
  const [nutrientCount, setNutrientCount] = useState(0);
  const [nutrientCountProgress, setNutrientCountProgress] = useState(0);
  const [nutrientVerticalProgress, setNutrientVerticalProgress] = useState(0);
  const [bounds, setBounds] = useState({top: 0, bottom: 300});
  const rainIntervalRef = useRef(null);

  useEffect(() => {
    setStemHeight(plant?.length * 50)
  }, [plant]);

  useEffect(() => {
    if (waterLevel === 100) handleStopRain();

    if (waterLevel > 40 && waterLevel < 60) {
      setWaterPoints(25);
      setWaterEffectClass('healthy');
    } else
    if (waterLevel < 40) {
      setWaterPoints(15);
      setWaterEffectClass('dull');
    } else
    if (waterLevel > 60) {
      setWaterPoints(15);
      setWaterEffectClass('droopy');
    } else {
      setWaterEffectClass(null);
    }
  }, [waterLevel]);

  useEffect(() => {
    if(isDropped) {
      const timer = setTimeout(() => {
        setIsDropped(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isDropped])

  useEffect(() => {
    if(nutrientCountProgress === 3) {
      setNutrientCountProgress(0);
      setNutrientVerticalProgress(0);
      handleGrowPlant();
    }
  }, [nutrientCountProgress]);

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
      const sunTop = data?.y || 0;
  
      let level = 100 - (sunTop / (containerHeight - sun.offsetHeight)) * 100;
  
      level = Math.min(Math.max(level, 0), 100);
  
      setSunlightLevel(level);
      evaluatePlant(waterLevel, level);
    }
  };

  const evaluatePlant = (water, sun) => {
    // actual sun location should be 50
    // if( sun < 10 ) setPlantHealth('drooping');
    // if( sun > 10 && sun < 80 ) setPlantHealth('happy');
    // // if( sun > 80 ) setPlantHealth('thirsty');
    // if( sun > 80 ) setPlantHealth('neutral');

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
    if(waterLevel < 100) {
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
  }

  const handleStopRain = () => {
    setIsRaining(false);
    // setWaterLevel(0);
    
    if (rainIntervalRef.current) {
      clearInterval(rainIntervalRef.current);
      rainIntervalRef.current = null;
    }
  }

  const handleDrop = (event) => {
    const { active, over } = event; // Get active draggable item and where it's dropped

    // Only trigger handleDrop if the draggable item was dropped into DropZone
    if (over && over.id === 'dropzone') {
      const itemId = active.id;  // Get the dropped item's id
      const itemData = active.data.current.customData;  // Get any custom data from the draggable item

      console.log("Item Dropped:", itemId, "Data:", itemData);

      // Update the nutrient count based on the dropped item's data
      const incrementValue = itemData || 0;
      setNutrientCount((prevCount) => {
        const newCount = prevCount + incrementValue;
        return newCount > 100 ? 100 : newCount;
      });

      // Store the dropped item data (optional)
      setDroppedItems((prevItems) => [...prevItems, itemData]);
      setIsDropped(true);
      setNutrientCountProgress(nutrientCountProgress+1);
      setNutrientVerticalProgress(nutrientVerticalProgress+33.33);
    }
  };


  return (
    <>
      <div className="game-container">
        {/* <DragAndDrop /> */}
        <RainCanvas isRaining={isRaining} />

        <DndContext onDragEnd={handleDrop}>
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
                  <SunlightProgress level={sunlightLevel}/>
                </div>
                <div style={{ marginBottom: '30px' }}>
                  <NutritionProgress title={`Nutritions`} percentage={nutrientCount} />
                </div>
              </div>
            </div>

            <div className="visual-panel">
              <div 
                ref={sunContainerRef} 
                className="sun-container"
              >
                <Draggable 
                  axis="y"
                  nodeRef={sunRef}
                  bounds={bounds}
                  defaultPosition={{ x: 0, y: 0}} 
                  onDrag={handleSunDrag}
                >
                  {/* <div className="sun" ref={sunRef}>☀️</div> */}
                  <div className="sun theSun" ref={sunRef} style={{transform: "translate(0px, 100px)"}}>
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
                  {
                    isDropped && 
                      <BirthdayConfetti height={`500px`} width={`500px`} />
                  }
                  <DropZone onDrop={handleDrop}>
                    <div className={`stem ${plantHealth} ${waterEffectClass}`} style={{
                      height: stemHeight,
                    }}>
                      {
                        plant?.map((item, key) => (
                          <>
                            <div
                              className={`${plantHealth} ${waterEffectClass} leaf`}
                              style={{
                                bottom: `${( (stemHeight / (plant?.length)) * key )}px`,
                                ...(key % 2 === 1 && {
                                  // transform: `rotate(25deg)`,
                                  transform: (waterEffectClass === 'neutral') ? `rotate(25deg)` : `rotate(80deg)`,
                                  borderTopLeftRadius: '100%',
                                  borderBottomRightRadius: '100%',
                                  // borderTopRightRadius: '50%',
                                  // borderTopLeftRadius: '50%',
                                  // borderBottomRightRadius: '50%',
                                }),
                                ...(key % 2 !== 1 && {
                                  transform: (waterEffectClass === 'neutral') ? `rotate(-25deg)` : `rotate(-80deg)`,
                                  // transform: `rotate(-25deg)`,
                                  borderTopRightRadius: '100%',
                                  borderTopLeftRadius: '0%',
                                  borderBottomLeftRadius: '100%',
                                  // borderTopRightRadius: '50%',
                                  // borderTopLeftRadius: '50%',
                                  // borderBottomLeftRadius: '50%',
                                }),
                                ...(key % 2 === 1 && { right: '0' }),
                                ...(key % 2 !== 1 && { left: '0' }),
                                ...(item?.style || {})
                              }}
                            >
                              {/* <div className="line"></div> */}
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
                  </DropZone>
                </div>
             
            </div>
          
            <div className="operational-panel">
              <div className="operational-panel-control">
                <button onClick={() => handleGrowPlant()}>Grow Plant</button>

                <div className="nutrients-container">
                  {/* <h2 className="nutrients-title">Nutrients</h2> */}
                  <div>
                    <button
                      onMouseDown={() => handleStartRain()} 
                      onMouseUp={() => handleStopRain()}
                      title="Rain" 
                      className="rain"
                    >
                      <img src={rain} alt="Rain" className="rain-image" />
                    </button>
                    
                    <div className="nutrients-panel">
                      <div className="vertical-progress-bar">
                        <div className="vertical-progress-bar-outer">
                          <div className="vertical-progress-bar-inner" style={{
                            height: `${nutrientVerticalProgress}%`
                          }}></div>
                        </div>
                      </div>
                      <div>
                        <DraggableItem id={1} top={0} data={10}>
                          <img className="nutrient-image" src={nitrogen}/>
                        </DraggableItem>
                        
                        <DraggableItem id={2} top={25} data={10}>
                          <img className="nutrient-image" src={phosphorus}/>
                        </DraggableItem>
                        
                        <DraggableItem id={3} top={50} data={10}>
                          <img className="nutrient-image" src={potassium}/>
                        </DraggableItem>
                      </div>
                    </div>
                  </div>
                </div>
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
        </DndContext>
      </div>
    </>
  );
}

export default App;
