import React from "react";

const Popup = props => {
    
    const stopPropagation = (event) => {
        event.stopPropagation();
    };

    const handleClose = (event) => {
        event.stopPropagation();
        props.handleClose();
    };

    return (
        <div className="popup-box" onClick={stopPropagation}>
            <div className="box" onClick={stopPropagation}>
                <span className="close-icon" onClick={handleClose}>X</span>
                {props.content}
            </div>
        </div>
    );
};

export default Popup;