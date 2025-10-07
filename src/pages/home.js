import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

function Home() {
   const navigate = useNavigate();
   const [canvases, setCanvases] = useState([]);

   // Fetch all canvas documents from Firestore
   useEffect(() => {
      const fetchCanvases = async () => {
         const snapshot = await getDocs(collection(db, "canvases"));
         const canvasList = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
         }));
         setCanvases(canvasList);
      };
      fetchCanvases();
   }, []);

   // Create a new canvas
   const createCanvas = async () => {
      const docRef = await addDoc(collection(db, "canvases"), { objects: [] });
      navigate(`/canvas/${docRef.id}`);
   };

   return (
      <div style={{ padding: "20px" }}>
         <h1>Canvas Home</h1>
         <button onClick={createCanvas}>Create New Canvas</button>

         <h3>Existing Canvases</h3>
         <ul>
            {canvases.map((canvas) => (
               <li key={canvas.id}>
                  <button onClick={() => navigate(`/canvas/${canvas.id}`)}>
                     Canvas {canvas.id}
                  </button>
               </li>
            ))}
         </ul>
      </div>
   );
}

export default Home;
