import React, { useState, useEffect, useRef, useCallback, memo, useId } from 'react';
import { motion, animate } from 'framer-motion';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const cn = (...classes) => classes.filter(Boolean).join(' ');

// --- BGPattern Component ---
const maskClasses = {
    'fade-edges': '[mask-image:radial-gradient(ellipse_at_center,var(--background),transparent)]',
    'fade-center': '[mask-image:radial-gradient(ellipse_at_center,transparent,var(--background))]',
    'fade-top': '[mask-image:linear-gradient(to_bottom,transparent,var(--background))]',
    'fade-bottom': '[mask-image:linear-gradient(to_bottom,var(--background),transparent)]',
    'fade-left': '[mask-image:linear-gradient(to_right,transparent,var(--background))]',
    'fade-right': '[mask-image:linear-gradient(to_right,var(--background),transparent)]',
    'fade-x': '[mask-image:linear-gradient(to_right,transparent,var(--background),transparent)]',
    'fade-y': '[mask-image:linear-gradient(to_bottom,transparent,var(--background),transparent)]',
    none: '',
};

function geBgImage(variant, fill, size) {
    switch (variant) {
        case 'dots': return `radial-gradient(${fill} 1px, transparent 1px)`;
        case 'grid': return `linear-gradient(to right, ${fill} 1px, transparent 1px), linear-gradient(to bottom, ${fill} 1px, transparent 1px)`;
        case 'diagonal-stripes': return `repeating-linear-gradient(45deg, ${fill}, ${fill} 1px, transparent 1px, transparent ${size}px)`;
        case 'horizontal-lines': return `linear-gradient(to bottom, ${fill} 1px, transparent 1px)`;
        case 'vertical-lines': return `linear-gradient(to right, ${fill} 1px, transparent 1px)`;
        case 'checkerboard': return `linear-gradient(45deg, ${fill} 25%, transparent 25%), linear-gradient(-45deg, ${fill} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${fill} 75%), linear-gradient(-45deg, transparent 75%, ${fill} 75%)`;
        default: return undefined;
    }
}

const BGPattern = ({ variant = 'grid', mask = 'none', size = 24, fill = '#252525', className, style, ...props }) => {
    const bgSize = `${size}px ${size}px`;
    const backgroundImage = geBgImage(variant, fill, size);
    return (
        <div
            className={cn('absolute inset-0 z-[-10] w-full h-full', maskClasses[mask], className)}
            style={{ backgroundImage, backgroundSize: bgSize, ...style }}
            {...props}
        />
    );
};
BGPattern.displayName = 'BGPattern';

