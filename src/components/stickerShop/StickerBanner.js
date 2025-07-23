import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { ArrowRightCircle } from "react-bootstrap-icons";
import computerIcon from "../../assets/img/computer_icon_00.png";
import synthCityIcon from "../../assets/img/stickers/synthcity-icon-00.png"
import { useNavigate } from 'react-router-dom';

export const StickerBanner = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate("/stickers");
    };

    return (
        <section className="banner-stickers" id="stickers">
            <Container>
                <Row className="align-items-center">
                    <Col xs={12} md={6} xl={7}>
                        <span className="tagline">SynthCity StickerLabs</span>
                        <h1>Now Selling:</h1>
                        <p>Grab the coolest stickers here!</p>
                        <div className="center">
                            <button onClick={handleButtonClick}>Explore Stickers! <ArrowRightCircle size={25} /></button>
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <img src={synthCityIcon} alt="Sticker Img" />
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};
