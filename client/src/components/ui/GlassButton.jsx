import React from "react";
import '../../App.css'; 

const GlassButton = ({ children, onClick, href }) => {
    return (
        <div className="glass-button">
            {href ? (
                <a href={href}>
                    {children}
                </a>
            ) : (
                <button onClick={onClick}>
                    {children}
                </button>
            )}
        </div>  
    );
};

export default GlassButton;