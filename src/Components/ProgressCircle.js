import React, { useState } from 'react';
import './../ProgressCircle.css';

const ProgressCircle = ({ 
    defaultColor = 'green',
    title = '',
    level
}) => {
    const [percentage, setPercentage] = useState(67);
    const [color, setColor] = useState(defaultColor);

    const colorInc = 100 / 3;

    const handleInputChange = (event) => {
        const val = event.target.value;

        if (val !== '' && !isNaN(val) && val <= 100 && val >= 0) {
            const valOrig = Number(val);
            setPercentage(valOrig);

            if (valOrig < colorInc * 1) {
                setColor('red');
            } else if (valOrig < colorInc * 2) {
                setColor('orange');
            } else {
                setColor('green');
            }
        } else {
            setPercentage(67);
            setColor('green');
        }
    };

    // const waterHeight = `${100 - percentage}%`;
    const waterHeight = `${100 - level}%`;

    return (
        <>
            <div className={color}>
                <div className="progress">
                    <div className="inner">
                        <div className="percent">
                            {/* <span>{percentage}</span>% */}
                            <span>{level}</span>%
                        </div>
                        <div className="water" style={{ top: waterHeight }}></div>
                        <div className="glare"></div>
                    </div>
                </div>

                <h2 className="progress-title">{title}</h2>
            </div>
            {/* <span>
                Enter Percentage: 
                <input 
                    type="text" 
                    placeholder="67" 
                    value={percentage} 
                    onChange={handleInputChange} 
                />%
            </span> */}
        </>
    );
}

export default ProgressCircle;
