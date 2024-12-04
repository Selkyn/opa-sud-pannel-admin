"use client";

import React, { useState } from "react";

export default function ToggleSection({ title, children }) {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        setIsVisible((prev) => !prev);
    };

    return (
        <div className="mb-6">
            <button
                onClick={toggleVisibility}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mb-2"
            >
                {isVisible ? `Masquer ${title}` : `Afficher ${title}`}
            </button>
            {isVisible && <div className="mt-4">{children}</div>}
        </div>
    );
}
