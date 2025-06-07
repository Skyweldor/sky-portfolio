import React, { useEffect } from "react";

const Popup = props => {
    
    useEffect(() => {
        // Prevent body scroll when popup is open
        document.body.style.overflow = 'hidden';
        
        // Handle ESC key
        const handleEscKey = (event) => {
            if (event.key === 'Escape') {
                handleClose(event);
            }
        };
        
        document.addEventListener('keydown', handleEscKey);
        
        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'auto';
            document.removeEventListener('keydown', handleEscKey);
        };
    }, []);
    
    const stopPropagation = (event) => {
        event.stopPropagation();
    };

    const handleClose = (event) => {
        event.stopPropagation();
        document.body.style.overflow = 'auto'; // Restore scroll
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