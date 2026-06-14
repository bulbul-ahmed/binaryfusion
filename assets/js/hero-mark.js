// =============================================================================
//  HERO 3D MARK — Rainbow Shimmer Crystal (vanilla Three.js, vendored locally)
//  Effects: idle float + pointer-parallax tilt + holographic iridescent sheen.
//  Replaces the old static-PNG mark. transform/opacity only motion.
//
//  >>> COLOR CONTROLS: edit ENV_SPOTS (the reflected rainbow) and MARK_COLOR
//      below. Everything visible derives from those + the material params.
// =============================================================================
import * as THREE from "/assets/js/vendor/three.module.js";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// --- EDIT ME: base mesh tint (white = let the env map do the coloring) -------
const MARK_COLOR = 0xffffff;

// --- EDIT ME: the reflected light sources = where the rainbow comes from ------
// [x, y, radius, css-color] on a 512x256 canvas. Change colors here to recolor.
const ENV_BASE = [[0, "#2a2f3a"], [0.5, "#171c25"], [1, "#0a0e15"]];
const ENV_SPOTS = [
  [256, 28, 86, "rgba(255,255,255,0.85)"], [54, 58, 96, "rgba(255,45,80,1)"],
  [165, 42, 88, "rgba(255,158,30,1)"],     [262, 58, 84, "rgba(255,236,80,1)"],
  [356, 46, 90, "rgba(50,230,115,1)"],     [452, 64, 98, "rgba(40,165,255,1)"],
  [486, 150, 92, "rgba(175,75,255,1)"],    [100, 170, 96, "rgba(255,80,170,1)"],
  [392, 184, 94, "rgba(50,205,255,1)"]
];