// --- ParticleTextEffect Component ---
class Particle {
    constructor() {
        this.pos = { x: 0, y: 0 };
        this.vel = { x: 0, y: 0 };
        this.acc = { x: 0, y: 0 };
        this.target = { x: 0, y: 0 };
        this.closeEnoughTarget = 100;
        this.maxSpeed = 1.0;
        this.maxForce = 0.1;
        this.particleSize = 10;
        this.isKilled = false;
        this.startColor = { r: 0, g: 0, b: 0 };
        this.targetColor = { r: 0, g: 0, b: 0 };
        this.colorWeight = 0;
        this.colorBlendRate = 0.01;
    }
    move() {
        let proximityMult = 1;
        const distance = Math.sqrt(Math.pow(this.pos.x - this.target.x, 2) + Math.pow(this.pos.y - this.target.y, 2));
        if (distance < this.closeEnoughTarget) {
            proximityMult = distance / this.closeEnoughTarget;
        }
        const towardsTarget = { x: this.target.x - this.pos.x, y: this.target.y - this.pos.y };
        const magnitude = Math.sqrt(towardsTarget.x * towardsTarget.x + towardsTarget.y * towardsTarget.y);
        if (magnitude > 0) {
            towardsTarget.x = (towardsTarget.x / magnitude) * this.maxSpeed * proximityMult;
            towardsTarget.y = (towardsTarget.y / magnitude) * this.maxSpeed * proximityMult;
        }
        const steer = { x: towardsTarget.x - this.vel.x, y: towardsTarget.y - this.vel.y };
        const steerMagnitude = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
        if (steerMagnitude > 0) {
            steer.x = (steer.x / steerMagnitude) * this.maxForce;
            steer.y = (steer.y / steerMagnitude) * this.maxForce;
        }
        this.acc.x += steer.x;
        this.acc.y += steer.y;
        this.vel.x += this.acc.x;
        this.vel.y += this.acc.y;
        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        this.acc.x = 0;
        this.acc.y = 0;
    }
    draw(ctx, drawAsPoints) {
        if (this.colorWeight < 1.0) {
            this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0);
        }
        const currentColor = {
            r: Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight),
            g: Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight),
            b: Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight),
        };
        // Glow: größerer halbtransparenter Punkt (viel schneller als shadowBlur)
        ctx.fillStyle = `rgba(${currentColor.r}, ${currentColor.g}, ${currentColor.b}, 0.15)`;
        if (drawAsPoints) {
            ctx.fillRect(this.pos.x - 3, this.pos.y - 3, 8, 8);
            // Kern: kleiner heller Punkt
            ctx.fillStyle = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;
            ctx.fillRect(this.pos.x, this.pos.y, 2, 2);
        } else {
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, this.particleSize * 0.8, 0, Math.PI * 2);
            ctx.fill();
            // Kern
            ctx.fillStyle = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, this.particleSize / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    kill(width, height) {
        if (!this.isKilled) {
            const randomPos = this.generateRandomPos(width / 2, height / 2, (width + height) / 2);
            this.target.x = randomPos.x;
            this.target.y = randomPos.y;
            this.startColor = {
                r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
                g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
                b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
            };
            this.targetColor = { r: 0, g: 0, b: 0 };
            this.colorWeight = 0;
            this.isKilled = true;
        }
    }
    generateRandomPos(x, y, mag) {
        const randomX = Math.random() * 1000;
        const randomY = Math.random() * 500;
        const direction = { x: randomX - x, y: randomY - y };
        const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
        if (magnitude > 0) {
            direction.x = (direction.x / magnitude) * mag;
            direction.y = (direction.y / magnitude) * mag;
        }
        return { x: x + direction.x, y: y + direction.y };
    }
}

const DEFAULT_WORDS = ["WELCOME", "Lern App", "Premium", "Focus", "Success"];

