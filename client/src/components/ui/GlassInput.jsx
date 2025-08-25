import React from "react";
import '../../App';

const GlassInput = ({ ...prompt }) => {
    return (
        <input
            className="glass-input"
            {...prompt}
        />
    );
};

export default GlassInput;