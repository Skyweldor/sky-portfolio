import { Col, Container, Row } from "react-bootstrap";
import { ArrowRightCircle } from "react-bootstrap-icons";
import "../styles/components/game-showcase.css";

export const GameShowcase = ({ gameTitle, gameTagline, gameSplash, gameDescription, gameBackground}) => {
    
    const backgroundImage = `url(${gameBackground})`;

    return (
        <section className="game-showcase" style={{backgroundImage: backgroundImage}}>
            <div className="showcase-overlay">
                <Container fluid>
                    <Row className="align-items-center min-vh-60">
                        <Col xs={12} md={6} xl={7} className="showcase-content">
                            <span className="showcase-tagline">{gameTagline}</span>
                            <h1 className="showcase-title">{gameTitle}</h1>
                            <p className="showcase-description">{gameDescription}</p>
                            <div className="showcase-button-container">
                                <button className="showcase-button" onClick={() => console.log("Let's connect pressed")}>
                                    Let's Connect! <ArrowRightCircle size={25} />
                                </button>
                            </div>
                        </Col>
                        <Col xs={12} md={6} xl={5} className="showcase-image-container">
                            <div className="showcase-image-wrapper">
                                <img src={gameSplash} alt="Game Screenshot" className="showcase-image" />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </section>
    )
}
