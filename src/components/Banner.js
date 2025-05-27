import React, { useState, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import { ArrowRightCircle } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import styles from "./Banner.module.css";

export const Banner = () => {
    /* ————————————————————————————————————————
       typing-animation logic for both texts
    —————————————————————————————————————————— */
    const [text, setText] = useState("");
    const [subText, setSubText] = useState("");
    const toRotate = ["SynthCity DigiLabs"];
    const subRotate = ["Interactive"];
    const navigate = useNavigate();

    useEffect(() => {
        let i = 0;
        let j = 0;
        
        // Type main title first
        const titleInterval = setInterval(() => {
            setText(toRotate[0].slice(0, i++));
            if (i > toRotate[0].length) {
                clearInterval(titleInterval);
                
                // Start typing subtitle after a short delay
                setTimeout(() => {
                    const subInterval = setInterval(() => {
                        setSubText(subRotate[0].slice(0, j++));
                        if (j > subRotate[0].length) clearInterval(subInterval);
                    }, 65);
                }, 200); // 200ms delay before subtitle starts
            }
        }, 65);
        
        return () => clearInterval(titleInterval);
    }, []);

    /* ————————————————————————————————————————
       HANDLERS
    —————————————————————————————————————————— */
    const goToCatalog = () => navigate("/catalog");

    return (
        <section className={styles.banner} id="home">
            <Container>
                <Row className={`${styles.bannerRow} align-items-center`}>
                    {/* group title + subtitle so alignment is relative to the text block */}
                    <div className={styles.titleGroup}>
                        <h1 className={styles.title}><span className="wrap">{text}</span></h1>
                        <h2 className={styles.interactive}><span className="wrap">{subText}</span></h2>
                    </div>

                    {/* isolate CTA in its own flex wrapper so Row doesn't stretch it */}
                    <div className={styles.ctaWrap}>
                        <button className={styles.cta} onClick={goToCatalog}>
                            Check&nbsp;Out&nbsp;Our&nbsp;Catalog! <ArrowRightCircle size={25} />
                        </button>
                    </div>
                </Row>
            </Container>
        </section>
    );
};
