"use client";

import React, { useState } from 'react';

function MapControls({ onAvoidMotorwaysChange }) {
  const [avoidMotorways, setAvoidMotorways] = useState(false);

  const handleChange = (event) => {
    const checked = event.target.checked;
    setAvoidMotorways(checked);
    onAvoidMotorwaysChange(checked);
  };

  return (
    <div style={{background:"white", position: 'absolute', top: '78px', left: '20px', zIndex: 1000, padding: "5px" }}>
      <label>
        <input
          type="checkbox"
          checked={avoidMotorways}
          onChange={handleChange}
        />
        Éviter les autoroutes
      </label>
    </div>
  );
}

export default MapControls;
