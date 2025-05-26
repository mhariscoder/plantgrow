import React, { useEffect, useRef } from 'react';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const NutritionProgress = ({
    title,
    percentage = 0
}) => {
    // const percentage = 66;
    const progressRef = useRef(null);

    return (
        <>
            <div style={{ width: 160, height: 160 }}>
                <CircularProgressbar
                    value={percentage}
                    text={`${percentage}%`}
                    background
                    backgroundPadding={6}
                    strokeWidth={10}
                    styles={buildStyles({
                        backgroundColor: "#94a88a",
                        textColor: "#ffffff",
                        pathColor: "#ffffff",
                        trailColor: "#9cf76e",
                        width: 0
                    })}
                />
                <h2 className="progress-title">{title}</h2>
            </div>
        </>
    );
};

export default NutritionProgress;