function ParticleTextEffect({ words = DEFAULT_WORDS }) {
    const canvasRef = useRef(null);
    const animationRef = useRef();
    const particlesRef = useRef([]);
    const frameCountRef = useRef(0);
    const wordIndexRef = useRef(0);
    const mouseRef = useRef({ x: 0, y: 0, isPressed: false, isRightClick: false });

    const pixelSteps = 6;
    const drawAsPoints = true;

    const generateRandomPos = (x, y, mag) => {
        const randomX = Math.random() * 1000;
        const randomY = Math.random() * 500;
        const direction = { x: randomX - x, y: randomY - y };
        const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
        if (magnitude > 0) {
            direction.x = (direction.x / magnitude) * mag;
            direction.y = (direction.y / magnitude) * mag;
        }
        return { x: x + direction.x, y: y + direction.y };
    };

    const nextWord = (word, canvas) => {
        const offscreenCanvas = document.createElement("canvas");
        offscreenCanvas.width = canvas.width;
        offscreenCanvas.height = canvas.height;
        const offscreenCtx = offscreenCanvas.getContext("2d");

        offscreenCtx.fillStyle = "white";
        offscreenCtx.font = "bold 100px Arial";
        offscreenCtx.textAlign = "center";
        offscreenCtx.textBaseline = "middle";
        offscreenCtx.fillText(word, canvas.width / 2, canvas.height / 2);

        const imageData = offscreenCtx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        // generate bright, colorful colors from prompt request
        const h = Math.random() * 360;
        const rgb = hslToRgb(h / 360, 1, 0.6); // Helper function below
        const newColor = { r: rgb[0], g: rgb[1], b: rgb[2] };

        const particles = particlesRef.current;
        let particleIndex = 0;

        const coordsIndexes = [];
        for (let i = 0; i < pixels.length; i += pixelSteps * 4) {
            coordsIndexes.push(i);
        }
        for (let i = coordsIndexes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [coordsIndexes[i], coordsIndexes[j]] = [coordsIndexes[j], coordsIndexes[i]];
        }

        for (const coordIndex of coordsIndexes) {
            const alpha = pixels[coordIndex + 3];
            if (alpha > 0) {
                const x = (coordIndex / 4) % canvas.width;
                const y = Math.floor(coordIndex / 4 / canvas.width);
                let particle;

                if (particleIndex < particles.length) {
                    particle = particles[particleIndex];
                    particle.isKilled = false;
                    particleIndex++;
                } else {
                    particle = new Particle();
                    const randomPos = generateRandomPos(canvas.width / 2, canvas.height / 2, (canvas.width + canvas.height) / 2);
                    particle.pos.x = randomPos.x;
                    particle.pos.y = randomPos.y;
                    particle.maxSpeed = Math.random() * 6 + 4;
                    particle.maxForce = particle.maxSpeed * 0.05;
                    particle.particleSize = Math.random() * 6 + 6;
                    particle.colorBlendRate = Math.random() * 0.0275 + 0.0025;
                    particles.push(particle);
                }

                particle.startColor = {
                    r: particle.startColor.r + (particle.targetColor.r - particle.startColor.r) * particle.colorWeight,
                    g: particle.startColor.g + (particle.targetColor.g - particle.startColor.g) * particle.colorWeight,
                    b: particle.startColor.b + (particle.targetColor.b - particle.startColor.b) * particle.colorWeight,
                };
                particle.targetColor = newColor;
                particle.colorWeight = 0;
                particle.target.x = x;
                particle.target.y = y;
            }
        }
        for (let i = particleIndex; i < particles.length; i++) {
            particles[i].kill(canvas.width, canvas.height);
        }
    };

    const animate = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const particles = particlesRef.current;

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Transparent background

        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];
            particle.move();
            particle.draw(ctx, drawAsPoints);
            if (particle.isKilled && (particle.pos.x < 0 || particle.pos.x > canvas.width || particle.pos.y < 0 || particle.pos.y > canvas.height)) {
                particles.splice(i, 1);
            }
        }
        if (mouseRef.current.isPressed && mouseRef.current.isRightClick) {
            particles.forEach((particle) => {
                const distance = Math.sqrt(Math.pow(particle.pos.x - mouseRef.current.x, 2) + Math.pow(particle.pos.y - mouseRef.current.y, 2));
                if (distance < 50) particle.kill(canvas.width, canvas.height);
            });
        }
        frameCountRef.current++;
        if (frameCountRef.current % 240 === 0) {
            wordIndexRef.current = (wordIndexRef.current + 1) % words.length;
            nextWord(words[wordIndexRef.current], canvas);
        }
        animationRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = 1000;
        canvas.height = 300;
        nextWord(words[0], canvas);
        animate();

        const handleMouseDown = (e) => {
            mouseRef.current.isPressed = true;
            mouseRef.current.isRightClick = e.button === 2;
            const rect = canvas.getBoundingClientRect();
            mouseRef.current.x = e.clientX - rect.left;
            mouseRef.current.y = e.clientY - rect.top;
        };
        const handleMouseUp = () => {
            mouseRef.current.isPressed = false;
            mouseRef.current.isRightClick = false;
        };
        const handleMouseMove = (e) => {
            const rect = canvas.getBoundingClientRect();
            mouseRef.current.x = e.clientX - rect.left;
            mouseRef.current.y = e.clientY - rect.top;
        };
        const handleContextMenu = (e) => e.preventDefault();

        canvas.addEventListener("mousedown", handleMouseDown);
        canvas.addEventListener("mouseup", handleMouseUp);
        canvas.addEventListener("mousemove", handleMouseMove);
        canvas.addEventListener("contextmenu", handleContextMenu);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            canvas.removeEventListener("mousedown", handleMouseDown);
            canvas.removeEventListener("mouseup", handleMouseUp);
            canvas.removeEventListener("mousemove", handleMouseMove);
            canvas.removeEventListener("contextmenu", handleContextMenu);
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center w-full relative z-10 pointer-events-none">
            <canvas ref={canvasRef} className="w-full h-auto max-w-[800px] pointer-events-auto" />
        </div>
    );
}

