import { useState } from "react";
import { Col } from "react-bootstrap";
import { Textfit } from "react-textfit";
import Popup from "./Popup";
import { Banner } from "./Banner";
import { GameShowcase } from "./GameShowcase";

export const ProjectCard = ({ title, description, imgUrl, details, backgroundImage }) => {

    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
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
                        content={
                            <div>
                                {
                                    gameProject.map((project) => {
                                        return (
                                            <GameShowcase
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
                        <Textfit>
                            <h4>{title}</h4>
                            <span>{description}</span>
                        </Textfit>
                    </div>
                </a>
            </div>
        </Col>
    )
}