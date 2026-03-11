import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import styles from './NavGlobe.module.css';

export const NavGlobe = ({ size = 36 }) => {
    const canvasRef = useRef(null);
    const frameRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Renderer
        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
        });
        const dpr = Math.min(window.devicePixelRatio, 2);
        renderer.setPixelRatio(dpr);
        renderer.setSize(size, size);

        // Scene + Camera
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.z = 3;

        // Wireframe globe
        const geometry = new THREE.SphereGeometry(1, 16, 16);
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ddff,
            wireframe: true,
            transparent: true,
            opacity: 0.7,
        });
        const globe = new THREE.Mesh(geometry, material);
        scene.add(globe);

        // Equatorial ring for visual interest
        const ringGeo = new THREE.RingGeometry(1.15, 1.18, 48);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0x00ddff,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        scene.add(ring);

        // Subtle tilt for more visual appeal
        scene.rotation.x = 0.3;

        // Animation
        const animate = () => {
            globe.rotation.y -= 0.003;
            ring.rotation.z += 0.001;
            renderer.render(scene, camera);
            frameRef.current = requestAnimationFrame(animate);
        };
        frameRef.current = requestAnimationFrame(animate);

        // Cleanup
        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
            geometry.dispose();
            material.dispose();
            ringGeo.dispose();
            ringMat.dispose();
            renderer.dispose();
        };
    }, [size]);

    const handleClick = () => {
        navigate('/');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigate('/');
        }
    };

    return (
        <div
            className={styles.globeWrapper}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role="button"
            aria-label="Go to globe landing page"
            tabIndex={0}
            style={{ width: size, height: size }}
        >
            <canvas ref={canvasRef} />
        </div>
    );
};
