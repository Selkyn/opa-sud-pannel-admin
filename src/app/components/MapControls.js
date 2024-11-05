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
    <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 1000 }}>
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
