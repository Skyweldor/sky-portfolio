import { Col, Container, Row } from "react-bootstrap";
// Removed unused react-textfit dependency
import computerIcon from "../assets/img/computer_icon_00.png";
import { ArrowRightCircle } from "react-bootstrap-icons";
import kuromiFlyerShowcase from '../assets/img/Kuromi-Flyer-Showcase-01.png';

export const GameShowcase = ({ gameTitle, gameTagline, gameSplash, gameDescription, gameBackground}) => {
    
    const backgroundImage = `url(${gameBackground})`;

    return (
        <section className="banner" style={{backgroundImage: backgroundImage}}>
            <Container>
                <Row className="align-items-center">
                    <Col xs={12} md={6} xl={7}>
                        <span className="tagline">{gameTagline}</span>
                                <h1>{gameTitle}</h1>
                                <p>{gameDescription}</p>
                        <div className="center">
                            <button onClick={ () => console.log("Let's connect pressed")}>Let's Connect! <ArrowRightCircle size={25} /></button>
                        </div>
                    </Col>
                    <Col>
                        <div>
                            <img src={gameSplash} alt="Game Image" />
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}
