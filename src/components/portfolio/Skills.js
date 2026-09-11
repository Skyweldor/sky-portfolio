import { Container, Row, Col } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css"
import unityIcon from "../../assets/img/unity_icon_01.png"
import unrealIcon from "../../assets/img/unreal_icon_02.png"
import robloxIcon from "../../assets/img/roblox_icon_01.png"
import colorSharpHolo1 from "../../assets/img/color-sharp-holo-01.png";

export const Skills = () => {
    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };

    return (
        <section className="skill" id="skills">
            <Container>
                <Row>
                    <Col>
                        <div>
                            <h2> Game Development </h2>
                            <p> Explore projects built with: <br></br> Unity, Unreal Engine, and Roblox Studio </p>
                            <Carousel responsive={responsive} infinite={true} className="skill-slider">
                                <div className="item">
                                    <img src={unityIcon} alt="Unity logo" />
                                    <h5>Unity</h5>
                                </div>
                                <div className="item">
                                    <img src={unrealIcon} alt="Unreal Engine logo" />
                                    <h5>Unreal</h5>
                                </div>
                                <div className="item">
                                    <img src={robloxIcon} alt="Roblox logo" />
                                    <h5>Roblox</h5>
                                </div>
                            </Carousel>
                        </div>
                    </Col>
                </Row>
            </Container>
            <img className="background-image-left" src={colorSharpHolo1} alt="" />
        </section>
    )
}