import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
const DropZone = ({ onDrop, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: "dropzone"
  });

  const style = {
    height: 500,
    width: 500,
    border: "2px dashed rgb(156 247 110)",
    position: "relative",
    // backgroundColor: isOver ? "lightgreen" : "transparent", // Highlight when an item is over
  };

  const handleDrop = () => {
    if (isOver) {
      onDrop();
    }
  };

  return (
    <div ref={setNodeRef} style={style} onMouseUp={handleDrop}>
      {children}
    </div>
  );
};

export default DropZone;
