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

import Video from './Assets/video-background-2.mp4';
import PlantAnimation from './Components/PlantAnimation';

function App() {
  const sunRef = useRef(null);
  const sunContainerRef = useRef(null);
  const firstRender = React.useRef(true);

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

  const [sunlightLevel, setSunlightLevel] = useState(0);
  const [plantHealth, setPlantHealth] = useState('neutral');
  const [deadLeaves, setDeadLeaves] = useState(3);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [isRaining, setIsRaining] = useState(false);
  const [droppedItems, setDroppedItems] = useState([]);
  const [isDropped, setIsDropped] = useState(false);
  const [nutrientCount, setNutrientCount] = useState(0);
  const [nutrientCountProgress, setNutrientCountProgress] = useState(0);
  const [nutrientLevel, setNutrientLevel] = useState(0);

  const [waterPoints, setWaterPoints] = useState(0);
  const [sunlightPoints, setSunlightPoints] = useState(0);
  const [nutrientsPoints, setNutrientsPoints] = useState(0);

  const [deadLeavesLevel, setDeadLeavesLevel] = useState(0);
  const [deadLeavesPoints, setDeadLeavesPoints] = useState(0);
  
  const [overallPoints, setOverallPoints] = useState(0);
  
  const [bounds, setBounds] = useState({top: 0, bottom: 300});
  const rainIntervalRef = useRef(null);
  const sunIntervalRef = useRef(null);

  const gameStartModal = () => {
    Swal.fire({
      title: "Welcome to the plant game!",
      text: "You can control sunlight to help your plant grow, and rain to water it. Press and hold the sun icon to provide sunlight, and the rain icon to water your plant. Release to stop! Additionally, drag and drop nutrients into the plant's drop zone to help it grow stronger. Keep an eye on the progress bar to see your plant thrive!",
      width: '50vw',
      confirmButtonText: 'READY TO START',
      allowOutsideClick: false,
      confirmButtonColor: 'forestgreen',
      customClass: {
        container: 'custom-container-class',
        popup: 'custom-popup-class',
        title: 'custom-title-class',
        content: 'custom-content-class',
        confirmButton: 'custom-confirm-btn'
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
    sfwdGetPlantActivityStatistic();

    // setWaterLevel(39);
    // setWaterPoints(15);
    // setSunlightLevel(10);
    // setSunlightPoints(15);
    // setNutrientLevel(0);
    // setNutrientsPoints(25);
    // setDeadLeavesLevel(25);
    // setDeadLeavesPoints(0);
  }, []);

  useEffect(() => {
    // setOverallPoints(parseInt(waterPoints)+parseInt(sunlightPoints)+parseInt(nutrientsPoints)+parseInt(deadLeavesPoints));

    //grow new leaves on the combination of the water and sunlight effects
    if((waterPoints+sunlightPoints) > 30) handleGrowPlant();
  }, [waterPoints, sunlightPoints, nutrientsPoints, deadLeavesPoints]);

  useEffect(() => {
    console.log(
      "waterLevel, sunlightLevel, nutrientLevel, deadLeavesLevel, waterPoints, sunlightPoints, nutrientsPoints, deadLeavesPoints",
      waterLevel,
      sunlightLevel, 
      nutrientLevel,
      deadLeavesLevel,
      waterPoints, 
      sunlightPoints, 
      nutrientsPoints, 
      deadLeavesPoints
    );
  }, [waterLevel, sunlightLevel, nutrientLevel, deadLeavesLevel]);

  useEffect(() => {
    setStemHeight(plant?.length * 50);

    if(deadLeafAction) {
      const findDeadLeavesOnPlant = plant.find(x => x.dead === true);
      if(!findDeadLeavesOnPlant) {
        if(sunlightEffectClass !== 'burnt') setPause(false);
        setDeadLeavesPoints(25);
      }
      else {
        setDeadLeavesPoints(0);
      }
    }
  }, [plant]);

  useEffect(() => {
    if(waterLevel > 0) {
      if (waterLevel === 100) handleStopRain();

      if(!pause) {
        if (waterLevel > 40 && waterLevel < 60) {
          // setWaterEffectClass('healthy');
          setWaterPoints(25);
          setOverallPoints(25+parseInt(sunlightPoints)+parseInt(nutrientsPoints)+parseInt(deadLeavesPoints));
        }

        else if (waterLevel < 40) {
          // setWaterEffectClass('dull');
          setWaterPoints(15);
          setOverallPoints(15+parseInt(sunlightPoints)+parseInt(nutrientsPoints)+parseInt(deadLeavesPoints));
        }

        else if (waterLevel > 60) {
          // setSunlightPoints(0);
          // setDeadLeavesPoints(0);
          // setNutrientsPoints(0);
          // setWaterEffectClass('droopy');

          setWaterPoints(15);
          setOverallPoints(15+parseInt(sunlightPoints)+parseInt(nutrientsPoints)+parseInt(deadLeavesPoints));
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
    console.log('sunlightLevel', sunlightLevel);

    // const sunlevel = (100 - sunlightLevel);

    if(!pause) {
      if(sunlightLevel < 25 && sunlightLevel > 15) {
        // setSunlightEffectClass('vibrant');
        setSunlightPoints(25);
        setOverallPoints(parseInt(waterPoints)+25+parseInt(nutrientsPoints)+parseInt(deadLeavesPoints));
      }
  
      if(sunlightLevel < 45 && sunlightLevel > 25) {
        setSunlightEffectClass('pale');
        setSunlightPoints(15);
        // setWaterPoints(0);
        // setDeadLeavesPoints(0);
        // setNutrientsPoints(0);
        handleApplyDeadLeavesFunctionality();

        setOverallPoints(parseInt(waterPoints)+15+parseInt(nutrientsPoints)+parseInt(deadLeavesPoints));
      }
      
      if(sunlightLevel > 55) {
        setSunlightPoints(15);
        
        setGame(false);
        setSunlightEffectClass('burnt');
        setOverallPoints(parseInt(waterPoints)+15+parseInt(nutrientsPoints)+parseInt(deadLeavesPoints));
      }

      if(sunlightLevel === 10) {
        if (waterLevel < 40) {
          toast("Please provide a water, plant is too little, growth stalls!");
        }
      }

      if(sunlightLevel === 40) {
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
        setNutrientLevel(0);
        setNutrientsPoints(25);

        // handleResetWaterLevel();
        // handleResetSunlighLevel();
        setSunlightEffectClass('');

        handleGrowPlant();
        handleGrowNewLeavesOnRemovableLocation();
        setOverallPoints(parseInt(waterPoints)+parseInt(sunlightPoints)+25+parseInt(deadLeavesPoints));
        sfwdSavePlantActivityStatistic({
          nutrient_progress: nutrientCountProgress,
          nutrient_points: 25,
          total: waterPoints+sunlightPoints+25+deadLeavesPoints
        });
      }
      else if(
        nutrientCountProgress < 3 && nutrientCountProgress !== 0
      ){
        setNutrientsPoints(15);
        setOverallPoints(parseInt(waterPoints)+parseInt(sunlightPoints)+15+parseInt(deadLeavesPoints));
        sfwdSavePlantActivityStatistic({
          nutrient_progress: nutrientCountProgress,
          nutrient_points: 15,
          total: waterPoints+sunlightPoints+15+deadLeavesPoints
        });
      }
    }
  }, [nutrientCountProgress]);

  const showFeedback = (msg) => {
    setPopupMessage(msg);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const pruneLeafs = () => {
    if (deadLeaves > 0) {
      setDeadLeaves(deadLeaves - 1);
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
      if(waterLevel < 100) {
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
        }, 300);
      }
    }
  }

  const handleStopRain = () => {
    setIsRaining(false);
    // setWaterLevel(0);
    
    if (rainIntervalRef.current) {
      clearInterval(rainIntervalRef.current);
      rainIntervalRef.current = null;

      sfwdSavePlantActivityStatistic({
        water_progress: waterLevel,
        water_points: waterPoints,
        sun_progress: sunlightLevel,
        sun_points: sunlightPoints,
        nutrient_progress: nutrientLevel,
        nutrient_points: nutrientsPoints,
        dead_leaves_progress: deadLeavesLevel,
        dead_leaves_points: deadLeavesPoints,
        // total_progress: overallPoints,
        // total_points: overallPoints
        total: overallPoints
      });
    }
  }

  const handleDrop = (event) => {
    if(game && !pause) {
      const { active, over } = event;
      let nutrientPoints = 0;

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
        setNutrientLevel(nutrientLevel+33.33);
      }
    }
  };

  const handleStartSunlight = () => {
    if(game && !pause) {
      // if(sunlightLevel > 0) {
      if(sunlightLevel < 100) {
        if (sunIntervalRef.current) clearInterval(sunIntervalRef.current);
  
        sunIntervalRef.current = setInterval(() => {
          // setSunlightLevel((
          //   prev => {
          //     if (prev <= 100) {
          //       return prev - 1;
          //     } else {
          //       clearInterval(sunIntervalRef.current);
          //       return 0;
          //     }
          //   }
          // ));

          setSunlightLevel((
            prev => {
              if (prev <= 100) {
                return prev + 1;
              } else {
                clearInterval(sunIntervalRef.current);
                return 0;
              }
            }
          ));
        }, 300);
  
        setSunEffectClass('sunlight');
      }
    }
  }

  const handleStopSunlight = () => {
    if (sunIntervalRef.current) {
      clearInterval(sunIntervalRef.current);
      sunIntervalRef.current = null;
      setSunEffectClass('');

      sfwdSavePlantActivityStatistic({
        water_progress: waterLevel,
        water_points: waterPoints,
        sun_progress: sunlightLevel,
        sun_points: sunlightPoints,
        nutrient_progress: nutrientLevel,
        nutrient_points: nutrientsPoints,
        dead_leaves_progress: deadLeavesLevel,
        dead_leaves_points: deadLeavesPoints,
        // total_progress: overallPoints,
        // total_points: overallPoints
        total: overallPoints
      });
    }
  }

  const handleApplyDeadLeavesFunctionality = () => {
    if(game && !pause) {
      setDeadLeadAction(true);
      const addTheDeadLeavesInThePlant = plant.map((item, key) => {
        let obj = {};
    
        if (Math.random() < 0.1 && (!item?.remove && !item?.dead && !item?.droop)) obj = { dead: true };
        return { ...item, ...obj };
      });
    
      setPlant(addTheDeadLeavesInThePlant);
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
      let _plant = plant.map((item, key) => {
        let obj = {};
    
        if (key === _key && _item?.dead === true) {
          delete item.dead;
          obj = { remove: true };
        }
    
        return { ...item, ...obj };
      });

      setPlant(_plant);

      const findDeadLeavesOnPlant = plant.find(x => x.dead === true);

      if(!findDeadLeavesOnPlant) {
        setOverallPoints(parseInt(waterPoints)+parseInt(sunlightPoints)+parseInt(nutrientsPoints)+25);
        sfwdSavePlantActivityStatistic({
          dead_leaves_progress: 25,
          dead_leaves_points: 25,
          total: waterPoints+sunlightPoints+nutrientsPoints+25
        });
      } else {
        setOverallPoints(parseInt(waterPoints)+parseInt(sunlightPoints)+parseInt(nutrientsPoints)+0);
        sfwdSavePlantActivityStatistic({
          dead_leaves_progress: 0,
          dead_leaves_points: 0,
          total: waterPoints+sunlightPoints+nutrientsPoints+0
        });
      }
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
    setDeadLeavesPoints(0);
  }

  const handleResetWaterLevel = () => {
    setWaterLevel(0);
  }

  const handleResetSunlighLevel = () => {
    // setSunlightLevel(100);
    setSunlightLevel(0);
  }

  const findDeadOrDroopLeaves = () => {
    const findDeadOrDroopLeaves = plant.find(x => (x.dead === true || x.droop === true));
    return findDeadOrDroopLeaves;
  }

  const savePlantActivity = async () => {
    const lessonId = document.getElementById('root')?.dataset?.lessonId;

    if (!lessonId) {
      return;
    }

    const formData = new FormData();
    formData.append('action', 'save_sfwd_plant_activity');
    formData.append('_wpnonce', window.LDPlantActivityData.nonce);
    formData.append('lesson_id', lessonId);

    try {
      const res = await fetch(window.LDPlantActivityData.ajax_url, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const result = await res.json();
      console.log('Response:', result);
    } catch (error) {
      console.error('AJAX error:', error);
    }
  }

  const completePlantActivity = async () => {
    const lessonId = document.getElementById('root')?.dataset?.lessonId;

    if (!lessonId) {
      return;
    }

    const formData = new FormData();
    formData.append('action', 'complete_sfwd_plant_activity');
    formData.append('_wpnonce', window.LDPlantActivityData.nonce);
    formData.append('lesson_id', lessonId);

    try {
      const res = await fetch(window.LDPlantActivityData.ajax_url, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const result = await res.json();
      console.log('Response:', result);
    } catch (error) {
      console.error('AJAX error:', error);
    }
  }

  const sfwdSavePlantActivityStatistic = async (data) => {
    const lessonId = document.getElementById('root')?.dataset?.lessonId;

    if (!lessonId) {
      console.error('Lesson ID not found.');
      return;
    }

    const formData = new FormData();
    formData.append('action', 'sfwd_save_plant_activity_statistic');
    formData.append('_wpnonce', window.LDPlantActivityData.nonce);
    formData.append('lesson_id', lessonId);

    const allowedFields = [
      'water_progress', 'water_points',
      'sun_progress', 'sun_points',
      'nutrient_progress', 'nutrient_points',
      'dead_leaves_progress', 'dead_leaves_points',
      // 'total_progress', 'total_points'
      'total'
    ];

    for (const key in data) {
      if (allowedFields.includes(key)) {
        formData.append(key, data[key]);
      }
    }

    try {
      const res = await fetch(window.LDPlantActivityData.ajax_url, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const result = await res.json();
      console.log('Update Response:', result);
    } catch (error) {
      console.error('AJAX error:', error);
    }
  };

  const sfwdGetPlantActivityStatistic = async () => {
    const lessonId = document.getElementById('root')?.dataset?.lessonId;

    if (!lessonId) {
      console.error('Lesson ID not found.');
      return;
    }

    const formData = new FormData();
    formData.append('action', 'sfwd_get_plant_activity_statistic');
    formData.append('_wpnonce', window.LDPlantActivityData.nonce);
    formData.append('lesson_id', lessonId);

    try {
      const res = await fetch(window.LDPlantActivityData.ajax_url, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const result = await res.json();
      const data = result?.data?.data;
      
      setWaterLevel(parseInt(data?.water_progress));
      setWaterPoints(parseInt(data?.water_points));
      setSunlightLevel(parseInt(data?.sun_progress));
      setSunlightPoints(parseInt(data?.sun_points));
      setNutrientLevel(parseInt(data?.nutrient_progress));
      setNutrientsPoints(parseInt(data?.nutrient_points));
      setDeadLeavesLevel(parseInt(data?.dead_leaves_progress));
      setDeadLeavesPoints(parseInt(data?.dead_leaves_points));

      // this should be modifiy
      setOverallPoints(parseInt(data?.water_points)+parseInt(data?.sun_points)+parseInt(data?.nutrient_points)+parseInt(data?.dead_leaves_points));
      
    } catch (error) {
      console.error('AJAX error:', error);
    }
  };

  return (
    <>
      {
        /*
          <button onClick={() => savePlantActivity()}>Save Activity</button>
          <button onClick={() => completePlantActivity()}>Complete Activity</button>
        */
      }

      <PlantAnimation />

      <ToastContainer position="bottom-left" />  
        <div className="game-container">
          
          <div className="video-layer"></div>
          <video
            autoPlay
            muted
            loop
            src={Video}
            type="video/mp4"
          />

          {/* <DragAndDrop /> */}
          <RainCanvas isRaining={isRaining} />

          <DndContext onDragEnd={handleDrop}>
            <div style={{
              display: 'flex',
              flex: 1
            }}>
              {/* <div className={`plant ${plantHealth}`} /> */}

              <div className="result-panel">
                <div style={{ marginTop: '30px' }}>
                  <HealthMeter points={overallPoints}/>
                  <h1 style={{color: '#fff'}}>{overallPoints}</h1>
                </div>

                <div className="progress-container">
                    <div style={{ marginBottom: '30px' }}>
                      <ProgressCircle level={waterLevel} defaultColor={`blue`} title={`Water`} />
                    </div>
                    <div style={{ marginBottom: '30px' }}>
                      <SunlightProgress level={sunlightLevel}/>
                    </div>
                    {/* <div style={{ marginBottom: '30px' }}>
                      <NutritionProgress 
                        title={`Nutritions`} 
                        // percentage={nutrientCount} 
                        percentage={nutrientLevel}
                      />
                    </div> */}
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
                    defaultPosition={{ x: -500, y: 50}} 
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
                              height: `${nutrientLevel}%`
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
                
                {Array.from({ length: deadLeaves }, (_, i) => (
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