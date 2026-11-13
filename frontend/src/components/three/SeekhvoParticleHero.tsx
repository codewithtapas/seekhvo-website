"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { detectDeviceCapabilities } from "@/lib/performance";

const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  uniform float uAssemble;
  uniform float uScroll;
  uniform float uPixelRatio;
  uniform vec2 uPointer;

  attribute vec3 aScatter;
  attribute vec3 aNeural;
  attribute float aPhase;
  attribute float aRingNorm;
  attribute float aSize;

  varying float vRingNorm;
  varying float vAlpha;
  varying float vScroll;

  void main() {
    float t = clamp(uAssemble, 0.0, 1.0);
    float ease = 1.0 - pow(1.0 - t, 3.0);

    vec3 mandalaPos = position;

    // Subtle organic breathing & traveling radial shimmer
    float breathe = 1.0 + 0.018 * sin(uTime * 1.2 - aRingNorm * 5.0);
    mandalaPos.xy *= breathe;
    mandalaPos.z += sin(uTime * 1.4 + aPhase * 6.2831 + aRingNorm * 4.5) * 0.08;

    // Gentle mouse proximity 3D wave
    vec2 pointerWorld = uPointer * 3.2;
    float distToMouse = length(mandalaPos.xy - pointerWorld);
    float ripple = exp(-distToMouse * 0.95) * 0.28 * ease;
    mandalaPos.z += ripple;
    mandalaPos.xy += normalize(mandalaPos.xy - pointerWorld + vec2(0.0001)) * ripple * 0.12;

    // Morph from concentric mandala into 3D neural network cluster on scroll
    float morph = smoothstep(0.08, 0.92, uScroll);
    vec3 targetPos = mix(mandalaPos, aNeural, morph);

    vec3 finalPos = mix(aScatter, targetPos, ease);

    vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float sizePulse = 0.9 + 0.16 * sin(uTime * 2.0 + aPhase * 6.2831);
    gl_PointSize = aSize * sizePulse * uPixelRatio * (20.0 / max(1.0, -mvPosition.z));

    vRingNorm = aRingNorm;
    vAlpha = (0.62 + 0.38 * aRingNorm) * (0.4 + 0.6 * ease);
    vScroll = morph;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform float uGlow;
  varying float vRingNorm;
  varying float vAlpha;
  varying float vScroll;

  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float d = length(uv);
    if (d > 0.5) discard;

    // Crisp luminous dot core + soft cyan bloom halo
    float core = smoothstep(0.24, 0.0, d);
    float halo = pow(max(0.0, 1.0 - d * 2.0), 2.1);
    float intensity = clamp(core * 1.1 + halo * 0.72, 0.0, 1.0);

    vec3 deepElectric = vec3(0.031, 0.482, 1.0);   // #087BFF
    vec3 lightBlue    = vec3(0.259, 0.647, 1.0);   // #42A5FF
    vec3 neonCyan     = vec3(0.0, 0.831, 1.0);     // #00D4FF
    vec3 brightCore   = vec3(0.78, 0.97, 1.0);

    vec3 baseCol = mix(deepElectric, lightBlue, smoothstep(0.0, 0.55, vRingNorm));
    baseCol = mix(baseCol, neonCyan, smoothstep(0.45, 1.0, vRingNorm));
    baseCol = mix(baseCol, brightCore, core * 0.58);
    baseCol = mix(baseCol, neonCyan, vScroll * 0.2);

    gl_FragColor = vec4(baseCol, intensity * vAlpha * uGlow);
  }
