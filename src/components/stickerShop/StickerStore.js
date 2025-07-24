import { useState, useContext } from "react";
import { Container, Row, Col, Tab, Nav, TabContainer, TabContent } from "react-bootstrap";
import Popup from "../common/Popup";
import { CartContext } from "../features/cart/CartContext"; // Context for cart state
import { StickerCard } from "./StickerCard";

// Importing 'pets' stickers
import orcaSticker from "../../assets/img/stickers/pets/02_orca_sticker_01_3x2.7.png";
import whaleSticker from "../../assets/img/stickers/pets/04_whale_sticker_01_3x2.7.png";
import harleySticker from "../../assets/img/stickers/pets/14_harley_sticker_00_3x2.7.png";
import mouseSticker from "../../assets/img/stickers/pets/mouse_sticker_01_00_3x2.7.png";
import ripleySticker from "../../assets/img/stickers/pets/ripley_sticker_00_3x2.7.png";

// Importing 'welcome_to' stickers
import welcomeSticker00 from "../../assets/img/stickers/welcome_to/welcome_00_3x2.7.png";
import welcomeSticker07 from "../../assets/img/stickers/welcome_to/welcome_07_3x2.7.png";
import welcomeSticker08 from "../../assets/img/stickers/welcome_to/welcome_08_3x2.7.png";
import welcomeSticker16 from "../../assets/img/stickers/welcome_to/welcome_16_3x2.7.png";
import welcomeSticker17 from "../../assets/img/stickers/welcome_to/welcome_17_b_3x2.7.png";

// Importing 'year_one' stickers
import yearOneSticker00 from "../../assets/img/stickers/year_one/year_one_00_sticker_3x2.7.png";
import yearOneSticker01 from "../../assets/img/stickers/year_one/year_one_01_sticker_3x2.7.png";
import yearOneSticker02 from "../../assets/img/stickers/year_one/year_one_02_sticker_3x2.7.png";
import yearOneSticker03 from "../../assets/img/stickers/year_one/year_one_03_sticker_3x2.7.png";
import yearOneSticker04 from "../../assets/img/stickers/year_one/year_one_04_sticker_3x2.7.png";


export const StickerStore = () => {

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
            
        </section>
    )
}