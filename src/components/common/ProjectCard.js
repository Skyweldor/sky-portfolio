import { useState } from "react";
import { Col } from "react-bootstrap";
// Removed react-textfit dependency
import Popup from "./Popup";
import { Banner } from "./Banner";
import { GameShowcase } from "../portfolio/GameShowcase";

export const ProjectCard = ({ title, description, imgUrl, details, backgroundImage }) => {

    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => {
        setIsOpen(!isOpen);
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
                <div style={{cursor: 'pointer'}} onClick={togglePopup}>
                    {isOpen && <Popup
                        content={
                            <div>
                                {
                                    gameProject.map((project, index) => {
                                        return (
                                            <GameShowcase
                                                key={index}
                                                {...project}
                                            />
                                        )
                                    })
                                }
                            </div>}
                        handleClose={togglePopup}
                    />}
                    <img src={imgUrl} />
                    <div className="proj-txtx">
                        <h4>{title}</h4>
                        <span>{description}</span>
                    </div>
                </div>
            </div>
        </Col>
    )
}