import { Col, Container, Row } from "react-bootstrap";
import { Textfit } from "react-textfit";
import computerIcon from "../assets/img/computer_icon_00.png";
import { ArrowRightCircle } from "react-bootstrap-icons";

export const GameShowcase = ({ gameTitle, gameDescription, gameSplash}) => {
    
    return (
        <section className="banner">
            <Container>
                <Row className="align-items-center">
                    <Col xs={12} md={6} xl={7}>
                        <span className="tagline">{gameDescription}</span>
                                <h1>{gameTitle}</h1>
                                <p>Building tomorrow's games - today.</p>
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
