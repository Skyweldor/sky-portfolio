import { useState } from "react";
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

export const Projects = () => {

    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    const projectsUnity = [
        {
            title: "LanguageLink",
            description: "Teach and Study English!",
            imgUrl: languageBackground,
            details: "Find out more!",
            backgroundImage: languageBackground,
        },
        {
            title: "Robo-Battler",
            description: "Grind for XP!",
            imgUrl: roboIcon1,
            details: "Find out more!",
            backgroundImage: roboIcon1,
        },

    ];

    const projectsUnreal = [
        {
            title: "Kuromi Flyer",
            description: "Plane Platformer",
            imgUrl: kuromiBackground,
            details: "Find out more!",
            backgroundImage: kuromiBackground,
        },
        {
            title: "Opus - VR",
            description: "Nanite + Lumen VR",
            imgUrl: opusBackground,
            details: "Find out more!",
            backgroundImage: opusBackground,
        },
        {
            title: "Camp Carapace",
            description: "Found Footage Horror",
            imgUrl: carapaceBackground,
            details: "Find out more!",
            backgroundImage: carapaceBackground,
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

    return (
        <section className="project" id="projects">
            <Container>
                <Row>
                    <Col size={12}>
                        <div>
                            <h2>Projects</h2>
                            <p>Example Text for Projects Section</p>
                            <Tab.Container id="projects-tabs" defaultActiveKey="second">
                                <Nav variant="pills" className="nav-pills mb-5 justify-content-center align-items-center" id="pills-tab">
                                    <Nav.Item>
                                        <Nav.Link eventKey="first">Unity</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="second">Unreal Engine</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="third">Roblox</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                                <Tab.Content>
                                    <Tab.Pane eventKey="first">
                                        <Row>
                                            {
                                                projectsUnity.map((project, index) => {
                                                    return (
                                                        <ProjectCard
                                                            key={index}
                                                            {...project}
                                                        />
                                                    )
                                                })
                                            }
                                        </Row>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="second">
                                        <Row>
                                            {
                                                projectsUnreal.map((project, index) => {
                                                    return (
                                                        <ProjectCard
                                                            key={index}
                                                            {...project}
                                                        />
                                                    )
                                                })
                                            }
                                        </Row>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="third">
                                        <Row>
                                            {
                                                projectsRoblox.map((project, index) => {
                                                    return (
                                                        <ProjectCard
                                                            key={index}
                                                            {...project}
                                                        />
                                                    )
                                                })
                                            }
                                        </Row>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Tab.Container>
                        </div>
                    </Col>
                </Row>
            </Container>
            <img className="background-image-right" src={colorSharpHolo2} />
        </section>
    )
}