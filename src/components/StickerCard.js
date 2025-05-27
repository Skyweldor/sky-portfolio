import { useState, useContext } from "react";
import { Col } from "react-bootstrap";
import { Textfit } from "react-textfit";
import Popup from "./Popup";
import { GameShowcase } from "./GameShowcase";
import { CartContext } from './CartContext';

export const StickerCard = ({ title, description, imgUrl, details, backgroundImage }) => {
    const { addToCart } = useContext(CartContext); // Destructure addToCart from context

    const handleAddToCart = () => {
        const newItem = { title, imgUrl };
        addToCart(newItem); // Call addToCart with the new item
    };

    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => {
        setIsOpen(!isOpen);
        document.body.style.overflow = isOpen ? 'auto' : 'hidden';
    };

    const gameProject = [
        {
            gameTitle: title,
            gameTagline: description,
            gameSplash: imgUrl,
            gameDescription: details,
            gameBackground: backgroundImage
        },
    ];

    return (
        <Col size={12} sm={6} md={4}>
            <div className="proj-imgbx">
                <a href="#skills" onClick={togglePopup}>
                    {isOpen && <Popup
                        content={<div>{gameProject.map((project, index) => <GameShowcase key={index} {...project} />)}</div>}
                        handleClose={togglePopup}
                    />}
                    <img src={imgUrl} alt={title} />
                    <div className="proj-txtx">
                        <Textfit>
                            <h4>{title}</h4>
                            <span>{description}</span>
                        </Textfit>
                    </div>
                </a>
                <button onClick={handleAddToCart}>Add to Cart</button> {/* Add to Cart button */}
            </div>
        </Col>
    );
};
