"use client"

import React, { useEffect, useState } from "react";
import "./BeerPourAnimation.css"; // Place the below CSS in BeerPour.css

const BeerPourAnimation = () => {
  const [fill, setFill] = useState(false);
  const [headActive, setHeadActive] = useState(false);
  const [pouring, setPouring] = useState(false);
  const [end, setEnd] = useState(false);

  useEffect(() => {
    const pourTimeout = setTimeout(() => {
      setPouring(true);
      setFill(true);
      setHeadActive(true);
      setTimeout(() => setEnd(true), 0);
    }, 1);

    return () => clearTimeout(pourTimeout);
  }, []);

  return (
    <div id="container">
      <div className="glass">
        <div className={`beer${fill ? " fill" : ""}`}></div>
      </div>
      <div className={`head${headActive ? " active" : ""}`}></div>
    </div>
  );
};

export default BeerPourAnimation;
