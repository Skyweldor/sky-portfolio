import { useState } from "react";
import { Container, Row, Col, Tab, Nav, TabContainer, TabContent } from "react-bootstrap";
import projImg1 from "../../assets/img/project-img1.png";
import projImg2 from "../../assets/img/project-img2.png";
import projImg3 from "../../assets/img/project-img3.png";
import colorSharp2 from "../../assets/img/color-sharp2.png";
import headerImg from "../../assets/img/header-img.svg";
import rtsIcon1 from "../../assets/img/tank_low_res_02.png";
import rtsIcon2 from "../../assets/img/tank_high_res_01.png";
import unrealVR1 from "../../assets/img/vr_opus.png";
import flyerIcon1 from "../../assets/img/flyer_icon_01.png";
import roboIcon1 from "../../assets/img/robo_icon_00.png";
import kuromiBackground from "../../assets/img/Kuromi-Flyer-Showcase-01.png"
import opusBackground from "../../assets/img/OPUS_VR_Showcase_01.png"
import scaredBackground from "../../assets/img/Sky_Is_Scared_Showcase_01.png"
import languageBackground from "../../assets/img/LanguageLink_Showcase_01.png"
import carapaceBackground from "../../assets/img/Camp_Carapace_Showcase_01.png"
import { ProjectCard } from "../common/ProjectCard";
import { Banner } from "../common/Banner";
import Popup from "../common/Popup";
import colorSharpHolo2 from "../../assets/img/color-sharp-holo-02.png";

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
            details: `Master English through interactive gameplay and immersive learning experiences. LanguageLink transforms language education into an engaging adventure where students embark on quests, solve puzzles, and interact with dynamic characters to build their vocabulary and grammar skills.

Key Features:
• Interactive dialogue system with native speaker audio
• Adaptive difficulty that adjusts to your learning pace  
• Mini-games focused on vocabulary building and pronunciation
• Progress tracking with detailed analytics and achievements
• Cultural immersion through authentic scenarios and contexts
• Multiplayer study sessions with friends and classmates`,
            backgroundImage: languageBackground,
        },
        {
            title: "Robo-Battler",
            description: "Grind for XP!",
            imgUrl: roboIcon1,
            details: `Enter the arena in this high-octane robot combat simulator where strategy meets action. Build, customize, and pilot your mechanical warrior through intense battles while climbing the ranks in tournament play.

Battle Features:
• Extensive robot customization with 100+ parts and weapons
• Real-time combat system with tactical positioning mechanics
• Career mode with championship tournaments and rival storylines  
• Online multiplayer battles with ranking and leaderboard systems
• Workshop mode for creating and sharing custom robot designs
• Dynamic damage system affecting performance and visual appearance`,
            backgroundImage: roboIcon1,
        },

    ];

    const projectsUnreal = [
        {
            title: "Kuromi Flyer",
            description: "Plane Platformer",
            imgUrl: kuromiBackground,
            details: `Soar through whimsical skies in this charming aerial adventure featuring the beloved Sanrio character. Navigate floating islands, collect magical items, and master acrobatic flight mechanics in beautifully crafted 3D environments.

Adventure Features:
• Fluid flight controls with loop-de-loops and barrel rolls
• 25+ unique levels across 5 distinct magical worlds
• Collectible system with hidden treasures and power-ups
• Time trial modes and challenge courses for skilled pilots
• Photo mode for capturing your favorite aerial moments
• Customizable plane decorations and Kuromi outfits`,
            backgroundImage: kuromiBackground,
        },
        {
            title: "Opus - VR",
            description: "Nanite + Lumen VR",
            imgUrl: opusBackground,
            details: `Experience the future of virtual reality with cutting-edge Unreal Engine 5 technology. Opus VR showcases photorealistic environments powered by Nanite virtualized geometry and Lumen dynamic global illumination, creating unprecedented visual fidelity in VR.

Technical Showcase:
• Full Nanite integration for film-quality geometric detail
• Real-time Lumen lighting with accurate reflections and shadows  
• Hand tracking and haptic feedback integration
• Spatial audio design for complete environmental immersion
• Advanced locomotion system with comfort options
• Cross-platform compatibility with all major VR headsets`,
            backgroundImage: opusBackground,
        },
        {
            title: "Camp Carapace",
            description: "Found Footage Horror",
            imgUrl: carapaceBackground,
            details: `A terrifying found footage horror experience set in an abandoned summer camp. Piece together the mystery through recovered camera equipment while avoiding the creatures that now call Camp Carapace home.

Horror Elements:
• Authentic found footage cinematography with realistic camera shake
• Environmental storytelling through scattered clues and recordings
• Dynamic creature AI that adapts to player behavior patterns
• Realistic survival mechanics including battery management
• Multiple endings based on investigation thoroughness  
• Binaural audio design for maximum psychological impact`,
            backgroundImage: carapaceBackground,
        },
    ]

    const projectsRoblox = [
        {
            title: "Sky's Scared",
            description: "a Roblox Horror Game Engine",
            imgUrl: scaredBackground,
            details: `A comprehensive horror game development framework for Roblox creators. Sky's Scared provides developers with professional-grade tools, systems, and assets to create spine-chilling experiences within the Roblox ecosystem.

Engine Components:
• Advanced lighting system with dynamic shadows and fog effects
• Modular scripting framework for custom horror mechanics
• Pre-built creature AI with customizable behavior patterns
• Sound management system with 3D spatial audio support
• Save/load system for persistent player progression
• Developer toolkit with level editor and asset management
• Extensive documentation and video tutorial series`,
            backgroundImage: scaredBackground,
        },
        {
            title: "mini-RC-Racer",
            description: "High-speed RC racing action",
            imgUrl: headerImg,
            details: `Take control of miniature remote-controlled vehicles in this fast-paced Roblox racing experience. Navigate challenging tracks, perform stunts, and compete against other players in various RC racing modes.

Racing Features:
• Multiple RC vehicle types with unique handling characteristics
• Custom track builder for creating and sharing your own courses
• Time trial and multiplayer race modes
• Stunt system with tricks and aerial maneuvers
• Vehicle customization with paint jobs and performance upgrades
• Leaderboards tracking fastest lap times and stunt scores
• Physics-based handling for realistic RC car movement`,
            backgroundImage: scaredBackground,
        },
    ]

    // ========================================
    // WEB/BROWSER PROJECTS
    // ========================================
    const projectsWeb = [
        {
            title: "VrBrowserLab",
            description: "Cross-platform VR experience",
            imgUrl: headerImg,
            details: `A cutting-edge WebXR experiment bringing VR experiences to any browser. VrBrowserLab combines desktop WASD controls with full VR headset support, featuring PS1-style retro graphics and innovative locomotion systems.

Technical Features:
• Cross-platform compatibility - desktop or VR headset
• WASD movement for desktop users
• Hand tracking and gesture controls for VR
• Teleportation and arm-swing locomotion options
• PS1-inspired low-poly aesthetic with modern effects
• Spatial audio implementation
• Built with React Three Fiber and WebXR
• No installation required - runs directly in browser`,
            backgroundImage: kuromiBackground,
        },
        {
            title: "iso-squares-game",
            description: "Turn-based isometric strategy",
            imgUrl: headerImg,
            details: `A strategic territory-building game where players take turns placing cubes on a shared isometric grid. Expand your territory by forming larger shapes to score points and dominate the board.

Gameplay Features:
• Turn-based multiplayer strategy gameplay
• Isometric 3D view with smooth camera controls
• Territory expansion mechanics - build 2×2, 3×3, and 4×4 formations
• Scoring system rewarding strategic placement
• Real-time online multiplayer
• AI opponent for solo play
• Minimalist visual design focused on clear gameplay
• Built with React, Three.js, and TypeScript`,
            backgroundImage: opusBackground,
        },
        {
            title: "AsyncHeroes-MVP",
            description: "Multiplayer resource gathering",
            imgUrl: headerImg,
            details: `A persistent 2D multiplayer game where players gather resources, construct buildings, and develop their settlement asynchronously. Progress continues even when you're offline thanks to Firebase real-time database integration.

Game Systems:
• Resource gathering mechanics - wood, stone, and food
• Building construction system with multiple structure types
• Persistent world that evolves over time
• Firebase authentication and real-time database
• Asynchronous multiplayer - see other players' progress
• Built with React, TypeScript, and Phaser game engine
• Mobile-friendly touch controls
• Cross-device progression sync`,
            backgroundImage: languageBackground,
        },
        {
            title: "Trick-or-Treat-3D",
            description: "Halloween neighborhood adventure",
            imgUrl: headerImg,
            details: `A festive 3D browser game where you navigate a spooky neighborhood collecting candy on Halloween night. Time your trick-or-treating perfectly while avoiding hazards and discovering hidden treats.

Halloween Features:
• 3D neighborhood environment to explore
• Multiple houses with unique candy rewards
• Time management mechanics - visit houses before they close
• Costume customization system
• Hidden collectibles and secret paths
• Spooky atmospheric effects and lighting
• Playable directly in browser with TypeScript
• Seasonal content and holiday theming`,
            backgroundImage: scaredBackground,
        },
    ];

    // ========================================
    // MOBILE PROJECTS
    // ========================================
    const projectsMobile = [
        {
            title: "pocket-pal",
            description: "Virtual pet for Razr outer screen",
            imgUrl: headerImg,
            details: `A unique virtual pet companion designed specifically for the Motorola Razr's outer screen (1066×1056). Care for your pixel-art "invader" avatar with a circular HUD interface optimized for the foldable's cover display.

Pet Features:
• Pixel-art virtual pet with retro charm
• Circular HUD design perfect for Razr outer screen
• Pet care mechanics - feeding, playing, and training
• Persistent data storage with DataStore
• Stats tracking and pet progression system
• Cover and inner screen responsive design
• Built with Kotlin and Jetpack Compose
• Idle animations and reactive pet behaviors
• Unique form factor optimization for foldable phones`,
            backgroundImage: carapaceBackground,
        },
    ];

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
                                    <Nav.Item>
                                        <Nav.Link eventKey="web">Web/Browser</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="mobile">Mobile</Nav.Link>
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
                                    <Tab.Pane eventKey="web">
                                        <Row>
                                            {
                                                projectsWeb.map((project, index) => {
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
                                    <Tab.Pane eventKey="mobile">
                                        <Row>
                                            {
                                                projectsMobile.map((project, index) => {
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