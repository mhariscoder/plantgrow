import React, { useEffect, useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";  // Import the necessary hooks
import { CSS } from "@dnd-kit/utilities";  // Helper for handling drag styles

const DropZone = ({ onDrop, children }) => {
    const [droppedItems, setDroppedItems] = useState([]);
    // const [isDropped, setIsDropped] = useState(false);
    const { isOver, setNodeRef } = useDroppable({
      id: "dropzone",
    });

    // const blastClass = isDropped ? "blast" : "";
  
    const style = {
      height: 500,
      width: 500,
      border: "2px dashed rgb(156 247 110)",
      position: "relative",
      // backgroundColor: isOver ? "lightgreen" : "transparent",
    };

    // useEffect(() => {
    //   setIsDropped(true);
    // }, [onDrop])

    // useEffect(() => {
    //   if(isDropped) {
    //     const timer = setTimeout(() => {
    //       setIsDropped(false);
    //     }, 1000);
    //     return () => clearTimeout(timer);
    //   }
    // }, [isDropped])
  
    return (
      <div 
        ref={setNodeRef} 
        style={style}
        // className={blastClass}
      >
        {children}
        {droppedItems.map((item, idx) => (
          <div key={idx} style={{ padding: 10 }}>
            Item {item} was dropped here
          </div>
        ))}
      </div>
    );
};

export default DropZone;