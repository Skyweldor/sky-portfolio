import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { ArrowRightCircle } from "react-bootstrap-icons";
import headerImg from "../assets/img/header-img.svg";
import computerIcon from "../assets/img/computer_icon_00.png";
import Popup from "./Popup";
import { Textfit } from "react-textfit";
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook

export const Banner = () => {
    const [loopNum, setLoopNum] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [text, setText] = useState('');
    const [delta, setDelta] = useState(300 - Math.random() * 100);
    const [index, setIndex] = useState(1);
    const toRotate = ["Game Developer", "Curriculum Writer", "Fortnite Enthusiast"];
    const period = 2000;

    const navigate = useNavigate(); // Initialize the useNavigate hook

    useEffect(() => {
        let ticker = setInterval(() => {
            tick();
        }, delta);

        return () => { clearInterval(ticker) };
    }, [text]);

    const tick = () => {
        let i = loopNum % toRotate.length;
        let fullText = toRotate[i];
        let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

        setText(updatedText);

        if (isDeleting) {
            setDelta(prevDelta => prevDelta / 2);
        }

        if (!isDeleting && updatedText === fullText) {
            setIsDeleting(true);
            setIndex(prevIndex => prevIndex - 1);
            setDelta(period);
        } else if (isDeleting && updatedText === '') {
            setIsDeleting(false);
            setLoopNum(loopNum + 1);
            setIndex(1);
            setDelta(100);
        } else {
            setIndex(prevIndex => prevIndex + 1);
        }
    };

    const handleButtonClick = () => {
        console.log("Navigating to stickers page...");
        navigate("/stickers"); // Navigate to the stickers page
    };

    return (
        <section className="banner" id="home">
            <Container>
                <Row className="align-items-center">
                    <Col xs={12} md={6} xl={7}>
                        <span className="tagline">SynthCity DigiLabs</span>
                        <h1>{"Hi! We're a webcoded \n"} <span className="wrap">{text}</span></h1>
                        <p>Building tomorrow's games - today.</p>
                        <div className="center">
                            <button onClick={handleButtonClick}>Grab Your Stickers! <ArrowRightCircle size={25} /></button>
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <img src={computerIcon} alt="Header Img" />
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};
