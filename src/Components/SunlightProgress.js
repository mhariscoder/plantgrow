import React, { useState } from "react";
import "./../SunlightProgress.css";

const SunlightProgress = ({ title = "Sunlight", level }) => {
    let brightness = 1;
    // let waterHeight = 0
    
    // `${parseInt( (level <= 0) ? 100 : (100 - level) )}%`;
  
    // if(level === 0) waterHeight = 100;
    // if(level < 100) waterHeight = parseInt(100 - level);

    // brightness = (level !== 0) ? (level === 100) ? 1 : ((1-(level/100)) + 1) : 0;
    
    brightness = (level !== 0) ? (((level/100)) + 1) : 1;
    console.log('brightness', brightness)

    return (
        <div className="sunlight">
            <div 
                className="progress" 
                style={{
                    filter: `brightness(${brightness})`
                }}
            >
                <div className="inner">
                    <div className="percent">
                        {/* <span>{percentage}</span>% */}
                        <span>{level}</span>%
                    </div>
                    {/* <div className="water" style={{ top: waterHeight }}></div> */}
                    <div className="glare"></div>
                </div>
            </div>
            {/* <h2 className="progress-title">{title}</h2> */}
        </div>
  );
};

export default SunlightProgress;
