import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { DndContext} from "@dnd-kit/core";
import Draggable from 'react-draggable';
import RainCanvas from './Components/RainCanvas';

import './App.css';
import './Plant.css';
import './Sun.css';
import './Rain.css';
import './Nutrient.css';
import './HealthMeter.css';

import ProgressCircle from './Components/ProgressCircle';
import SunlightProgress from './Components/SunlightProgress';
import NutritionProgress from './Components/NutritionProgress';

import nitrogen from './Assets/nitrogen.png';
import phosphorus from './Assets/phosphorus.png';
import potassium from './Assets/potassium.png';
import magnesium from './Assets/magnesium.png';
import rain from './Assets/rain.png';
import sunicon from './Assets/sun-icon.png';
import DropZone from './DropZone';
import DraggableItem from './DraggableItem';
import BirthdayConfetti from './BirthdayConfetti';
import HealthMeter from './Components/HealthMeter';

function App() {
  const sunRef = useRef(null);
  const sunContainerRef = useRef(null);
  const [stemHeight, setStemHeight] = useState(0);
  const [plant, setPlant] = useState([{},{},{},{},{},{},{}]);

  // global activity
  const [game, setGame] = useState(true);
  const [pause, setPause] = useState(false);
  const [deadLeafAction, setDeadLeadAction] = useState(false);

  // water states
  const [waterLevel, setWaterLevel] = useState(0);
  const [waterEffectClass, setWaterEffectClass] = useState('');
  const [sunlightEffectClass, setSunlightEffectClass] = useState('');
  const [sunEffectClass, setSunEffectClass] = useState('');

  const [sunlightLevel, setSunlightLevel] = useState(100);
  const [plantHealth, setPlantHealth] = useState('neutral');
  const [deadLeafs, setDeadLeafs] = useState(3);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isRaining, setIsRaining] = useState(false);
  const [droppedItems, setDroppedItems] = useState([]);
  const [isDropped, setIsDropped] = useState(false);
  const [nutrientCount, setNutrientCount] = useState(0);
  const [nutrientCountProgress, setNutrientCountProgress] = useState(0);
  const [nutrientVerticalProgress, setNutrientVerticalProgress] = useState(0);

  const [waterPoints, setWaterPoints] = useState(0);
  const [sunlightPoints, setSunlightPoints] = useState(0);
  const [nutrientsPoints, setNutrientsPoints] = useState(0);
  const [deadLeafsPoints, setDeadLeafsPoints] = useState(0);
  const [overallPoints, setOverallPoints] = useState(0);
  
  const [bounds, setBounds] = useState({top: 0, bottom: 300});
  const rainIntervalRef = useRef(null);
  const sunIntervalRef = useRef(null);

  // useEffect(() => {
  //   toast("Please provide a water, plant is too little, growth stalls!");
  //   toast("Sunlight is recognition. Without it, your team wilts!");
  // }, [])

  const gameStartModal = () => {
    Swal.fire({
      title: "Welcome to the plant game!",
      text: "You can control sunlight to help your plant grow, and rain to water it. Press and hold the sun icon to provide sunlight, and the rain icon to water your plant. Release to stop! Additionally, drag and drop nutrients into the plant's drop zone to help it grow stronger. Keep an eye on the progress bar to see your plant thrive!",
      width: '50vw',
      confirmButtonText: 'READY TO START',
      allowOutsideClick: false,
      confirmButtonColor: 'forestgreen',
      customClass: {
        container: 'custom-container-class', // Apply class to the outer container
        popup: 'custom-popup-class',         // Apply class to the popup (modal) itself
        title: 'custom-title-class',         // Apply class to the title
        content: 'custom-content-class',     // Apply class to the content text
        confirmButton: 'custom-confirm-btn'  // Apply class to the confirm button
      }
    });
  }

  const gameOverModal = () => {
    Swal.fire({
      title: "GAME OVER!",
      text: "Better luck next time! Do you want to try again and beat your score?",
      icon: 'warning',
      width: '50vw',
      confirmButtonText: 'TRY AGAIN',
      allowOutsideClick: false,
      confirmButtonColor: 'forestgreen',
    }).then((result) => {
        if (result.isConfirmed) window.location.reload();
    });
  }

  useEffect(() => {
    gameStartModal();
  }, []);

  useEffect(() => {
    console.log("waterLevel, sunlightLevel", waterLevel, sunlightLevel);
  }, [waterLevel, sunlightLevel]);

  useEffect(() => {
    setOverallPoints(waterPoints+sunlightPoints+nutrientsPoints+deadLeafsPoints);

    //grow new leaves on the combination of the water and sunlight effects
    if((waterPoints+sunlightPoints) > 30) handleGrowPlant();
  }, [waterPoints, sunlightPoints, nutrientsPoints, deadLeafsPoints])

  useEffect(() => {
    setStemHeight(plant?.length * 50);

    if(deadLeafAction) {
      const findDeadLeavesOnPlant = plant.find(x => x.dead === true);
      if(!findDeadLeavesOnPlant) {
        if(sunlightEffectClass !== 'burnt') setPause(false);
        setDeadLeafsPoints(25);
      }
      else setDeadLeafsPoints(0);
    }
  }, [plant]);

  useEffect(() => {
    if(waterLevel > 0) {
      if (waterLevel === 100) handleStopRain();

      if(!pause) {
        if (waterLevel > 40 && waterLevel < 60) {
          // setWaterEffectClass('healthy');
          setWaterPoints(25);
        }

        else if (waterLevel < 40) {
          // setWaterEffectClass('dull');
          setWaterPoints(15);
        }

        else if (waterLevel > 60) {
          // setSunlightPoints(0);
          // setDeadLeafsPoints(0);
          // setNutrientsPoints(0);
          // setWaterEffectClass('droopy');

          setWaterPoints(15);
          handleApplyDroopLeafsFunctionality();
        }

        else {
          setWaterEffectClass('');
        }

        if(waterLevel === 30) {
          toast("Sunlight is recognition. Without it, your team wilts!");
        }
        if(waterLevel === 60) {
          toast("Too much, and trust erodes!");
        }
      }
    }
  }, [waterLevel]);

  useEffect(() => {
    const sunlevel = (100 - sunlightLevel);

    if(!pause) {
      if(sunlevel < 25 && sunlevel > 15) {
        // setSunlightEffectClass('vibrant');
        setSunlightPoints(25);
      }
  
      if(sunlevel < 45 && sunlevel > 25) {
        setSunlightEffectClass('pale');
        setSunlightPoints(15);
        setWaterPoints(0);
        setDeadLeafsPoints(0);
        setNutrientsPoints(0);
        handleApplyDeadLeafsFunctionality();
      }
      
      if(sunlevel > 55) {
        // setSunlightPoints(15);
        
        setGame(false);
        setSunlightEffectClass('burnt');
        handleResetAllPoints();
      }

      if(sunlevel === 10) {
        if (waterLevel < 40) {
          toast("Please provide a water, plant is too little, growth stalls!");
        }
      }

      if(sunlevel === 40) {
        toast("Sometimes, you must remove what no longer serves growth!");
      }
    }
  }, [sunlightLevel])

  useEffect(() => {
    if(isDropped) {
      const timer = setTimeout(() => {
        setIsDropped(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isDropped])

  useEffect(() => {
    if(!pause) {
      if(nutrientCountProgress === 3) {
        setNutrientCountProgress(0);
        setNutrientVerticalProgress(0);
        setNutrientsPoints(25);

        handleResetWaterLevel();
        handleResetSunlighLevel();
        setSunlightEffectClass('');

        handleGrowPlant();
        handleGrowNewLeavesOnRemovableLocation();
      }
      else if(
        nutrientCountProgress < 3 && nutrientCountProgress !== 0
      ){
        setNutrientsPoints(15);
      }
    }
  }, [nutrientCountProgress]);

  const showFeedback = (msg) => {
    setPopupMessage(msg);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const pruneLeafs = () => {
    if (deadLeafs > 0) {
      setDeadLeafs(deadLeafs - 1);
      showFeedback('Dead leafs removed. Plant visibly stronger!');
    }
  };

  const addNutrient = (nutrient) => {
    showFeedback(`Added ${nutrient}. The plant grows stronger.`);
  };

  const handleGrowPlant = () => {
    console.log(game, !pause)
    if(game && !pause) {
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
    }
  };

  const handleStartRain = () => {
    console.log(game, !pause)
    if(game && !pause) {
      // if(waterLevel < 100) {
        setIsRaining(true);
  
        if (rainIntervalRef.current) clearInterval(rainIntervalRef.current);
  
        rainIntervalRef.current = setInterval(() => {
          setWaterLevel(prev => {
            // if (prev < 100) {
              return prev + 1;
            // } else {
            //   clearInterval(rainIntervalRef.current);
            //   return 100;
            // }
          });
        }, 100);
      // }
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
    if(game && !pause) {
      const { active, over } = event;

      if (over && over.id === 'dropzone') {
        const itemId = active.id;
        const itemData = active.data.current.customData;

        const incrementValue = itemData || 0;
        setNutrientCount((prevCount) => {
          const newCount = prevCount + incrementValue;
          return newCount > 100 ? 100 : newCount;
        });

        setDroppedItems((prevItems) => [...prevItems, itemData]);
        setIsDropped(true);
        setNutrientCountProgress(nutrientCountProgress+1);
        setNutrientVerticalProgress(nutrientVerticalProgress+33.33);
      }
    }
  };

  const handleStartSunlight = () => {
    if(game && !pause) {
      if(sunlightLevel > 0) {
        if (sunIntervalRef.current) clearInterval(sunIntervalRef.current);
  
        sunIntervalRef.current = setInterval(() => {
          setSunlightLevel((
            prev => {
              if (prev <= 100) {
                return prev - 1;
              } else {
                clearInterval(sunIntervalRef.current);
                return 0;
              }
            }
          ));
        }, 500);
  
        setSunEffectClass('sunlight');
      }
    }
  }

  const handleStopSunlight = () => {
    if (sunIntervalRef.current) {
      clearInterval(sunIntervalRef.current);
      sunIntervalRef.current = null;
      setSunEffectClass('');
    }
  }

  const handleApplyDeadLeafsFunctionality = () => {
    if(game && !pause) {
      setDeadLeadAction(true);
      const addTheDeadLeafsInThePlant = plant.map((item, key) => {
        let obj = {};
    
        if (Math.random() < 0.1 && (!item?.remove && !item?.dead && !item?.droop)) obj = { dead: true };
        return { ...item, ...obj };
      });
    
      setPlant(addTheDeadLeafsInThePlant);
    }
  };

  const handleApplyDroopLeafsFunctionality = () => {
    if(game && !pause) {
      const findIfNotExistTheDrooping = plant.find(x => x.droop === true);
      if(!findIfNotExistTheDrooping) {
        const addTheDroopLeafsInThePlant = plant.map((item, key) => {
          let obj = {};
      
          if (Math.random() < 0.3 && (
            !item?.remove  
            && !item?.dead  
            && !item?.droop
          )) {
            obj = { droop: true };
          }
          return { ...item, ...obj };
        });
      
        setPlant(addTheDroopLeafsInThePlant);
      }
    }
  };

  const handleRemoveDeadLeaf = (_item, _key) => {
    if(game) {
      setPlant(plant.map((item, key) => {
        let obj = {};
    
        if (key === _key && _item?.dead === true) {
          delete item.dead;
          obj = { remove: true };
        }
    
        return { ...item, ...obj };
      }));
    }
  }

  const handleGrowNewLeavesOnRemovableLocation = () => {
    if(game && !pause) {
      const growNewLeafs = plant.map((item) => {
        if (item?.remove === true) delete item.remove;
        if (item?.droop === true) delete item.droop;
    
        return item;
      });

      setPlant(growNewLeafs);
    }
  }

  const handleResetAllPoints = () => {
    setWaterPoints(0);
    setSunlightPoints(0);
    setNutrientsPoints(0);
    setDeadLeafsPoints(0);
  }

  const handleResetWaterLevel = () => {
    setWaterLevel(0);
  }

  const handleResetSunlighLevel = () => {
    setSunlightLevel(100);
  }

  const findDeadOrDroopLeaves = () => {
    const findDeadOrDroopLeaves = plant.find(x => (x.dead === true || x.droop === true));
    return findDeadOrDroopLeaves;
  }

  // const handleGrowPlant = () => {
  //   if(plant?.length <= 11) setPlant([...plant, {
  //     // style: {height: 0, width: 0}
  //   }])
  // }

  // const handleSunDrag = (e, data) => {
    // const container = sunContainerRef.current;
    // const sun = sunRef.current;
  
    // if (container && sun) {
    //   const containerHeight = container.offsetHeight;
    //   const sunTop = data?.y || 0;
  
    //   const sunlevel = (sunTop / (containerHeight - sun.offsetHeight)) * 100;
    //   let level = 100 - sunlevel;
  
    //   level = Math.min(Math.max(level, 0), 100);
  
    //   setSunlightLevel(level);
    //   evaluatePlant(waterLevel, level);

    //   // if(sunlevel < 25) {
    //   //   setSunlightEffectClass('vibrant');
    //   // }

    //   // if(sunlevel < 45 && sunlevel > 25) {
    //   //   setSunlightEffectClass('pale');
    //   // }
      
    //   // if(sunlevel > 55) {
    //   //   setSunlightEffectClass('burnt');
    //   // }
    // }
  // };

  // const evaluatePlant = (water, sun) => {
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
  // };

  // const handleWaterPlant = () => {
  //   const newLevel = Math.min(waterLevel + 10, 100);
  //   setWaterLevel(newLevel);
  //   evaluatePlant(newLevel, sunlightLevel);
  // };

  return (
    <>
      <ToastContainer position="bottom-left" />

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
              {/* 
                <div className="progress-container">
                  <div style={{ marginBottom: '30px' }}>
                    <ProgressCircle level={waterLevel} defaultColor={`blue`} title={`Water`} />
                  </div>
                  <div style={{ marginBottom: '30px' }}>
                    <SunlightProgress level={sunlightLevel}/>
                  </div>
                  <div style={{ marginBottom: '30px' }}>
                    <NutritionProgress 
                      title={`Nutritions`} 
                      // percentage={nutrientCount} 
                      percentage={nutrientVerticalProgress}
                    />
                  </div>
                </div> 
              */}
              <div style={{ marginTop: '30px' }}>
                <HealthMeter points={overallPoints}/>
                <h1>{overallPoints}</h1>
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
                  defaultPosition={{ x: 0, y: 50}} 
                  // onDrag={handleSunDrag}
                >
                  {/* <div className="sun" ref={sunRef}>☀️</div> */}
                  <div 
                    className={`${sunEffectClass} sun theSun`} 
                    ref={sunRef} 
                    style={{transform: "translate(0px, 100px)"}}
                  >
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
                  <div className={`stem ${plantHealth} ${waterEffectClass} ${sunlightEffectClass}`} style={{
                    height: stemHeight,
                  }}>
                    {
                      plant?.map((item, key) => (
                        <>
                          {
                            (!item?.remove) &&
                              <div
                                onClick={() => handleRemoveDeadLeaf(item, key)}
                                className={`${plantHealth} ${waterEffectClass} ${sunlightEffectClass} ${(item?.droop) ? `droop` : ``} leaf`}
                                style={{
                                  bottom: `${( (stemHeight / (plant?.length)) * key )}px`,
                                  ...(key % 2 === 1 && {
                                    transform: (waterEffectClass === 'neutral' || item?.dead) ? `rotate(0deg)` : `rotate(80deg)`,
                                    borderTopLeftRadius: '100%',
                                    borderBottomRightRadius: '100%',
                                    
                                  }),
                                  ...(key % 2 !== 1 && {
                                    transform: (waterEffectClass === 'neutral' || item?.dead) ? `rotate(-0deg)` : `rotate(-80deg)`,
                                    borderTopRightRadius: '100%',
                                    borderTopLeftRadius: '0%',
                                    borderBottomLeftRadius: '100%',
                                    
                                  }),
                                  ...(key % 2 === 1 && { right: '0' }),
                                  ...(key % 2 !== 1 && { left: '0' }),
                                  ...(item?.style || {}),

                                  ...(item?.dead && { backgroundColor: '#2a492b' })
                                }}
                              >
                                {
                                  (item?.dead && sunlightEffectClass !== 'burnt') &&
                                    <>
                                      <div className="dead-lead-popup" 
                                        style={{
                                          ...(key % 2 === 1 && { right: '100%' }),
                                          ...(key % 2 !== 1 && { left: '100%' }),
                                        }}
                                      >
                                        <label>Sometimes, you must remove what no longer serves growth.</label> 
                                      </div>
                                    </>
                                }
                              </div>
                          }
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
                {/* <button onClick={() => handleGrowPlant()}>Grow Plant</button> */}

                <div className="nutrients-container">
                  {/* <h2 className="nutrients-title">Nutrients</h2> */}
                  {/* <div> */}
                  
                    <button
                      onMouseDown={() => handleStartSunlight()} 
                      onMouseUp={() => handleStopSunlight()}
                      title="Sun" 
                      className="sunicon"
                      onDragStart={(e) => e.preventDefault()}
                    >
                      <img draggable="false" src={sunicon} alt="Sun" className="sunicon-image" />
                    </button>

                    <button
                      onMouseDown={() => handleStartRain()} 
                      onMouseUp={() => handleStopRain()}
                      title="Rain" 
                      className="rain"
                      onDragStart={(e) => e.preventDefault()}
                    >
                      <img draggable="false" src={rain} alt="Rain" className="rain-image" />
                    </button>
                    
                    <div className="nutrients-panel">
                      <div className="vertical-progress-bar">
                        <div className="vertical-progress-bar-outer">
                          <div className="vertical-progress-bar-inner" style={{
                            height: `${nutrientVerticalProgress}%`
                          }}></div>
                          {/* <h2 className="vertical-progress-bar-content">Please drag the nutrients!</h2> */}
                        </div>
                      </div>
                      <div>
                        <div>
                          <div className="nutrient-box">
                            <DraggableItem id={1} top={0} data={10}>
                              <img className="nutrient-image" src={nitrogen}/>
                            </DraggableItem>
                            <h4 className="nutrient-heading">Empathy</h4>
                          </div>
                          
                          <div className="nutrient-box">
                            <DraggableItem id={2} top={0} data={10}>
                              <img className="nutrient-image" src={phosphorus}/>
                            </DraggableItem>
                            <h4 className="nutrient-heading">Trust</h4>
                          </div>
                          
                          <div className="nutrient-box">
                            <DraggableItem id={3} top={0} data={10}>
                              <img className="nutrient-image" src={magnesium}/>
                            </DraggableItem>
                            <h4 className="nutrient-heading">Psychological Safety</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  {/* </div> */}
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
              
              {Array.from({ length: deadLeafs }, (_, i) => (
                <div key={i} className="dead-leaf" onClick={pruneLeafs}>
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