// --- ParticleFrameEffect Component ---
// Animated particle border that forms around content, disperses and reforms
function ParticleFrameEffect({ width = 700, height = 120, borderRadius = 20, thickness = 6, className = "" }) {
    const canvasRef = useRef(null);
    const animationRef = useRef();
    const particlesRef = useRef([]);
    const frameCountRef = useRef(0);
    const phaseRef = useRef(0); // 0=frame, 1=expand, 2=scatter, 3=contract

    const pixelSteps = 6;

    const generateRandomPos = (cx, cy, mag) => {
        const angle = Math.random() * Math.PI * 2;
        return { x: cx + Math.cos(angle) * mag, y: cy + Math.sin(angle) * mag };
    };

    // Draw different frame shapes on offscreen canvas
    const drawFrameShape = (canvas, phase) => {
        const offscreen = document.createElement("canvas");
        offscreen.width = canvas.width;
        offscreen.height = canvas.height;
        const ctx = offscreen.getContext("2d");

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const s = canvas.width / 800; // scale factor
        // Spacious frame — plenty of breathing room around text
        const fw = canvas.width * 0.92;
        const fh = canvas.height * 0.75;
        const t = (thickness + 1) * s;

        ctx.fillStyle = "white";

        if (phase === 0) {
            // Pill-shaped frame — super rounded
            drawPillFrame(ctx, cx - fw/2, cy - fh/2, fw, fh, fh/2, t);
        } else if (phase === 1) {
            // Breathing out — expanded ellipse with orbiting dots
            const ew = fw * 1.1;
            const eh = fh * 1.3;
            drawEllipseFrame(ctx, cx, cy, ew/2, eh/2, t * 1.2);
            // Orbiting accent dots
            const numDots = 8;
            for (let i = 0; i < numDots; i++) {
                const angle = (i / numDots) * Math.PI * 2;
                const dx = cx + Math.cos(angle) * (ew/2 + 15 * s);
                const dy = cy + Math.sin(angle) * (eh/2 + 15 * s);
                ctx.beginPath();
                ctx.arc(dx, dy, 6 * s, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (phase === 2) {
            // Double ring — inner tight, outer loose
            drawPillFrame(ctx, cx - fw*0.42, cy - fh*0.35, fw*0.84, fh*0.7, fh*0.35, t * 0.8);
            drawEllipseFrame(ctx, cx, cy, fw*0.55, fh*0.65, t * 0.7);
        } else if (phase === 3) {
            // Organic blob — wavy circle
            drawBlobFrame(ctx, cx, cy, fw * 0.48, fh * 0.55, t, 0);
        } else if (phase === 4) {
            // Scattered arcs — broken ring effect
            const numArcs = 6;
            const rx = fw * 0.5;
            const ry = fh * 0.55;
            for (let i = 0; i < numArcs; i++) {
                const startAngle = (i / numArcs) * Math.PI * 2 + 0.15;
                const endAngle = startAngle + (Math.PI * 2 / numArcs) * 0.6;
                ctx.beginPath();
                ctx.ellipse(cx, cy, rx, ry, 0, startAngle, endAngle);
                ctx.lineWidth = t * 1.5;
                ctx.strokeStyle = "white";
                ctx.stroke();
            }
        } else {
            // Squircle frame — iOS-style super-ellipse
            drawSquircleFrame(ctx, cx - fw/2, cy - fh/2, fw, fh, t);
        }

        return offscreen;
    };

    // Pill shape (stadium) — very round ends
    const drawPillFrame = (ctx, x, y, w, h, r, t) => {
        r = Math.min(r, h / 2, w / 2);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        const ir = Math.max(r - t, 0);
        const ix = x + t, iy = y + t, iw = w - t*2, ih = h - t*2;
        ctx.moveTo(ix + ir, iy);
        ctx.arcTo(ix + iw, iy, ix + iw, iy + ih, ir);
        ctx.arcTo(ix + iw, iy + ih, ix, iy + ih, ir);
        ctx.arcTo(ix, iy + ih, ix, iy, ir);
        ctx.arcTo(ix, iy, ix + iw, iy, ir);
        ctx.closePath();
        ctx.fill("evenodd");
    };

    // Ellipse frame
    const drawEllipseFrame = (ctx, cx, cy, rx, ry, t) => {
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.ellipse(cx, cy, rx - t, ry - t, 0, 0, Math.PI * 2, true);
        ctx.fill("evenodd");
    };

    // Organic blob shape
    const drawBlobFrame = (ctx, cx, cy, rx, ry, t, seed) => {
        const points = 64;
        const outerPath = [];
        const innerPath = [];
        for (let i = 0; i < points; i++) {
            const angle = (i / points) * Math.PI * 2;
            const wobble = 1 + Math.sin(angle * 3 + seed) * 0.08 + Math.cos(angle * 5 + seed * 2) * 0.05;
            const ox = cx + Math.cos(angle) * rx * wobble;
            const oy = cy + Math.sin(angle) * ry * wobble;
            outerPath.push([ox, oy]);
            const irx = (rx - t) * wobble;
            const iry = (ry - t) * wobble;
            innerPath.push([cx + Math.cos(angle) * irx, cy + Math.sin(angle) * iry]);
        }
        ctx.beginPath();
        ctx.moveTo(outerPath[0][0], outerPath[0][1]);
        for (let i = 1; i <= points; i++) {
            const p = outerPath[i % points];
            const pp = outerPath[(i - 1) % points];
            ctx.quadraticCurveTo((pp[0] + p[0]) / 2, (pp[1] + p[1]) / 2, p[0], p[1]);
        }
        ctx.closePath();
        ctx.moveTo(innerPath[0][0], innerPath[0][1]);
        for (let i = points; i >= 0; i--) {
            const p = innerPath[i % points];
            const pp = innerPath[(i + 1) % points];
            ctx.quadraticCurveTo((pp[0] + p[0]) / 2, (pp[1] + p[1]) / 2, p[0], p[1]);
        }
        ctx.closePath();
        ctx.fill("evenodd");
    };

    // iOS-style squircle
    const drawSquircleFrame = (ctx, x, y, w, h, t) => {
        const drawSuperEllipse = (sx, sy, sw, sh) => {
            const n = 4; // squircle exponent
            const steps = 200;
            ctx.moveTo(sx + sw, sy + sh / 2);
            for (let i = 0; i <= steps; i++) {
                const angle = (i / steps) * Math.PI * 2;
                const cos = Math.cos(angle);
                const sin = Math.sin(angle);
                const px = sx + sw / 2 + (sw / 2) * Math.sign(cos) * Math.pow(Math.abs(cos), 2 / n);
                const py = sy + sh / 2 + (sh / 2) * Math.sign(sin) * Math.pow(Math.abs(sin), 2 / n);
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
        };
        ctx.beginPath();
        drawSuperEllipse(x, y, w, h);
        drawSuperEllipse(x + t, y + t, w - t * 2, h - t * 2);
        ctx.fill("evenodd");
    };

    const setTargetsFromShape = (canvas, phase) => {
        const offscreen = drawFrameShape(canvas, phase);
        const offCtx = offscreen.getContext("2d");
        const imageData = offCtx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        // Diverse color palette — each phase a different vibe
        const colors = [
            { r: 56, g: 189, b: 248 },   // sky-400 (cyan)
            { r: 251, g: 146, b: 60 },   // orange-400 (warm)
            { r: 167, g: 139, b: 250 },  // violet-400
            { r: 52, g: 211, b: 153 },   // emerald-400 (fresh)
            { r: 244, g: 114, b: 182 },  // pink-400
            { r: 250, g: 204, b: 21 },   // yellow-400 (gold)
        ];
        const newColor = colors[phase % colors.length];

        const particles = particlesRef.current;
        let particleIndex = 0;

        const coordsIndexes = [];
        for (let i = 0; i < pixels.length; i += pixelSteps * 4) {
            coordsIndexes.push(i);
        }
        // Shuffle
        for (let i = coordsIndexes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [coordsIndexes[i], coordsIndexes[j]] = [coordsIndexes[j], coordsIndexes[i]];
        }

        for (const coordIndex of coordsIndexes) {
            const alpha = pixels[coordIndex + 3];
            if (alpha > 0) {
                const x = (coordIndex / 4) % canvas.width;
                const y = Math.floor(coordIndex / 4 / canvas.width);
                let particle;

                if (particleIndex < particles.length) {
                    particle = particles[particleIndex];
                    particle.isKilled = false;
                    particleIndex++;
                } else {
                    particle = new Particle();
                    const randomPos = generateRandomPos(canvas.width / 2, canvas.height / 2, (canvas.width + canvas.height) / 2);
                    particle.pos.x = randomPos.x;
                    particle.pos.y = randomPos.y;
                    particle.maxSpeed = Math.random() * 4 + 2;
                    particle.maxForce = particle.maxSpeed * 0.04;
                    particle.particleSize = Math.random() * 4 + 3;
                    particle.colorBlendRate = Math.random() * 0.02 + 0.005;
                    particles.push(particle);
                }

                particle.startColor = {
                    r: particle.startColor.r + (particle.targetColor.r - particle.startColor.r) * particle.colorWeight,
                    g: particle.startColor.g + (particle.targetColor.g - particle.startColor.g) * particle.colorWeight,
                    b: particle.startColor.b + (particle.targetColor.b - particle.startColor.b) * particle.colorWeight,
                };
                particle.targetColor = newColor;
                particle.colorWeight = 0;
                particle.target.x = x;
                particle.target.y = y;
            }
        }
        for (let i = particleIndex; i < particles.length; i++) {
            particles[i].kill(canvas.width, canvas.height);
        }
    };

    const animateFrame = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        // Pausiere Animation wenn Tab nicht sichtbar
        if (document.hidden) { animationRef.current = requestAnimationFrame(animateFrame); return; }
        const ctx = canvas.getContext("2d");
        const particles = particlesRef.current;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = particles.length - 1; i >= 0; i--) {
            const particle = particles[i];
            particle.move();
            particle.draw(ctx, true);
            if (particle.isKilled && (particle.pos.x < 0 || particle.pos.x > canvas.width || particle.pos.y < 0 || particle.pos.y > canvas.height)) {
                particles.splice(i, 1);
            }
        }

        frameCountRef.current++;
        // Switch phase every 200 frames (~3.3 seconds at 60fps)
        if (frameCountRef.current % 200 === 0) {
            phaseRef.current = (phaseRef.current + 1) % 6;
            setTargetsFromShape(canvas, phaseRef.current);
        }
        animationRef.current = requestAnimationFrame(animateFrame);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const container = canvas.parentElement;
        const rect = container.getBoundingClientRect();
        canvas.width = Math.round(rect.width * 2);
        canvas.height = Math.round(rect.height * 2);
        setTargetsFromShape(canvas, 0);
        animateFrame();

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, []);

    return (
        <div className={`absolute inset-0 pointer-events-none ${className}`}>
            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    );
}

// HSL to RGB helper
function hslToRgb(h, s, l) {
    let r, g, b;
    if (s === 0) r = g = b = l; 
    else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// --- GlowingEffect Component ---
const GlowingEffect = memo(({
    blur = 0, inactiveZone = 0.7, proximity = 0, spread = 20, variant = "default",
    glow = false, className, movementDuration = 2, borderWidth = 1, disabled = true,
}) => {
    const containerRef = useRef(null);
    const lastPosition = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef(0);

    const handleMove = useCallback((e) => {
        if (!containerRef.current) return;
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

        animationFrameRef.current = requestAnimationFrame(() => {
            const element = containerRef.current;
            if (!element) return;
            const { left, top, width, height } = element.getBoundingClientRect();
            const mouseX = e?.x ?? lastPosition.current.x;
            const mouseY = e?.y ?? lastPosition.current.y;
            if (e) lastPosition.current = { x: mouseX, y: mouseY };

            const center = [left + width * 0.5, top + height * 0.5];
            const distanceFromCenter = Math.hypot(mouseX - center[0], mouseY - center[1]);
            const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone;

            if (distanceFromCenter < inactiveRadius) {
                element.style.setProperty("--active", "0");
                return;
            }

            const isActive = mouseX > left - proximity && mouseX < left + width + proximity && mouseY > top - proximity && mouseY < top + height + proximity;
            element.style.setProperty("--active", isActive ? "1" : "0");
            if (!isActive) return;

            const currentAngle = parseFloat(element.style.getPropertyValue("--start")) || 0;
            let targetAngle = (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) / Math.PI + 90;
            const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
            const newAngle = currentAngle + angleDiff;

            // Simple transition fallback if motion is missing, else use motion wrapper simply:
            if (animate) {
                animate(currentAngle, newAngle, {
                    duration: movementDuration, ease: [0.16, 1, 0.3, 1],
                    onUpdate: (val) => element.style.setProperty("--start", String(val))
                });
            } else {
                element.style.setProperty("--start", String(newAngle));
            }
        });
    }, [inactiveZone, proximity, movementDuration]);

    useEffect(() => {
        if (disabled) return;
        const handleScroll = () => handleMove();
        const handlePointerMove = (e) => handleMove(e);
        window.addEventListener("scroll", handleScroll, { passive: true });
        document.body.addEventListener("pointermove", handlePointerMove, { passive: true });
        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            window.removeEventListener("scroll", handleScroll);
            document.body.removeEventListener("pointermove", handlePointerMove);
        };
    }, [handleMove, disabled]);

    return (
        <React.Fragment>
            <div className={cn("pointer-events-none absolute -inset-px hidden rounded-[inherit] border opacity-0 transition-opacity z-0", glow && "opacity-100", variant === "white" && "border-white", disabled && "!block")} />
            <div
                ref={containerRef}
                style={{
                    "--blur": `${blur}px`, "--spread": spread, "--start": "0", "--active": "0", "--glowingeffect-border-width": `${borderWidth}px`, "--repeating-conic-gradient-times": "5",
                    "--gradient": variant === "white" ? `repeating-conic-gradient(from 236.84deg at 50% 50%, var(--black), var(--black) calc(25% / var(--repeating-conic-gradient-times)))` : `radial-gradient(circle, #dd7bbb 10%, #dd7bbb00 20%), radial-gradient(circle at 40% 40%, #d79f1e 5%, #d79f1e00 15%), radial-gradient(circle at 60% 60%, #5a922c 10%, #5a922c00 20%), radial-gradient(circle at 40% 60%, #4c7894 10%, #4c789400 20%), repeating-conic-gradient(from 236.84deg at 50% 50%, #dd7bbb 0%, #d79f1e calc(25% / var(--repeating-conic-gradient-times)), #5a922c calc(50% / var(--repeating-conic-gradient-times)), #4c7894 calc(75% / var(--repeating-conic-gradient-times)), #dd7bbb calc(100% / var(--repeating-conic-gradient-times)))`,
                }}
                className={cn("pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 transition-opacity z-0", glow && "opacity-100", blur > 0 && "blur-[var(--blur)] ", className, disabled && "!hidden")}
            >
                <div className={cn("glow", "rounded-[inherit]", 'after:content-[""] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))]', "after:[border:var(--glowingeffect-border-width)_solid_transparent]", "after:[background:var(--gradient)] after:[background-attachment:fixed]", "after:opacity-[var(--active)] after:transition-opacity after:duration-300", "after:[mask-clip:padding-box,border-box]", "after:[mask-composite:intersect]", "after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]")} />
            </div>
        </React.Fragment>
    );
});
GlowingEffect.displayName = "GlowingEffect";

// --- SparklesCore Component ---
const SparklesCore = ({ id, className, background, minSize, maxSize, speed, particleColor, particleDensity }) => {
    const [init, setInit] = useState(false);
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => setInit(true));
    }, []);
    const Controls = motion.div;
    const generatedId = useId();

    return (
        <Controls initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className={cn("opacity-100", className)}>
            {init && (
                <Particles
                    id={id || generatedId}
                    className={cn("h-full w-full")}
                    options={{
                        background: { color: { value: background || "#0d47a1" } },
                        fullScreen: { enable: false, zIndex: 1 },
                        fpsLimit: 120,
                        particles: {
                            color: { value: particleColor || "#ffffff" },
                            move: { enable: true, speed: { min: 0.1, max: 1 } },
                            number: { density: { enable: true, width: 400, height: 400 }, value: particleDensity || 120 },
                            opacity: { value: { min: 0.1, max: 1 }, animation: { enable: true, speed: speed || 4 } },
                            shape: { type: "circle" },
                            size: { value: { min: minSize || 1, max: maxSize || 3 } },
                        },
                        detectRetina: true,
                    }}
                />
            )}
        </Controls>
    );
};

export { BGPattern, ParticleTextEffect, ParticleFrameEffect, GlowingEffect, SparklesCore };