(async () => {
  const wrap = document.getElementById("hero-mark");
  if (!wrap) return;
  const canvas = wrap.querySelector("canvas");

  // ---- Logo outline = the two BF arrow paths + the outer ring ----------------
  const ARROW_PATHS = [
    "M359.8,429l-51.1,52.2c-8.2,8.4-22.4,2.6-22.4-9.1l0,0c0-3.4,1.3-6.7,3.7-9.2l37.5-38.3L280,405.4l19.8-20.2l55.3,22.4c3.2,1.3,5.9,3.6,7.3,6.7C364.6,419.4,363.5,425.2,359.8,429z",
    "M281,441.7l50.8-51.9c2.4-2.4,3.9-5.7,4-9.1c0.1-5.6-3.2-10.4-8.2-12.4l-51.3-20.8c-8.6-3.5-18,2.9-18,12.2l0,0c0,5.3,3.2,10.1,8.2,12.1l33.2,13.5l-37.5,38.3c-2.4,2.5-3.7,5.7-3.7,9.2l0,0C258.6,444.3,272.8,450.1,281,441.7z"
  ];
  const PATH_CENTER = { cx: 297.8, cy: 413.6, scale: 0.05 };

  function parsePath(d) {
    const toks = (d.match(/([MmLlHhVvCcSsZz])|(-?\d*\.?\d+(?:e[-+]?\d+)?)/gi)) || [];
    let i = 0, cx = 0, cy = 0, sx = 0, sy = 0, cmd = "";
    const pts = [], num = () => parseFloat(toks[i++]);
    while (i < toks.length) {
      const t = toks[i];
      if (/^[MmLlHhVvCcSsZz]$/.test(t)) { cmd = t; i++; }
      if (cmd === "M" || cmd === "m") { let x = num(), y = num(); if (cmd === "m") { x += cx; y += cy; } cx = x; cy = y; sx = x; sy = y; pts.push([x, y]); cmd = (cmd === "m" ? "l" : "L"); }
      else if (cmd === "L" || cmd === "l") { let x = num(), y = num(); if (cmd === "l") { x += cx; y += cy; } cx = x; cy = y; pts.push([x, y]); }
      else if (cmd === "H" || cmd === "h") { let x = num(); if (cmd === "h") x += cx; cx = x; pts.push([x, cy]); }
      else if (cmd === "V" || cmd === "v") { let y = num(); if (cmd === "v") y += cy; cy = y; pts.push([cx, y]); }
      else if (cmd === "C" || cmd === "c") { let x1 = num(), y1 = num(), x2 = num(), y2 = num(), x = num(), y = num(); if (cmd === "c") { x1 += cx; y1 += cy; x2 += cx; y2 += cy; x += cx; y += cy; } const px = cx, py = cy; for (let s = 1; s <= 16; s++) { const u = s / 16, a = 1 - u; pts.push([a*a*a*px + 3*a*a*u*x1 + 3*a*u*u*x2 + u*u*u*x, a*a*a*py + 3*a*a*u*y1 + 3*a*u*u*y2 + u*u*u*y]); } cx = x; cy = y; }
      else if (cmd === "Z" || cmd === "z") { pts.push([sx, sy]); }
      else { i++; }
    }
    return pts;
  }
  function buildShapes() {
    const { cx, cy, scale } = PATH_CENTER;
    return ARROW_PATHS.map(d => {
      const shape = new THREE.Shape();
      parsePath(d).forEach((p, idx) => {
        const X = (p[0] - cx) * scale, Y = -(p[1] - cy) * scale;
        if (idx === 0) shape.moveTo(X, Y); else shape.lineTo(X, Y);
      });
      shape.closePath();
      return shape;
    });
  }

  // ---- Environment map = what the crystal reflects (the rainbow source) ------
  function buildEnv(renderer) {
    const c = document.createElement("canvas"); c.width = 512; c.height = 256;
    const ctx = c.getContext("2d");
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    ENV_BASE.forEach(([s, col]) => g.addColorStop(s, col));
    ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 256);
    for (const [x, y, r, col] of ENV_SPOTS) {
      const rg = ctx.createRadialGradient(x, y, 0, x, y, r);
      rg.addColorStop(0, col); rg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = rg; ctx.fillRect(0, 0, 512, 256);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    const pmrem = new THREE.PMREMGenerator(renderer);
    const rt = pmrem.fromEquirectangular(tex);
    tex.dispose(); pmrem.dispose();
    return rt.texture;
  }

  function shimmerMaterial({ roughness, transmission, envMapIntensity, iridescenceIOR }) {
    return new THREE.MeshPhysicalMaterial({
      color: MARK_COLOR, metalness: 0, roughness, ior: 1.7,
      transmission, thickness: 1.2,
      clearcoat: 0.1, clearcoatRoughness: 0.1,
      iridescence: 1.0, iridescenceIOR,
      iridescenceThicknessRange: [200, 560],
      envMapIntensity, transparent: true
    });
  }

  const W = () => wrap.clientWidth || 460, H = () => wrap.clientHeight || 460;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(W(), H(), false);
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, W() / H(), 0.1, 100);
  camera.position.set(0, 0, 19.5);

  scene.environment = buildEnv(renderer);

  const pivot = new THREE.Group();
  const group = new THREE.Group();
  const extrude = { depth: 1.15, bevelEnabled: true, bevelThickness: 0.4, bevelSize: 0.36, bevelSegments: 2, steps: 1, curveSegments: 7 };

  const glassMat = shimmerMaterial({ roughness: 0.14, transmission: 0.16, envMapIntensity: 3.0, iridescenceIOR: 1.8 });
  const ringMat = shimmerMaterial({ roughness: 0.10, transmission: 0.10, envMapIntensity: 3.4, iridescenceIOR: 1.85 });

  buildShapes().forEach(sh => group.add(new THREE.Mesh(new THREE.ExtrudeGeometry(sh, extrude), glassMat)));
  group.add(new THREE.Mesh(new THREE.TorusGeometry(5.11, 0.4, 28, 180), ringMat));

  const box = new THREE.Box3().setFromObject(group);
  group.position.sub(box.getCenter(new THREE.Vector3()));
  group.scale.setScalar(0.92);
  pivot.add(group);
  scene.add(pivot);

  const key = new THREE.DirectionalLight(0xffffff, 1.1); key.position.set(5, 8, 10); scene.add(key);
  const fill = new THREE.PointLight(0xffffff, 28, 90); fill.position.set(7, -2, 7); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xeaf4ff, 0.8); rim.position.set(-7, -4, -6); scene.add(rim);
  scene.add(new THREE.AmbientLight(0xaeb8c6, 0.25));

  // ---- interaction + motion ----
  let px = 0, py = 0;
  wrap.addEventListener("pointermove", (e) => {
    const r = wrap.getBoundingClientRect();
    px = ((e.clientX - r.left) / r.width - 0.5) * 2;
    py = ((e.clientY - r.top) / r.height - 0.5) * 2;
  });
  wrap.addEventListener("pointerleave", () => { px = 0; py = 0; });

  new ResizeObserver(() => {
    renderer.setSize(W(), H(), false);
    camera.aspect = W() / H(); camera.updateProjectionMatrix();
  }).observe(wrap);

  // guaranteed first frame (so it never shows blank, even if rAF is slow)
  renderer.render(scene, camera);
  canvas.style.opacity = "1";

  if (reduceMotion) return; // static, no loop

  let t = 0;
  function tick() {
    t += 0.016;
    const tiltX = px * 0.38, tiltY = py * 0.22;
    pivot.rotation.y = Math.sin(t * 0.45) * 0.42 + tiltX;
    pivot.rotation.x = Math.sin(t * 0.38) * 0.10 + tiltY;
    pivot.position.y = Math.sin(t * 0.80) * 0.16;
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
