import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { getSpatialGraph, type SpatialNode } from "@/src/data/spatialData";
import { resolveSpatialLabels } from "@/src/utils/spatialLabels";
import type { PortfolioData } from "@/src/data/portfolioData";

type Settings = {
  paused: boolean;
  zoom: number;
  expanded: keyof PortfolioData | null;
  onExpand: (category: keyof PortfolioData | null) => void;
  onOpen: (category: keyof PortfolioData, index: number) => void;
};
type NodeObject = { mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshPhysicalMaterial>; halo: THREE.Mesh; glow: THREE.Sprite };
type Caption = { label: HTMLButtonElement; title: HTMLElement; meta: HTMLElement; leader: HTMLElement | null; width: number; height: number; x: number; y: number; visible: boolean };

/** Own one GPU context for the lifetime of the portfolio, including section changes. */
export function createSpatialRenderer(
  host: HTMLDivElement,
  labels: Map<string, HTMLButtonElement>,
  coreLabel: HTMLDivElement | null,
  getSettings: () => Settings,
) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.domElement.className = "spatial-canvas";
  renderer.domElement.setAttribute("aria-label", "Interactive 3D portfolio. Drag to orbit, scroll to zoom, or drag a sphere to move it.");
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = .95;
  host.prepend(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, .1, 140);
  camera.position.set(0, .7, 23);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = .12;
  controls.minDistance = 4;
  controls.maxDistance = 65;
  controls.minPolarAngle = Math.PI * .18;
  controls.maxPolarAngle = Math.PI * .82;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobile = window.innerWidth < 700;
  const generator = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = generator.fromScene(room, .04);
  scene.environment = environment.texture;
  room.dispose(); generator.dispose();
  scene.add(new THREE.AmbientLight(0xaaa0dc, .5));
  const keyLight = new THREE.PointLight(0xcbbfff, 28, 35, 2); keyLight.position.set(-3, 4, 5);
  const rimLight = new THREE.PointLight(0x6be1ec, 20, 35, 2); rimLight.position.set(4, -2, 2);
  const warmLight = new THREE.PointLight(0xecb084, 18, 30, 2); warmLight.position.set(-4, -3, -2);
  scene.add(keyLight, rimLight, warmLight);

  // Billboards supply soft glow in the scene's single render pass, replacing
  // a full-screen bloom pipeline and its repeated high-resolution blur passes.
  const glowCanvas = document.createElement("canvas"); glowCanvas.width = glowCanvas.height = 64;
  const glowContext = glowCanvas.getContext("2d")!;
  const gradient = glowContext.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255,255,255,.7)"); gradient.addColorStop(.2, "rgba(255,255,255,.3)"); gradient.addColorStop(1, "rgba(255,255,255,0)");
  glowContext.fillStyle = gradient; glowContext.fillRect(0, 0, 64, 64);
  const glowTexture = new THREE.CanvasTexture(glowCanvas);
  const makeGlow = (color: THREE.ColorRepresentation, size: number, opacity: number) => {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture, color, opacity, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    sprite.scale.setScalar(size); scene.add(sprite); return sprite;
  };
  makeGlow(0x8563cf, 7, .13);
  const core = new THREE.Group();
  const sculpture = new THREE.Mesh(new THREE.TorusKnotGeometry(1.52, .34, mobile ? 128 : 180, 20, 2, 3), new THREE.MeshPhysicalMaterial({ color: 0x9982cf, metalness: .72, roughness: .19, iridescence: 1, iridescenceIOR: 1.8, iridescenceThicknessRange: [150, 650], clearcoat: 1, clearcoatRoughness: .12, envMapIntensity: .85 }));
  sculpture.rotation.set(.4, -.3, .15); core.add(sculpture);
  const crystal = new THREE.Mesh(new THREE.IcosahedronGeometry(.5, 0), new THREE.MeshPhysicalMaterial({ color: 0xdad0fa, metalness: .8, roughness: .07, clearcoat: 1, emissive: 0x473471, emissiveIntensity: .3 }));
  core.add(crystal); scene.add(core);
  const rings: THREE.Group[] = [];
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Group();
    const geometry = new THREE.BufferGeometry().setFromPoints(Array.from({ length: 121 }, (_, j) => new THREE.Vector3(Math.cos(j / 120 * Math.PI * 2) * (2.6 + i * .43), Math.sin(j / 120 * Math.PI * 2) * (2.6 + i * .43), 0)));
    ring.add(new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: i === 1 ? 0xd4af83 : 0x9d8ac9, transparent: true, opacity: .23 - i * .035 })));
    ring.rotation.set(.5 + i * .65, i * .45, .1);
    const bead = new THREE.Mesh(new THREE.SphereGeometry(.04, 8, 6), new THREE.MeshBasicMaterial({ color: i === 1 ? 0xe4b987 : 0xc3b3ff })); bead.position.x = 2.6 + i * .43;
    ring.add(bead); scene.add(ring); rings.push(ring);
  }
  const stars = new Float32Array(600 * 3);
  const seeded = (n: number) => { const f = Math.sin(n * 127.1 + 31.7) * 43758.5453; return f - Math.floor(f); };
  for (let i = 0; i < 600; i++) stars.set([(seeded(i) - .5) * 55, (seeded(i + 750) - .5) * 35, -8 - seeded(i + 1500) * 30], i * 3);
  const starGeometry = new THREE.BufferGeometry(); starGeometry.setAttribute("position", new THREE.BufferAttribute(stars, 3));
  const starMaterial = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { uTime: { value: 0 }, uPixelRatio: { value: 1 } },
    vertexShader: "uniform float uTime; uniform float uPixelRatio; varying float vAlpha; void main(){vec4 p=modelViewMatrix*vec4(position,1.0);vAlpha=.18+.38*pow(.5+.5*sin(uTime*.55+position.x*7.0+position.y*3.0),3.0);gl_PointSize=clamp(28.0/-p.z,1.0,2.8)*uPixelRatio;gl_Position=projectionMatrix*p;}",
    fragmentShader: "varying float vAlpha; void main(){float d=length(gl_PointCoord-.5);gl_FragColor=vec4(.72,.76,1.0,(1.0-smoothstep(.1,.5,d))*vAlpha);}",
  });
  scene.add(new THREE.Points(starGeometry, starMaterial));

  const objects = new Map<string, NodeObject>();
  const captions = new Map<string, Caption>();
  let graph = getSpatialGraph(null);
  let paths: { from: string; to: string; curve: THREE.CatmullRomCurve3; line: THREE.Line; pulse: THREE.Mesh }[] = [];
  const disposeObject = (object: THREE.Object3D) => {
    scene.remove(object);
    if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) object.geometry.dispose();
    if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points || object instanceof THREE.Sprite) {
      const materials = Array.isArray(object.material) ? object.material : [object.material]; materials.forEach(material => material.dispose());
    }
  };
  let width = 1, height = 1, fitDistance = 23, resolutionScale = 1;
  let cameraTransition = true, pathsDirty = true, labelsDirty = true, measureLabels = true;
  let interacting = false, destroyed = false, inView = true;
  const visibility = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; });
  visibility.observe(host);
  const target = new THREE.Vector3();
  const desiredPosition = new THREE.Vector3(0, .7, 23);
  const scratch = new THREE.Vector3();
  const fitScene = () => {
    const bounds = new THREE.Box3(new THREE.Vector3(-2.4, -2.4, -1), new THREE.Vector3(2.4, 2.4, 1));
    for (const node of graph.nodes) if (!getSettings().expanded || node.category === getSettings().expanded) bounds.expandByPoint(objects.get(node.id)!.mesh.position);
    bounds.expandByScalar(.85); bounds.getCenter(target);
    const extent = bounds.getSize(scratch);
    const tangent = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    fitDistance = Math.max(extent.y / (2 * tangent), extent.x / (2 * tangent * camera.aspect)) * 1.14;
    desiredPosition.copy(target).add(new THREE.Vector3(0, .7, fitDistance / getSettings().zoom)); cameraTransition = true;
  };
  const updateResolution = () => {
    const ratio = Math.min(window.devicePixelRatio, mobile ? 1 : 1.25, Math.sqrt(950_000 / Math.max(1, width * height))) * resolutionScale;
    renderer.setPixelRatio(ratio); renderer.setSize(width, height, false); starMaterial.uniforms.uPixelRatio.value = ratio;
    host.dataset.renderScale = ratio.toFixed(2);
  };
  const resize = new ResizeObserver(() => {
    width = host.clientWidth; height = host.clientHeight;
    camera.aspect = width / Math.max(1, height); camera.updateProjectionMatrix(); updateResolution();
    measureLabels = true; labelsDirty = true; fitScene();
  });
  resize.observe(host);
  const setGraph = (next: ReturnType<typeof getSpatialGraph>) => {
    graph = next;
    const ids = new Set(graph.nodes.map(node => node.id));
    for (const [id, object] of objects) if (!ids.has(id)) { disposeObject(object.mesh); disposeObject(object.halo); disposeObject(object.glow); objects.delete(id); }
    for (const node of graph.nodes) {
      if (objects.has(node.id)) { objects.get(node.id)!.mesh.userData.node = node; continue; }
      const hub = node.itemIndex === undefined;
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(hub ? .28 : .13, 20, 14), new THREE.MeshPhysicalMaterial({ color: node.color, metalness: .45, roughness: .22, clearcoat: 1, emissive: node.color, emissiveIntensity: .16, envMapIntensity: 1.4 }));
      mesh.position.set(...node.position); mesh.userData.node = node;
      const halo = new THREE.Mesh(new THREE.TorusGeometry(hub ? .43 : .22, .008, 4, 40), new THREE.MeshBasicMaterial({ color: node.color, transparent: true, opacity: .45 }));
      const glow = makeGlow(node.color, hub ? 1.6 : .8, hub ? .17 : .13);
      scene.add(mesh, halo); objects.set(node.id, { mesh, halo, glow });
    }
    for (const path of paths) { disposeObject(path.line); disposeObject(path.pulse); }
    paths = graph.edges.map(edge => {
      const geometry = new THREE.BufferGeometry(); geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(33 * 3), 3).setUsage(THREE.DynamicDrawUsage));
      const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: edge.color, transparent: true, opacity: edge.leaf ? .4 : .17 })); line.frustumCulled = false;
      const pulse = new THREE.Mesh(new THREE.SphereGeometry(edge.leaf ? .04 : .03, 6, 6), new THREE.MeshBasicMaterial({ color: edge.color }));
      scene.add(line, pulse);
      return { from: edge.from, to: edge.to, line, pulse, curve: new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]) };
    });
    captions.clear(); pathsDirty = true; labelsDirty = true; measureLabels = true; fitScene();
  };
  const onStart = () => { cameraTransition = false; interacting = true; };
  const onEnd = () => { interacting = false; labelsDirty = true; };
  controls.addEventListener("start", onStart); controls.addEventListener("end", onEnd);
  const raycaster = new THREE.Raycaster(); const pointer = new THREE.Vector2(); const plane = new THREE.Plane();
  const intersection = new THREE.Vector3(); const dragOffset = new THREE.Vector3();
  let dragged: NodeObject | null = null, hovered: NodeObject | null = null, moved = false;
  let downX = 0, downY = 0;
  const updateRay = (event: PointerEvent) => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1); raycaster.setFromCamera(pointer, camera);
  };
  const getHit = () => { const hit = raycaster.intersectObjects(Array.from(objects.values(), object => object.mesh))[0]; return hit ? objects.get((hit.object.userData.node as SpatialNode).id) || null : null; };
  const pointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return;
    updateRay(event); dragged = getHit(); if (!dragged) return;
    controls.enabled = false; cameraTransition = false; interacting = true; moved = false; downX = event.clientX; downY = event.clientY;
    plane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(scratch), dragged.mesh.position);
    raycaster.ray.intersectPlane(plane, intersection); dragOffset.copy(dragged.mesh.position).sub(intersection);
    renderer.domElement.setPointerCapture(event.pointerId); event.stopImmediatePropagation();
  };
  const pointerMove = (event: PointerEvent) => {
    updateRay(event);
    if (dragged) {
      moved ||= Math.hypot(event.clientX - downX, event.clientY - downY) > 5;
      if (moved && raycaster.ray.intersectPlane(plane, intersection)) { dragged.mesh.position.copy(intersection).add(dragOffset); pathsDirty = true; labelsDirty = true; }
    } else { const nextHover = getHit(); if (nextHover !== hovered) labelsDirty = true; hovered = nextHover; renderer.domElement.style.cursor = hovered ? "pointer" : "grab"; }
  };
  const pointerUp = () => {
    if (dragged && !moved) { const node = dragged.mesh.userData.node as SpatialNode; const settings = getSettings(); if (node.itemIndex === undefined) settings.onExpand(settings.expanded === node.category ? null : node.category); else settings.onOpen(node.category, node.itemIndex); }
    dragged = null; controls.enabled = true; interacting = false; labelsDirty = true;
  };
  const pointerCancel = () => { dragged = null; controls.enabled = true; interacting = false; };
  renderer.domElement.addEventListener("pointerdown", pointerDown, true); renderer.domElement.addEventListener("pointermove", pointerMove); renderer.domElement.addEventListener("pointerup", pointerUp); renderer.domElement.addEventListener("pointercancel", pointerCancel);

  let frame = 0, time = 0, previous = performance.now(), metricsStarted = 0, lastCollision = 0;
  const samples: number[] = [];
  let workTotal = 0;
  const projected = new THREE.Vector3();
  const project = (position: THREE.Vector3) => { projected.copy(position).project(camera); return { x: (projected.x + 1) * width / 2, y: (1 - projected.y) * height / 2, visible: projected.z > -1 && projected.z < 1 && Math.abs(projected.x) < .98 && Math.abs(projected.y) < .95 }; };
  const draw = (now: number) => {
    if (destroyed) return;
    frame = requestAnimationFrame(draw);
    const interval = now - previous; previous = now;
    if (document.hidden || !inView) { samples.length = 0; return; }
    const delta = Math.max(0, Math.min(interval / 1000, .05));
    const workStarted = performance.now();
    const settings = getSettings(); const animate = !settings.paused && !reducedMotion.matches;
    const needsRender = labelsDirty || pathsDirty || measureLabels;
    if (animate) time += delta;
    if (cameraTransition) {
      const easing = reducedMotion.matches ? 1 : 1 - Math.exp(-delta * 8);
      camera.position.lerp(desiredPosition, easing); controls.target.lerp(target, easing); labelsDirty = true;
      if (camera.position.distanceToSquared(desiredPosition) < .0002) cameraTransition = false;
    }
    const cameraChanged = controls.update(); labelsDirty ||= cameraChanged;
    // Read all text dimensions before any DOM writes, and only after content,
    // typography, or viewport changes. Camera motion never needs layout reads.
    if (measureLabels) {
      for (const node of graph.nodes) {
        const label = labels.get(node.id); const title = label?.querySelector<HTMLElement>(".node-label"); const meta = label?.querySelector<HTMLElement>(".node-meta");
        if (label && title && meta) captions.set(node.id, { label, title, meta, leader: label.querySelector(".label-leader"), width: Math.max(title.offsetWidth, meta.offsetWidth), height: Math.max(title.offsetHeight, 24) + (meta.textContent ? 20 : 0), x: 0, y: 0, visible: true });
      }
      measureLabels = false; labelsDirty = true;
    }
    if (labelsDirty) {
      for (const node of graph.nodes) {
        const caption = captions.get(node.id); if (!caption) continue;
        const point = project(objects.get(node.id)!.mesh.position); caption.x = point.x; caption.y = point.y; caption.visible = point.visible;
        caption.label.style.transform = `translate3d(${point.x.toFixed(2)}px,${point.y.toFixed(2)}px,0) translate(-50%,-50%)`;
        caption.label.style.visibility = point.visible ? "visible" : "hidden";
      }
      if (coreLabel) { const point = project(core.position); coreLabel.style.transform = `translate3d(${point.x}px,${point.y}px,0) translate(-50%,-50%)`; coreLabel.style.visibility = point.visible ? "visible" : "hidden"; }
      // Keep labels glued to spheres during dragging; recompute caption
      // separation at most 8 times/second, with a final pass after movement.
      if (now - lastCollision > 125 || (!interacting && !cameraTransition)) {
        const inputs = graph.nodes.flatMap(node => { const c = captions.get(node.id); return c?.visible ? [{ id: node.id, x: c.x, y: c.y + (node.itemIndex === undefined ? 40 : 15) + c.height / 2, width: c.width, height: c.height }] : []; });
        const positions = resolveSpatialLabels(inputs, { width, height });
        for (const input of inputs) {
          const caption = captions.get(input.id)!; const resolved = positions.get(input.id)!; const dx = resolved.x - input.x, dy = resolved.y - input.y;
          const transform = `translateX(-50%) translate(${dx}px,${dy}px)`;
          caption.title.style.transform = transform; caption.meta.style.transform = transform;
          if (caption.leader) { caption.leader.style.width = `${Math.hypot(dx, 15 + dy)}px`; caption.leader.style.transform = `rotate(${Math.atan2(15 + dy, dx)}rad)`; caption.leader.style.opacity = Math.abs(dx) + Math.abs(dy) > 8 ? ".3" : "0"; }
        }
        lastCollision = now;
      }
      labelsDirty = false;
    }
    if (pathsDirty) {
      for (const path of paths) {
        const start = path.from === "core" ? core.position : objects.get(path.from)!.mesh.position; const end = objects.get(path.to)!.mesh.position;
        path.curve.points[0].copy(start); path.curve.points[1].copy(start).lerp(end, .5); path.curve.points[1].z += path.from === "core" ? 1.1 : .5; path.curve.points[2].copy(end);
        const attribute = path.line.geometry.getAttribute("position") as THREE.BufferAttribute;
        for (let j = 0; j <= 32; j++) { path.curve.getPoint(j / 32, scratch); attribute.setXYZ(j, scratch.x, scratch.y, scratch.z); }
        attribute.needsUpdate = true;
      }
      pathsDirty = false;
    }
    if (animate) {
      sculpture.rotation.y = -.3 + time * .095; sculpture.rotation.z = .15 + Math.sin(time * .2) * .13;
      crystal.rotation.set(time * .12, time * -.18, .2); rings.forEach((ring, i) => { ring.rotation.z = time * .06 * (i % 2 ? -1 : 1); });
      keyLight.position.x = -3 + Math.sin(time * .3) * 2; rimLight.position.y = -2 + Math.cos(time * .25); starMaterial.uniforms.uTime.value = time;
    }
    for (const [id, object] of objects) {
      const node = object.mesh.userData.node as SpatialNode; const highlight = object === hovered || node.category === settings.expanded;
      object.mesh.material.emissiveIntensity = highlight ? .65 : .16; object.mesh.scale.setScalar(highlight ? 1.08 : 1);
      object.halo.position.copy(object.mesh.position); object.halo.quaternion.copy(camera.quaternion); object.glow.position.copy(object.mesh.position);
      if (!labels.has(id)) captions.delete(id);
    }
    for (let i = 0; i < paths.length; i++) paths[i].curve.getPoint((time * .12 + i * .137) % 1, paths[i].pulse.position);
    if (animate || cameraChanged || cameraTransition || interacting || needsRender) renderer.render(scene, camera);
    if (interval > 0 && interval < 1000) samples.push(interval);
    workTotal += performance.now() - workStarted;
    if (now - metricsStarted > 2000 && samples.length > 10) {
      const ordered = [...samples].sort((a, b) => a - b); const mean = samples.reduce((sum, value) => sum + value, 0) / samples.length;
      host.dataset.frameStats = JSON.stringify({ fps: Math.round(1000 / mean), medianMs: +ordered[Math.floor(ordered.length / 2)].toFixed(1), p95Ms: +ordered[Math.floor(ordered.length * .95)].toFixed(1), workMs: +(workTotal / samples.length).toFixed(2) });
      // Reduce only the 3D drawing resolution when frame pacing falls behind.
      // HTML text remains at full resolution, and quality stabilizes after warm-up.
      if (mean > 18 && resolutionScale > .75 && !interacting && now > 5000) { resolutionScale = Math.max(.75, resolutionScale * .9); updateResolution(); }
      metricsStarted = now; samples.length = 0; workTotal = 0;
    }
  };
  frame = requestAnimationFrame(draw);
  return {
    setGraph,
    setZoom(value: number) { if (!cameraTransition) target.copy(controls.target); scratch.copy(cameraTransition ? desiredPosition : camera.position).sub(target).normalize(); desiredPosition.copy(target).addScaledVector(scratch, Math.max(4, fitDistance / value)); cameraTransition = true; measureLabels = true; },
    reset() { for (const node of graph.nodes) objects.get(node.id)?.mesh.position.set(...node.position); pathsDirty = true; labelsDirty = true; fitScene(); },
    dispose() {
      destroyed = true; cancelAnimationFrame(frame); resize.disconnect(); visibility.disconnect(); controls.dispose();
      renderer.domElement.removeEventListener("pointerdown", pointerDown, true); renderer.domElement.removeEventListener("pointermove", pointerMove); renderer.domElement.removeEventListener("pointerup", pointerUp); renderer.domElement.removeEventListener("pointercancel", pointerCancel);
      const geometries = new Set<THREE.BufferGeometry>(); const materials = new Set<THREE.Material>();
      scene.traverse(object => { if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) geometries.add(object.geometry); if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points || object instanceof THREE.Sprite) (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material)); });
      geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose()); glowTexture.dispose(); environment.dispose(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
    },
  };
}
