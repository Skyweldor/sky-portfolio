import { Container } from "react-bootstrap";
import { ArrowRightCircle } from "react-bootstrap-icons";
import "../styles/components/game-showcase.css";

export const GameShowcase = ({ gameTitle, gameTagline, gameSplash, gameDescription, gameBackground}) => {
    
    const backgroundImage = `url(${gameBackground})`;

    return (
        <section className="game-showcase" style={{backgroundImage: backgroundImage}}>
            <div className="showcase-overlay">
                <Container fluid>
                    <div className="showcase-content">
                        <div className="showcase-text-group">
                            <div className="showcase-text-panel">
                                <span className="showcase-tagline">{gameTagline}</span>
                                <h1 className="showcase-title">{gameTitle}</h1>
                                <p className="showcase-description">{gameDescription}</p>
                                <div className="showcase-button-container">
                                    <button className="showcase-button" onClick={() => console.log("Find out more pressed")}>
                                        Find out more! <ArrowRightCircle size={25} />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="showcase-image-container">
                            <div className="showcase-image-wrapper">
                                <img src={gameSplash} alt="Game Screenshot" className="showcase-image" />
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </section>
    )
}
