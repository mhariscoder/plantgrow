import React, { useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";  // Import the necessary hooks
import { CSS } from "@dnd-kit/utilities";  // Helper for handling drag styles

const DraggableItem = ({ id, left, top, data }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${id}`,
    data: { customData: data },
  });

  const style = {
    width: 100,
    height: 100,
    backgroundColor: "skyblue",
    textAlign: "center",
    lineHeight: "100px",
    cursor: "move",
    position: "absolute",
    top: `${top}px`,
    left: `${left}px`,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
    >
      Drag Me {id}
    </div>
  );
};

const DropZone = ({ onDrop }) => {
  const [droppedItems, setDroppedItems] = useState([]);

  const { isOver, setNodeRef } = useDroppable({
    id: "dropzone",  // This ID is used for the drop zone
  });

  // Add a visual cue when the item is over the drop zone
  const style = {
    height: 500,
    width: 500,
    border: "2px dashed #ccc",
    position: "relative",
    backgroundColor: isOver ? "lightgreen" : "transparent",
  };

  const handleDrop = (event) => {
    const item = event.active.id;  // Get the ID of the dragged item
    console.log("Item Dropped:", item);
    setDroppedItems((prevItems) => [...prevItems, item]);  // Add the dropped item to the state
    if (onDrop) onDrop(event);  // Call the parent drop handler if it exists
  };

  return (
    <div ref={setNodeRef} style={style} onDrop={handleDrop}>
      <h3>Drop Zone</h3>
      {droppedItems.map((id, idx) => (
        <div key={idx} style={{ padding: 10 }}>
          Item {id} was dropped here
        </div>
      ))}
    </div>
  );
};

const DragAndDrop = () => {
  const handleDrop = (event) => {
    console.log("Drag Ended:", event);
  };

  return (
    <>
      <DndContext onDragEnd={handleDrop}>
        <DraggableItem id={1} data={'test1'} left={0} top={0} />
        <DraggableItem id={2} data={'test2'} left={150} top={0} />
        <DropZone onDrop={handleDrop}></DropZone>
      </DndContext>
    </>
  );
};

export default DragAndDrop;