`;

function buildNeuralLinks(neuralPositions: Float32Array, nodeCount: number): Float32Array {
  const hubStep = Math.max(1, Math.floor(nodeCount / 110));
  const hubs: THREE.Vector3[] = [];
  for (let i = 0; i < nodeCount; i += hubStep) {
    hubs.push(new THREE.Vector3(neuralPositions[i * 3], neuralPositions[i * 3 + 1], neuralPositions[i * 3 + 2]));
  }
  const segments: number[] = [];
  for (let i = 0; i < hubs.length; i++) {
    for (let j = i + 1; j < hubs.length; j++) {
      if (hubs[i].distanceTo(hubs[j]) < 1.95) {
        segments.push(hubs[i].x, hubs[i].y, hubs[i].z, hubs[j].x, hubs[j].y, hubs[j].z);
      }
    }
  }
  return new Float32Array(segments);
}

export function SeekhvoParticleHero({
  scrollProgressRef,
}: {
  scrollProgressRef: React.MutableRefObject<number>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [use2DFallback, setUse2DFallback] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const caps = detectDeviceCapabilities();
    if (!caps.webglSupported) {
      setUse2DFallback(true);
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      setUse2DFallback(true);
      return;
    }

    const getSize = () => ({
      w: container.clientWidth || window.innerWidth,
      h: container.clientHeight || window.innerHeight,
    });

    const { w: initW, h: initH } = getSize();
    const dpr = Math.min(window.devicePixelRatio || 1, caps.tier === "high" ? 2 : 1.5);
    renderer.setPixelRatio(dpr);
    renderer.setSize(initW, initH, false);
    renderer.setClearColor(0x030b20, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, initW / initH, 0.1, 100);
    camera.position.set(0, 0, 9.8);

    // Exact concentric ring grid matching VEXEL scalloped wave mandala
    const rings = caps.tier === "high" ? 20 : caps.tier === "medium" ? 16 : 14;
    const ptsPerRing = caps.tier === "high" ? 260 : caps.tier === "medium" ? 210 : 160;
    const total = rings * ptsPerRing;

    const positions = new Float32Array(total * 3);
    const scatter = new Float32Array(total * 3);
    const neural = new Float32Array(total * 3);
    const phases = new Float32Array(total);
    const ringNorms = new Float32Array(total);
    const sizes = new Float32Array(total);

    const petals = 36;
    const innerRadius = 1.68;
    const outerRadius = 3.28;

    let idx = 0;
    for (let ringIdx = 0; ringIdx < rings; ringIdx++) {
      const ringNorm = ringIdx / Math.max(1, rings - 1);
      const baseR = THREE.MathUtils.lerp(innerRadius, outerRadius, ringNorm);
      // Alternating sinusoidal wave crest creates crisp braided concentric VEXEL lobes
      const waveAmp = 0.055 + 0.115 * Math.pow(ringNorm, 0.9);

      for (let d = 0; d < ptsPerRing; d++) {
        const theta = (d / ptsPerRing) * Math.PI * 2 + ringIdx * 0.045;
        const wave = Math.sin(theta * petals + ringIdx * 0.48) * waveAmp;
        const r = baseR + wave;
        const zDepth = (ringNorm - 0.5) * 0.45 + Math.sin(theta * petals + ringIdx * 0.3) * 0.06;

        positions[idx * 3] = Math.cos(theta) * r;
        positions[idx * 3 + 1] = Math.sin(theta) * r;
        positions[idx * 3 + 2] = zDepth;

        // Subtle initial expansion from slightly scattered 3D ring
        const scatterRadius = r * (1.28 + 0.25 * Math.sin(idx * 0.7));
        scatter[idx * 3] = Math.cos(theta + 0.35) * scatterRadius;
        scatter[idx * 3 + 1] = Math.sin(theta + 0.35) * scatterRadius;
        scatter[idx * 3 + 2] = zDepth + ((idx % 9) - 4) * 0.35;

        // Scroll-morphed 3D neural cluster
        const nPhi = Math.acos(1 - 2 * ((idx + 0.5) / total));
        const nTheta = Math.PI * (1 + Math.sqrt(5)) * idx;
        const clusterR = 1.95 + 0.85 * Math.sin(idx * 0.15);
        neural[idx * 3] = clusterR * Math.sin(nPhi) * Math.cos(nTheta);
        neural[idx * 3 + 1] = clusterR * Math.sin(nPhi) * Math.sin(nTheta);
        neural[idx * 3 + 2] = clusterR * Math.cos(nPhi);

        phases[idx] = d / ptsPerRing;
        ringNorms[idx] = ringNorm;
        sizes[idx] = 1.55 + ringNorm * 0.85 + (ringIdx === rings - 1 ? 0.35 : 0.0);
        idx++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));
    geometry.setAttribute("aNeural", new THREE.BufferAttribute(neural, 3));
    geometry.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute("aRingNorm", new THREE.BufferAttribute(ringNorms, 1));
    geometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

    const uniforms = {
      uTime: { value: 0 },
      uAssemble: { value: caps.prefersReducedMotion ? 1.0 : 0.68 },
      uScroll: { value: 0 },
      uGlow: { value: caps.prefersReducedMotion ? 1.0 : 0.75 },
      uPixelRatio: { value: dpr },
      uPointer: { value: new THREE.Vector2(0, 0) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);

    // Neural network edges revealed strictly on scroll
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(buildNeuralLinks(neural, total), 3));
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    lines.visible = false;

    const group = new THREE.Group();
    group.add(points);
    group.add(lines);
    scene.add(group);

    const pointerTarget = new THREE.Vector2(0, 0);
    const pointerSmooth = new THREE.Vector2(0, 0);
    const onPointerMove = (e: PointerEvent) => {
      pointerTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerTarget.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const handleResize = () => {
      const { w, h } = getSize();
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.position.z = w < 640 ? 13.5 : w < 1024 ? 11.0 : 9.8;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    handleResize();
    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    let rafId = 0;
    let lastTime = performance.now();
    let elapsed = 0;
    let assemble = caps.prefersReducedMotion ? 1.0 : 0.68;

    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      elapsed += dt;

      if (!caps.prefersReducedMotion) {
        assemble = Math.min(1, assemble + dt * 0.45);
        uniforms.uAssemble.value = assemble;
        uniforms.uGlow.value = THREE.MathUtils.lerp(uniforms.uGlow.value, 1.0, dt * 3.0);
        uniforms.uTime.value = elapsed;
      }

      const rawScroll = window.scrollY > 12 ? scrollProgressRef.current : 0;
      uniforms.uScroll.value = THREE.MathUtils.lerp(uniforms.uScroll.value, rawScroll, dt * 5.0);

      pointerSmooth.lerp(pointerTarget, dt * 3.8);
      uniforms.uPointer.value.copy(pointerSmooth);

      if (!caps.prefersReducedMotion) {
        group.rotation.z += dt * 0.035;
        group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, pointerSmooth.y * 0.14 + rawScroll * 0.35, dt * 3);
        group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, pointerSmooth.x * 0.16 + rawScroll * 0.45, dt * 3);
        const scaleTarget = 1.0 - rawScroll * 0.2;
        group.scale.setScalar(THREE.MathUtils.lerp(group.scale.x, scaleTarget, dt * 3.5));
        group.position.y = THREE.MathUtils.lerp(group.position.y, -rawScroll * 0.5, dt * 3.5);
      }

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointerSmooth.x * 0.32, dt * 2.5);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointerSmooth.y * 0.24, dt * 2.5);
      camera.lookAt(0, 0, 0);

      const lineAlpha = THREE.MathUtils.smoothstep(uniforms.uScroll.value, 0.16, 0.85) * 0.3;
      lineMaterial.opacity = lineAlpha;
      lines.visible = lineAlpha > 0.01;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      geometry.dispose();
      lineGeometry.dispose();
      material.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, [scrollProgressRef]);

  return (
    <div ref={containerRef} className="absolute inset-0 h-full w-full pointer-events-none">
      {use2DFallback ? (
        <Canvas2DFallback />
      ) : (
        <canvas ref={canvasRef} className="block h-full w-full" />
      )}
    </div>
  );
}

function Canvas2DFallback() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const render = (t: number) => {
      const w = (c.width = c.parentElement?.clientWidth || window.innerWidth);
      const h = (c.height = c.parentElement?.clientHeight || window.innerHeight);
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.min(w, h) * 0.4;
      const minR = maxR * 0.5;
      const time = t * 0.001;

      for (let rIdx = 0; rIdx < 16; rIdx++) {
        const rn = rIdx / 15;
        const baseR = minR + (maxR - minR) * rn;
        const dots = 180;
        for (let d = 0; d < dots; d++) {
          const theta = (d / dots) * Math.PI * 2 + time * 0.04 + rIdx * 0.045;
          const wave = Math.sin(theta * 36 + rIdx * 0.48) * (maxR * 0.025 * (0.4 + rn));
          const rad = baseR + wave;
          const x = cx + Math.cos(theta) * rad;
          const y = cy + Math.sin(theta) * rad;
          ctx.fillStyle = rn > 0.5 ? "rgba(0, 212, 255, 0.85)" : "rgba(8, 123, 255, 0.75)";
          ctx.beginPath();
          ctx.arc(x, y, 1.3 + rn * 0.9, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={ref} className="block h-full w-full" />;
}
