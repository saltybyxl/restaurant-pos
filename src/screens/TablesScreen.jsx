import {
  DndContext,
  DragOverlay,
  useDraggable,
  useSensor,
  useSensors,
  TouchSensor,
  MouseSensor,
} from "@dnd-kit/core";
import { useState } from "react";
import { useOrder } from "../context/OrderContext";

const sectionNames = {
  restaurant: "Restaurant",
  kiosk: "Kiosk",
  inside: "Inside",
};

function DraggableTable({ table, onTableSelect }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: table.id });
  const { dispatch, selectedTable, editMode } = useOrder();
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(table.name);

  const style = {
    position: "absolute",
    left: table.x,
    top: table.y,
    zIndex: 10,
  };

  const dragProps = editMode ? { ...listeners, ...attributes } : {};

  return (
    <div ref={setNodeRef} style={style} {...dragProps}>
      {editing ? (
        <div className="flex gap-1">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="px-2 py-1 rounded border w-24 text-sm"
            autoFocus
          />
          <button
            onClick={() => {
              if (newName.trim() !== table.name) {
                dispatch({
                  type: "RENAME_TABLE",
                  id: table.id,
                  newName: newName.trim(),
                });
              }
              setEditing(false);
            }}
            className="text-green-600 font-bold px-2"
          >
            ✅
          </button>
        </div>
      ) : (
        <div
          onClick={() => {
            dispatch({ type: "SET_SELECTED_TABLE", table: table.name });
            if (!editMode && typeof onTableSelect === "function") {
              onTableSelect();
            }
          }}
          className={`px-3 py-2 rounded-lg shadow text-sm relative text-center w-28 ${
            selectedTable === table.name
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-800"
          }`}
        >
          {table.name}
          {editMode && (
            <div className="absolute top-0 right-1 text-xs flex gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditing(true);
                }}
                className="text-yellow-500 text-lg px-2"
              >
                ✏
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch({ type: "REMOVE_TABLE", id: table.id });
                }}
                className="text-red-500 text-lg px-2"
              >
                ❌
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TablesScreen({ onTableSelect }) {
  const { activeSection, dispatch, tableLayout, selectedTable, editMode } =
    useOrder();
  const tables = tableLayout[activeSection];

  const [activeId, setActiveId] = useState(null);
  const activeTable = tables.find((t) => t.id === activeId);

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(MouseSensor)
  );

  const handleDragEnd = (event) => {
    setActiveId(null);
    if (!editMode) return;

    const { delta, active } = event;
    const id = active.id;
    const table = tables.find((t) => t.id === id);
    if (!table) return;

    const updatedX = table.x + delta.x;
    const updatedY = table.y + delta.y;

    dispatch({ type: "MOVE_TABLE", id, x: updatedX, y: updatedY });
  };

  return (
    <div className="p-4 pb-24">
      {/* Section Tabs */}
      <div className="flex justify-center gap-2 mb-4">
        {Object.keys(sectionNames).map((section) => (
          <button
            key={section}
            onClick={() => dispatch({ type: "SET_SECTION", section })}
            className={`px-4 py-2 rounded-full ${
              activeSection === section
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {sectionNames[section]}
          </button>
        ))}
      </div>

      {/* Add / Lock Buttons */}
      <div className="flex justify-center mt-2 gap-2 mb-4">
        <button
          onClick={() => dispatch({ type: "ADD_TABLE" })}
          className="px-4 py-1 bg-green-500 text-white rounded shadow hover:bg-green-600"
        >
          ➕ Add Table
        </button>
        <button
          onClick={() => dispatch({ type: "TOGGLE_EDIT_MODE" })}
          className={`px-4 py-1 rounded shadow ${
            editMode ? "bg-yellow-500" : "bg-gray-400"
          } text-white hover:opacity-90`}
        >
          {editMode ? "🔓 Editing" : "🔒 Locked"}
        </button>
      </div>

      {/* Table Canvas */}
      <DndContext
        sensors={sensors}
        onDragStart={(event) => setActiveId(event.active.id)}
        onDragCancel={() => setActiveId(null)}
        onDragEnd={handleDragEnd}
      >
        <div className="relative w-full h-[60vh] bg-gray-100 rounded border overflow-hidden">
          {tables.map((table) => (
            <DraggableTable
              key={table.id}
              table={table}
              onTableSelect={onTableSelect}
            />
          ))}
        </div>

        {/* Drag Preview */}
        <DragOverlay>
          {activeTable ? (
            <div className="px-3 py-2 rounded-lg shadow text-sm w-28 bg-blue-200 text-center">
              {activeTable.name}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Selected Display */}
      {selectedTable && (
        <div className="mt-4 text-center text-blue-600 font-medium">
          ✅ Selected: {selectedTable}
        </div>
      )}
    </div>
  );
}
