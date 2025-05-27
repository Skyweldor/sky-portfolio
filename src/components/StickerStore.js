import { useState, useContext } from "react";
import { Container, Row, Col, Tab, Nav, TabContainer, TabContent } from "react-bootstrap";
import projImg1 from "../assets/img/project-img1.png";
import projImg2 from "../assets/img/project-img2.png";
import projImg3 from "../assets/img/project-img3.png";
import colorSharp2 from "../assets/img/color-sharp2.png";
import headerImg from "../assets/img/header-img.svg";
import rtsIcon1 from "../assets/img/tank_low_res_02.png";
import rtsIcon2 from "../assets/img/tank_high_res_01.png";
import unrealVR1 from "../assets/img/vr_opus.png";
import flyerIcon1 from "../assets/img/flyer_icon_01.png";
import roboIcon1 from "../assets/img/robo_icon_00.png";
import kuromiBackground from "../assets/img/Kuromi-Flyer-Showcase-01.png"
import opusBackground from "../assets/img/OPUS_VR_Showcase_01.png"
import scaredBackground from "../assets/img/Sky_Is_Scared_Showcase_01.png"
import languageBackground from "../assets/img/LanguageLink_Showcase_01.png"
import carapaceBackground from "../assets/img/Camp_Carapace_Showcase_01.png"
import { ProjectCard } from "./ProjectCard";
import { Banner } from "./Banner";
import Popup from "./Popup";
import colorSharpHolo2 from "../assets/img/color-sharp-holo-02.png";
import { CartContext } from "./CartContext"; // Context for cart state
import { StickerCard } from "./StickerCard";

// Importing 'pets' stickers
import orcaSticker from "../assets/img/stickers/pets/02_orca_sticker_01_3x2.7.png";
import whaleSticker from "../assets/img/stickers/pets/04_whale_sticker_01_3x2.7.png";
import harleySticker from "../assets/img/stickers/pets/14_harley_sticker_00_3x2.7.png";
import mouseSticker from "../assets/img/stickers/pets/mouse_sticker_01_00_3x2.7.png";
import ripleySticker from "../assets/img/stickers/pets/ripley_sticker_00_3x2.7.png";

// Importing 'welcome_to' stickers
import welcomeSticker00 from "../assets/img/stickers/welcome_to/welcome_00_3x2.7.png";
import welcomeSticker07 from "../assets/img/stickers/welcome_to/welcome_07_3x2.7.png";
import welcomeSticker08 from "../assets/img/stickers/welcome_to/welcome_08_3x2.7.png";
import welcomeSticker16 from "../assets/img/stickers/welcome_to/welcome_16_3x2.7.png";
import welcomeSticker17 from "../assets/img/stickers/welcome_to/welcome_17_b_3x2.7.png";

// Importing 'year_one' stickers
import yearOneSticker00 from "../assets/img/stickers/year_one/year_one_00_sticker_3x2.7.png";
import yearOneSticker01 from "../assets/img/stickers/year_one/year_one_01_sticker_3x2.7.png";
import yearOneSticker02 from "../assets/img/stickers/year_one/year_one_02_sticker_3x2.7.png";
import yearOneSticker03 from "../assets/img/stickers/year_one/year_one_03_sticker_3x2.7.png";
import yearOneSticker04 from "../assets/img/stickers/year_one/year_one_04_sticker_3x2.7.png";


export const StickerStore = () => {

    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    //const [cart, setCart] = useContext(CartContext);

    /*const addToCart = (sticker) => {
        // Function to add sticker to cart
        // Update cart state and interact with Shopify API
    };*/

    const projectsUnity = [
        {
            title: "LanguageLink",
            description: "Teach and Study English!",
            imgUrl: languageBackground,
            details: "Find out more!",
            backgroundImage: "[insert url]",
        },
        {
            title: "Robo-Battler",
            description: "Grind for XP!",
            imgUrl: roboIcon1,
            details: "Find out more!",
            backgroundImage: "[insert URL]",
        },

    ];

    const projectsUnreal = [
        {
            title: "Kuromi Flyer",
            description: "Plane Platformer",
            imgUrl: kuromiBackground,
            details: "Find out more!",
            backgroundImage: "[insert url]",
        },
        {
            title: "Opus - VR",
            description: "Nanite + Lumen VR",
            imgUrl: opusBackground,
            details: "Find out more!",
            backgroundImage: "[insert url]",
        },
        {
            title: "Camp Carapace",
            description: "Found Footage Horror",
            imgUrl: carapaceBackground,
            details: "Find out more!",
            backgroundImage: "[insert url]",
        },
    ]

    const projectsRoblox = [
        {
            title: "Sky's Scared",
            description: "a Roblox Horror Game Engine",
            imgUrl: scaredBackground,
            details: "Find out more!",
            backgroundImage: scaredBackground,
        },
    ]

    // Define sticker arrays
    // Completing the 'petsStickers' array
    const petsStickers = [
        { title: "Orca", imgUrl: orcaSticker },
        { title: "Whale", imgUrl: whaleSticker },
        { title: "Harley", imgUrl: harleySticker },
        { title: "Ripley", imgUrl: ripleySticker },
        { title: "Mouse", imgUrl: mouseSticker },
    ];

    // Completing the 'welcomeToStickers' array
    const welcomeToStickers = [
        { title: "Welcome 00", imgUrl: welcomeSticker00 },
        { title: "Welcome 07", imgUrl: welcomeSticker07 },
        { title: "Welcome 08", imgUrl: welcomeSticker08 },
        { title: "Welcome 16", imgUrl: welcomeSticker16 },
        { title: "Welcome 17", imgUrl: welcomeSticker17 }
    ];

    // Completing the 'yearOneStickers' array
    const yearOneStickers = [
        { title: "Year One 00", imgUrl: yearOneSticker00 },
        { title: "Year One 01", imgUrl: yearOneSticker01 },
        { title: "Year One 02", imgUrl: yearOneSticker02 },
        { title: "Year One 03", imgUrl: yearOneSticker03 },
        { title: "Year One 04", imgUrl: yearOneSticker04 }
    ];


    return (
        <section className="sticker-store" id="sticker-store">
            <Container>
                <Row>
                    <Col size={12}>
                        <h2>Sticker Store</h2>
                        <Tab.Container id="sticker-tabs" defaultActiveKey="pets">
                            <Nav variant="pills" className="nav-pills mb-5 justify-content-center align-items-center">
                                <Nav.Item>
                                    <Nav.Link eventKey="pets">Pets</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="welcomeTo">Welcome To</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="yearOne">Year One</Nav.Link>
                                </Nav.Item>
                            </Nav>
                            <Tab.Content>
                                <Tab.Pane eventKey="pets">
                                    <Row>
                                        {petsStickers.map((sticker, index) => (
                                            <StickerCard key={index} {...sticker} />
                                        ))}
                                    </Row>
                                </Tab.Pane>
                                <Tab.Pane eventKey="welcomeTo">
                                    <Row>
                                        {welcomeToStickers.map((sticker, index) => (
                                            <StickerCard key={index} {...sticker} />
                                        ))}
                                    </Row>
                                </Tab.Pane>
                                <Tab.Pane eventKey="yearOne">
                                    <Row>
                                        {yearOneStickers.map((sticker, index) => (
                                            <StickerCard key={index} {...sticker} />
                                        ))}
                                    </Row>
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
                    </Col>
                </Row>
            </Container>
            <img className="background-image-right" src={colorSharpHolo2} />
        </section>
    )
}