import React, { useEffect, useRef, useState } from 'react';
import 'react-circular-progressbar/dist/styles.css';

const HealthMeter = ({
    points = 0
}) => {
    const [value, setValue] = useState(0);
    const rangeRef = useRef(null);
    
    const handleRangeChange = () => {
        const value = rangeRef.current.value;
        setValue(value);
    };

    useEffect(() => {
        setValue((points*4)/100);
    }, [points]);

    return (
        <>
            <div className="graph-container" style={{'--rating': value}}>
                <div className="half-donut">
                    <div className="slice">
                        <i className="fa-regular fa-face-grimace"></i>
                    </div>
                    <div className="slice">
                        <i className="fa-regular fa-face-frown"></i>
                    </div>
                    <div className="slice">
                        <i className="fa-regular fa-face-meh"></i>
                    </div>
                    <div className="slice">
                        <i className="fa-regular fa-face-smile"></i>
                    </div>
                    <div className="slice">
                        <i className="fa-regular fa-face-grin-hearts"></i>
                    </div>
                </div>
                <div className="marker"></div>
            </div>

            {/* <div className="form" style={{marginTop: '15px'}}>
                <input onInput={handleRangeChange} ref={rangeRef} type="range" defaultValue={0} step="0.1" min="0" max="5" id="range" />
            </div> */}
        </>
    );
};

export default HealthMeter;