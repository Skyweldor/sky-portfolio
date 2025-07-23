import { Container, Row, Col } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css"
import meter1 from "../../assets/img/meter1.svg"
import meter2 from "../../assets/img/meter2.svg"
import meter3 from "../../assets/img/meter3.svg"
import unityIcon from "../../assets/img/unity_icon_01.png"
import unrealIcon from "../../assets/img/unreal_icon_02.png"
import robloxIcon from "../../assets/img/roblox_icon_01.png"
import yearOneIcon from "../../assets/img/stickers/year_one/year_one_00_sticker_3x2.7.png"
import petsIcon from "../../assets/img/stickers/pets/ripley_sticker_00_3x2.7.png"
import welcomeToIcon from "../../assets/img/stickers/welcome_to/welcome_17_b_3x2.7.png"
import colorSharp from "../../assets/img/color-sharp.png"
import colorSharpHolo1 from "../../assets/img/color-sharp-holo-01.png";

export const StickerCollections = () => {
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
        <section className="sticker-collections" id="sticker-collections">

            {/* SVG Filter Definition */}
            <svg height="0" width="0">
                <defs>
                    <filter id="text-outline">
                        <feMorphology in="SourceAlpha" result="expanded" operator="dilate" radius="2" />
                        <feFlood flood-color="black" result="color" />
                        <feComposite in="color" in2="expanded" operator="in" />
                        <feComposite in="SourceGraphic" />
                    </filter>
                </defs>
            </svg>

            <Container>
                <Row>
                    <Col>
                        <div>
                            <h2> Sticker Collections </h2>
                            <p> New Releases Available Now! <br></br></p>
                            <Carousel responsive={responsive} infinite={true} className="sticker-slider">
                                <div className="item red-background">
                                    <img src={petsIcon} alt="Pets" />
                                    <h5>Pets Collection</h5>
                                </div>
                                <div className="item blue-background">
                                    <img src={welcomeToIcon} alt="Welcome to SynthCity" />
                                    <h5>Welcome to SynthCity Collection</h5>
                                </div>
                                <div className="item yellow-background">
                                    <img src={yearOneIcon} alt="SynthCity: Year One" />
                                    <h5>SynthCity: Year One Collection</h5>
                                </div>
                            </Carousel>
                        </div>
                    </Col>
                </Row>
            </Container>
            <img className="background-image-left-stickers" src={colorSharpHolo1} alt="Color Sharp Holo" />
        </section>
    )
}