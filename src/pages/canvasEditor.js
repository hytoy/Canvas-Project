import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Canvas, Rect, Circle, Textbox, PencilBrush } from "fabric";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "../App.css";

function CanvasEditor() {
   const { canvasId } = useParams();
   const canvasRef = useRef(null);
   const [canvas, setCanvas] = useState(null);
   const [drawingMode, setDrawingMode] = useState(false);
   const [isSaving, setIsSaving] = useState(false);
   const navigate = useNavigate();

   // Initialize and load canvas
   useEffect(() => {
      if (!canvasId) return;

      const c = new Canvas(canvasRef.current, {
         width: 800,
         height: 600,
         backgroundColor: "#fff",
      });

      const loadCanvas = async () => {
         try {
            const docRef = doc(db, "canvases", canvasId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
               const data = docSnap.data();
               if (data?.canvasData) {
                  const parsed = JSON.parse(data.canvasData);
                  c.loadFromJSON(parsed, () => c.renderAll());
               }
            }
         } catch (err) {
            console.error("Error loading canvas:", err);
         }
      };

      loadCanvas();
      setCanvas(c);
   }, [canvasId]);

   const saveCanvas = async () => {
      setIsSaving(true);
      if (!canvas) return;
      try {
         const json = canvas.toJSON([
            "left",
            "top",
            "width",
            "height",
            "fill",
            "text",
            "radius",
            "scaleX",
            "scaleY",
            "angle",
            "path",
         ]);
         // Store as a string to avoid nested array issues
         await setDoc(doc(db, "canvases", canvasId), {
            canvasData: JSON.stringify(json),
         });
         alert("Canvas saved!");
      } catch (err) {
         console.error("Save error:", err);
      }
      setIsSaving(false);
   };

   // Add shapes/text
   const addRectangle = () => {
      if (!canvas) return;
      canvas.add(
         new Rect({ left: 50, top: 50, fill: "red", width: 100, height: 100 })
      );
   };

   const addCircle = () => {
      if (!canvas) return;
      canvas.add(new Circle({ left: 150, top: 150, fill: "blue", radius: 50 }));
   };

   const loadCanvas = () => {
      if (!canvas) return;
      canvas.add(new Circle({ left: 150, top: 150, fill: "blue", radius: 0 }));
   };

   const addText = () => {
      if (!canvas) return;
      canvas.add(
         new Textbox("Hello", {
            left: 200,
            top: 200,
            width: 150,
            fontSize: 20,
            fill: "black",
         })
      );
   };

   // Delete selected object
   const deleteSelected = () => {
      if (!canvas) return;
      const active = canvas.getActiveObject();
      if (active) canvas.remove(active);
   };

   // Toggle pen mode
   const toggleDrawing = () => {
      if (!canvas) return;

      canvas.isDrawingMode = !canvas.isDrawingMode;
      setDrawingMode(canvas.isDrawingMode);

      if (canvas.isDrawingMode) {
         canvas.freeDrawingBrush = new PencilBrush(canvas);
         canvas.freeDrawingBrush.color = "#000";
         canvas.freeDrawingBrush.width = 3;
      }
   };

   const changeColor = (color) => {
      if (!canvas) return;
      const active = canvas.getActiveObject();
      if (active) {
         active.set("fill", color);
         canvas.renderAll();
      }
   };

   return (
      <div style={{ padding: 20 }}>
         <div className="canvas-header">
            <h2>Canvas Editor</h2>
            <button onClick={loadCanvas}>Load canvas</button>
         </div>
         <div className="canvas-buttons">
            <div className="canvas-tools">
               <button onClick={addRectangle}>Add Rectangle</button>
               <button onClick={addCircle}>Add Circle</button>
               <button onClick={addText}>Add Text</button>
               <button onClick={toggleDrawing}>
                  {drawingMode ? "Disable Pen" : "Enable Pen"}
               </button>
               <button onClick={deleteSelected}>Delete Selected</button>
               <input
                  type="color"
                  onChange={(e) => changeColor(e.target.value)}
               />
            </div>
            <div className="canvas-functions">
               <button onClick={saveCanvas}>
                  {isSaving ? "Saving" : "Save"}
               </button>
               <button onClick={() => navigate("/")}>Back</button>
            </div>
         </div>
         <canvas ref={canvasRef} style={{ border: "1px solid #000" }} />
      </div>
   );
}

export default CanvasEditor;
