import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

const DraggableItem = ({ id, left, top, data, children }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${id}`,
    data: { customData: data },
  });

  const translateX = transform?.x || 0;
  const translateY = transform?.y || 0;

  const style = {
    width: 100,
    height: 100,
    textAlign: "center",
    lineHeight: "100px",
    cursor: "move",
    top: `${top}px`,
    left: `${left}px`,
    position: 'relative',
    // transform: CSS.Transform.toString(transform),
    transform: `translate(${translateX}px, ${translateY}px)`,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
    >
      {children}
    </div>
  );
};

export default DraggableItem;