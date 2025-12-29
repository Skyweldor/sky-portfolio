import { useState, useEffect, useRef } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { NavLogo } from './NavLogo';
import styles from './NavBar.module.css';

export const NavBar = ({ isGameMode, onToggleInventory, onToggleTown, onToggleTraining, globalXP }) => {
    const [scrolled, setScrolled] = useState(false);
    const [showLogo, setShowLogo] = useState(false);
    const [shadowClass, setShadowClass] = useState("");
    const ticking = useRef(false);
    const navbarRef = useRef(null);

    useEffect(() => {
        // Scroll progress bar
        const setProgress = () => {
            const docH = document.documentElement.scrollHeight - window.innerHeight;
            const pct = (window.scrollY / docH) * 100;
            document.documentElement.style.setProperty('--scrollProgress', `${pct}%`);
        };

        // Combined scroll handler with RAF throttling
        const updateScroll = () => {
            const currentScrollY = window.scrollY;
            
            // Existing scroll behavior for class
            if (currentScrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }

            // Show logo after scrolling past hero section (~200px when title starts leaving)
            setShowLogo(currentScrollY > 200);
            
            // Dynamic shadow
            setShadowClass(currentScrollY > 0 ? styles.elevated : "");
            
            // Scroll progress
            setProgress();
            
            // Parallax effect for glass texture
            if (navbarRef.current) {
                navbarRef.current.style.backgroundPositionY = `calc(-${currentScrollY * 0.4}px)`;
            }
            
            ticking.current = false;
        };
        
        const onScroll = () => {
            if (!ticking.current) {
                window.requestAnimationFrame(updateScroll);
                ticking.current = true;
            }
        };
        
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Cursor morph effect
    useEffect(() => {
        const dot = document.createElement('div');
        dot.id = 'nav-cursor-dot';
        dot.className = styles.cursorDot;
        document.body.appendChild(dot);

        const move = (e) => {
            dot.style.transform = `translate(${e.clientX - 18}px, ${e.clientY - 18}px)`;
        };
        
        const enter = () => {
            document.body.classList.add('nav-hover');
            dot.classList.add(styles.visible);
        };
        
        const leave = () => {
            document.body.classList.remove('nav-hover');
            dot.classList.remove(styles.visible);
        };

        const navEl = document.getElementById('main-nav');
        if (navEl) {
            navEl.addEventListener('mouseenter', enter);
            navEl.addEventListener('mouseleave', leave);
            navEl.addEventListener('mousemove', move);
        }

        return () => {
            if (navEl) {
                navEl.removeEventListener('mouseenter', enter);
                navEl.removeEventListener('mouseleave', leave);
                navEl.removeEventListener('mousemove', move);
            }
            dot.remove();
        };
    }, []);
    
    const navbarClasses = [
      scrolled ? styles.navGlass : styles.navTransparent,
      isGameMode ? styles.gameNavbar : "",
      shadowClass
    ].filter(Boolean).join(" ");

    const navbarStyle = {};

    return (
        <div className={`${styles.navWrapper} position-fixed w-100`}>
            <Navbar 
                ref={navbarRef}
                expand="xl" 
                className={`navbar navbar-expand-lg navbar-dark ${navbarClasses}`} 
                style={navbarStyle}
                id="main-nav"
            >
                <Container className={styles.navContainer}>
                    {/* Left: Logo */}
                    <Navbar.Brand href="#home" className={styles.brandLeft}>
                        <NavLogo isGameMode={isGameMode} visible={showLogo} />
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="basic-navbar-nav">
                        <span className="navbar-toggler-icon"></span>
                    </Navbar.Toggle>

                    <Navbar.Collapse id="basic-navbar-nav">
                        {/* Center: Nav Links */}
                        <Nav className={styles.navCenter}>
                          {isGameMode ? (
                            <>
                              <Nav.Link onClick={onToggleInventory}>Inventory</Nav.Link>
                              <Nav.Link style={{color:'var(--color-primary)', fontWeight:'bold', opacity:'1'}} onClick={onToggleTown}>Town</Nav.Link>
                              <Nav.Link style={{color:'var(--color-primary)', fontWeight:'bold'}} onClick={onToggleTraining}>Training</Nav.Link>
                            </>
                          ) : (
                            <>
                              <Nav.Link className={styles.glowLink} href="#home">Home</Nav.Link>
                              <Nav.Link className={styles.glowLink} href="#skills">Skills</Nav.Link>
                              <Nav.Link className={styles.glowLink} href="#projects">Projects</Nav.Link>
                            </>
                          )}
                        </Nav>

                        {/* Right: CTA or Game XP */}
                        <div className={styles.navRight}>
                          {isGameMode ? (
                            <span className="navbar-text" style={{color:'var(--color-primary)', fontWeight:'bold'}}>
                              XP: {globalXP}
                            </span>
                          ) : (
                            <Link to="/catalog" className={styles.ctaButton}>
                              Downloads
                            </Link>
                          )}
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
};
