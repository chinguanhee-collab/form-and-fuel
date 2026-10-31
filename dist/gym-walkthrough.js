import * as THREE from './vendor/three.module.min.js';

// The camera follows document scroll. No wheel interception or timed playback.
const backdrop = document.querySelector('.motion-backdrop');
const toggle = document.querySelector('#gymMotionToggle');
const progressBar = document.querySelector('#gymScrollProgress');
const stageLabel = document.querySelector('#gymStage');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: devicePixelRatio < 2, alpha: false, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.setClearColor(0x0b0d10);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  backdrop.append(renderer.domElement);
  const shade = document.createElement('div'); shade.className = 'gym-shade'; backdrop.append(shade);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x101217, 12, 37);
  const camera = new THREE.PerspectiveCamera(62, 1, .06, 60);
  const material = (color, metalness = 0, roughness = .6) => new THREE.MeshStandardMaterial({ color, metalness, roughness });
  const charcoal = material(0x262b31, .65, .32), steel = material(0xb1b8c0, .8, .25);
  const rubber = material(0x15181d, .05, .9), upholstery = material(0x882039, .12, .48);
  const wall = material(0x22272e, .15, .82), floor = material(0x20252a, .2, .65), grout = material(0x343940);
  const glow = new THREE.MeshBasicMaterial({ color: 0xf33e59 });
  const whiteGlow = new THREE.MeshBasicMaterial({ color: 0xe6edee });
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const sphereGeometry = new THREE.SphereGeometry(1, 16, 12);
  function box(parent, x, y, z, w, h, d, mat = charcoal) {
    const m = new THREE.Mesh(boxGeometry, mat); m.position.set(x, y, z); m.scale.set(w, h, d); parent.add(m); return m;
  }
  function sphere(parent, x, y, z, sx, sy, sz, mat) {
    const m = new THREE.Mesh(sphereGeometry, mat); m.position.set(x, y, z); m.scale.set(sx, sy, sz); parent.add(m); return m;
  }
  function rod(parent, a, b, radius = .035, mat = steel, r2 = radius) {
    const start = new THREE.Vector3(...a), end = new THREE.Vector3(...b), delta = end.clone().sub(start);
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r2, radius, delta.length(), 12), mat);
    mesh.position.copy(start.add(end).multiplyScalar(.5)); mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.normalize()); parent.add(mesh); return mesh;
  }
  function group(x, z, rotation = 0) { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rotation; scene.add(g); return g; }
  function plate(parent, x, y, z, radius = .24, thick = .1) {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, thick, 24), rubber); p.rotation.z = Math.PI / 2; p.position.set(x, y, z); parent.add(p);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius * .85, .011, 6, 24), upholstery); ring.rotation.y = Math.PI / 2; ring.position.set(x + thick / 2 + .002, y, z); parent.add(ring);
    rod(parent, [x - thick / 2 - .015, y, z], [x + thick / 2 + .015, y, z], .04, steel);
  }
  function dumbbell(parent, x, y, z, size = 1) {
    rod(parent, [x - .22 * size, y, z], [x + .22 * size, y, z], .026 * size);
    plate(parent, x - .17 * size, y, z, .11 * size, .1 * size); plate(parent, x + .17 * size, y, z, .11 * size, .1 * size);
  }
  function bench(x, z, rotation = 0) {
    const g = group(x, z, rotation); box(g, 0, .51, 0, .5, .13, 1.5, upholstery);
    for (const zz of [-.5, .5]) { rod(g, [0, .45, zz], [0, .08, zz], .055, charcoal); box(g, 0, .05, zz, .8, .1, .12); }
    rod(g, [0, .23, -.5], [0, .23, .5], .05, charcoal); return g;
  }
  function treadmill(x, z) {
    const g = group(x, z, Math.PI); box(g, 0, .15, 0, 1.05, .22, 2.1); box(g, 0, .275, 0, .79, .04, 1.85, rubber);
    for (let i = 0; i < 26; i++) box(g, 0, .297, -.85 + i * .066, .77, .004, .008, wall);
    for (const s of [-1, 1]) { rod(g, [s * .48, .2, -.7], [s * .48, 1.35, -.95], .045); rod(g, [s * .48, 1.15, -.85], [s * .48, 1.15, -.2], .035, rubber); box(g, s * .49, .3, .05, .04, .02, 1.8, upholstery); }
    const console = box(g, 0, 1.4, -.93, .93, .13, .42); console.rotation.x = -.25;
    box(g, 0, 1.478, -.96, .45, .013, .2, material(0x225668, .3, .3));
  }
  function rack(x, z) {
    const g = group(x, z); for (const xx of [-.8, .8]) for (const zz of [-.7, .7]) { box(g, xx, 1.23, zz, .1, 2.46, .1); box(g, xx, .06, zz, .5, .12, .5); }
    for (const xx of [-.8, .8]) { box(g, xx, 2.45, 0, .1, .1, 1.5); box(g, xx, .67, 0, .08, .1, 1.5); }
    rod(g, [-.8, 2.35, .7], [.8, 2.35, .7], .035);
    rod(g, [-1.25, 1.42, .1], [1.25, 1.42, .1], .03);
    for (const s of [-1, 1]) { plate(g, s * .96, 1.42, .1, .31); plate(g, s * 1.08, 1.42, .1, .25); for (let i = 0; i < 8; i++) box(g, s * .8, .8 + i * .17, .758, .025, .025, .004, steel); }
    bench(x, z + .2);
  }
  function cableStation(x, z) {
    const g = group(x, z, -.12); for (const xx of [-.9, .9]) { box(g, xx, 1.28, 0, .16, 2.56, .6); box(g, xx, .04, .1, .7, .08, 1.2); for (let i = 0; i < 12; i++) box(g, xx, .15 + .07 * i, .12, .45, .055, .35, rubber); rod(g, [xx, .1, .33], [xx, 2.4, .33], .014); rod(g, [xx, 2.37, .38], [xx * .55, 1.35, .65], .006, rubber); rod(g, [xx * .55 - .1, 1.35, .65], [xx * .55 + .1, 1.35, .65], .025, rubber); }
    box(g, 0, 2.48, 0, 2, .14, .3); box(g, 0, 2.49, .155, 1.7, .025, .012, glow);
  }
  function weightRack(x, z) {
    const g = group(x, z, Math.PI / 2); for (const y of [.48, .94]) { box(g, 0, y, 0, 2.8, .08, .48); for (let i = 0; i < 5; i++) dumbbell(g, -1.08 + i * .54, y + .17, 0, .9 + i * .04); }
    for (const xx of [-1.2, 1.2]) { box(g, xx, .48, 0, .08, .96, .1); box(g, xx, .04, 0, .15, .08, .9); }
  }

  scene.add(new THREE.HemisphereLight(0xc9dcf0, 0x44404a, 2.8));
  const key = new THREE.DirectionalLight(0xf2e4dc, 3); key.position.set(-3, 6, 2); scene.add(key);
  const rim = new THREE.DirectionalLight(0xff4057, 1.4); rim.position.set(4, 3, -14); scene.add(rim);
  // Architecture: an unobstructed aisle, automatic entrance and rear mirror.
  box(scene, 0, -.11, -7, 10, .2, 28, floor);
  box(scene, -5, 1.8, -8, .18, 3.6, 21, wall); box(scene, 5, 1.8, -8, .18, 3.6, 21, wall);
  box(scene, 0, 3.65, -8, 10, .1, 21, material(0x171c23, .4));
  for (let z = 3; z > -19; z -= 1.25) box(scene, 0, .002, z, 10, .002, .012, grout);
  for (let x = -5; x <= 5; x += 1.25) box(scene, x, .003, -8, .012, .003, 22, grout);
  for (let z = -.6; z > -17; z -= 3) { box(scene, 0, 3.5, z, 7.9, .07, .12); box(scene, 0, 3.45, z, 6.5, .012, .07, whiteGlow); }
  for (const x of [-4.85, 4.85]) box(scene, x, .15, -8, .03, .035, 19, glow);
  // Warm red strips lead the eye down the aisle without covering text.
  for (const x of [-1.35, 1.35]) box(scene, x, .008, -8, .025, .005, 18, upholstery);
  treadmill(-3.1, -2); treadmill(-3.1, -4.8); cableStation(3.35, -3.5);
  rack(-3.3, -8.2); weightRack(3.5, -8.7); bench(2.8, -11.1, .28);
  cableStation(-3.4, -13); weightRack(3.5, -14.1);
  for (const x of [-4.7, 4.7]) for (let z = -2; z > -16; z -= 4) box(scene, x, 1.7, z, .13, 2.5, .08, charcoal);
  box(scene, 0, 1.8, -18, 10, 3.6, .18, wall);
  const mirrorZ = -17.88;
  box(scene, 0, 1.6, mirrorZ - .09, 4.8, 3.12, .08, charcoal);
  for (const x of [-2.39, 2.39]) box(scene, x, 1.6, mirrorZ + .03, .025, 3.1, .025, whiteGlow);
  box(scene, 0, 3.16, mirrorZ + .03, 4.8, .025, .025, glow);
  box(scene, 0, 3.1, 0, 6.2, .5, .3); box(scene, 0, 2.84, .1, 6, .035, .05, glow);
  for (const x of [-3.05, 3.05]) box(scene, x, 1.4, 0, .14, 2.8, .22, steel);
  const glass = new THREE.MeshStandardMaterial({ color: 0x74909d, transparent: true, opacity: .2, metalness: .7, roughness: .15, side: THREE.DoubleSide, depthWrite: false });
  const doors = [-1, 1].map(side => {
    const g = group(side * 1.5, .05); box(g, 0, 1.39, 0, 2.96, 2.72, .045, glass);
    for (const x of [-1.48, 1.48]) box(g, x, 1.4, 0, .04, 2.8, .075, steel);
    for (const y of [.025, 2.78]) box(g, 0, y, 0, 3, .04, .075, steel);
    box(g, 0, 1.12, .04, 2.9, .025, .005, whiteGlow);
    box(g, -side * 1.28, 1.4, .08, .025, .52, .04, steel);
    return g;
  });
  // A fitted, proportionate character exists only in the mirror's render layer.
  const athlete = new THREE.Group(); scene.add(athlete);
  const skin = material(0xb8795a, .05, .65), shirt = material(0x9c2540, .05, .7), shorts = material(0x1b2029, .05, .85);
  sphere(athlete, 0, 1.24, 0, .25, .31, .14, shirt);
  sphere(athlete, 0, 1.43, 0, .29, .15, .145, shirt);
  sphere(athlete, 0, .96, 0, .22, .16, .14, shorts);
  rod(athlete, [0, 1.5, 0], [0, 1.63, 0], .065, skin);
  sphere(athlete, 0, 1.72, 0, .105, .14, .1, skin);
  sphere(athlete, 0, 1.81, .008, .105, .06, .099, material(0x1b1413));
  for (const s of [-1, 1]) { sphere(athlete, s * .106, 1.71, 0, .018, .032, .02, skin); sphere(athlete, s * .037, 1.747, -.091, .014, .009, .007, rubber); }
  sphere(athlete, 0, 1.715, -.102, .018, .024, .023, skin);
  box(athlete, 0, 1.672, -.091, .042, .008, .006, material(0x704334));
  const arms = [], legs = [];
  for (const s of [-1, 1]) {
    const upper = new THREE.Group(); upper.position.set(s * .255, 1.43, 0); athlete.add(upper);
    sphere(upper, 0, -.025, 0, .09, .1, .095, shirt);
    rod(upper, [0, -.03, 0], [0, -.28, 0], .055, skin, .072); sphere(upper, 0, -.28, 0, .055, .055, .055, skin);
    const fore = new THREE.Group(); fore.position.y = -.28; upper.add(fore);
    rod(fore, [0, 0, 0], [0, -.25, 0], .035, skin, .055);
    sphere(fore, 0, -.28, 0, .043, .065, .03, skin); arms.push({ upper, fore, side: s });
    const leg = new THREE.Group(); leg.position.set(s * .125, .96, 0); athlete.add(leg);
    rod(leg, [0, 0, 0], [0, -.26, 0], .105, shorts, .115);
    rod(leg, [0, -.22, 0], [0, -.47, 0], .065, skin, .08);
    sphere(leg, 0, -.46, 0, .065, .075, .063, skin);
    rod(leg, [0, -.47, 0], [0, -.85, 0], .037, skin, .06);
    sphere(leg, 0, -.61, .008, .057, .15, .055, skin);
    sphere(leg, 0, -.84, 0, .04, .055, .042, skin);
    sphere(leg, 0, -.89, -.06, .07, .055, .14, rubber); box(leg, 0, -.93, -.06, .14, .025, .27, steel); legs.push(leg);
  }
  athlete.traverse(o => o.layers.set(1));

  // Planar reflection: project a mirrored camera into the physical mirror plane.
  const reflection = new THREE.WebGLRenderTarget(768, 768, { depthBuffer: true });
  const reflectedCamera = new THREE.PerspectiveCamera(); reflectedCamera.layers.enable(1);
  const textureMatrix = new THREE.Matrix4();
  const mirrorMaterial = new THREE.ShaderMaterial({
    uniforms: { reflectionMap: { value: reflection.texture }, textureMatrix: { value: textureMatrix } },
    vertexShader: 'uniform mat4 textureMatrix; varying vec4 mirrorUV; void main(){ vec4 world=modelMatrix*vec4(position,1.0); mirrorUV=textureMatrix*world; gl_Position=projectionMatrix*viewMatrix*world; }',
    fragmentShader: 'uniform sampler2D reflectionMap; varying vec4 mirrorUV; void main(){ vec3 c=texture2DProj(reflectionMap,mirrorUV).rgb; gl_FragColor=vec4(c*.91+vec3(.015,.02,.025),1.0);\n #include <tonemapping_fragment>\n #include <colorspace_fragment>\n }'
  });
  const mirror = new THREE.Mesh(new THREE.PlaneGeometry(4.65, 3), mirrorMaterial); mirror.position.set(0, 1.6, mirrorZ); scene.add(mirror);
  // Batch stationary geometry by material to keep mobile draw calls low.
  const moving = new Set(); doors.forEach(d => d.traverse(o => moving.add(o)));
  const batches = new Map(); scene.updateMatrixWorld(true);
  scene.traverse(o => {
    if (!o.isMesh || o === mirror || moving.has(o) || o.layers.mask !== 1) return;
    if (!batches.has(o.material)) batches.set(o.material, []);
    batches.get(o.material).push(o);
  });
  for (const [mat, meshes] of batches) {
    if (meshes.length < 2) continue;
    const parts = meshes.map(m => { const g = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone(); return g.applyMatrix4(m.matrixWorld); });
    const merged = new THREE.BufferGeometry();
    for (const name of ['position', 'normal', 'uv']) {
      const arrays = parts.map(g => g.getAttribute(name).array);
      const all = new Float32Array(arrays.reduce((sum, a) => sum + a.length, 0));
      let offset = 0; arrays.forEach(a => { all.set(a, offset); offset += a.length; });
      merged.setAttribute(name, new THREE.BufferAttribute(all, name === 'uv' ? 2 : 3));
    }
    meshes.forEach(m => m.removeFromParent()); parts.forEach(g => g.dispose());
    scene.add(new THREE.Mesh(merged, mat));
  }
  const bias = new THREE.Matrix4().set(.5, 0, 0, .5, 0, .5, 0, .5, 0, 0, .5, .5, 0, 0, 0, 1);
  const smooth = (a, b, v) => { const t = THREE.MathUtils.clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  let paused = reducedMotion.matches, frozen = .35, target = 0, current = 0, frame = 0, lastTime = 0, lost = false;
  try { paused ||= localStorage.getItem('form-fuel-gym-motion') === 'off'; } catch {}
  if (paused) current = frozen;
  function updateToggle() { toggle.hidden = false; toggle.setAttribute('aria-pressed', String(!paused)); toggle.querySelector('span').textContent = paused ? 'Motion off' : 'Motion on'; }
  function readScroll() { const max = Math.max(1, document.documentElement.scrollHeight - innerHeight); target = THREE.MathUtils.clamp(scrollY / max, 0, 1); wake(); }
  function pose(p) {
    const walk = smooth(.06, .83, p), end = smooth(.85, .98, p), stride = Math.sin(walk * 95) * (1 - smooth(.72, .85, p)) * smooth(.05, .12, p);
    camera.position.set(Math.sin(walk * Math.PI * 2) * .25, 1.71 + Math.sin(walk * 190) * .012 * (1 - end), 4.8 - walk * 20.5);
    camera.lookAt(camera.position.x * .35, 1.64 - end * .25, mirrorZ);
    camera.updateMatrixWorld();
    doors.forEach((d, i) => { const side = i ? 1 : -1; d.position.x = side * (1.5 + smooth(.015, .15, p) * 2.9); });
    athlete.position.set(camera.position.x, 0, camera.position.z + .02);
    arms.forEach(({ upper, fore, side }) => { upper.rotation.z = side * (.09 + end * 1.36); upper.rotation.x = -side * stride * .25; fore.rotation.z = side * end * 1.26; fore.rotation.x = -.12 * (1 - end); });
    legs.forEach((leg, i) => { leg.rotation.x = (i ? -1 : 1) * stride * .18; leg.rotation.z = (i ? .02 : -.02) * end; });
    progressBar.style.transform = `scaleX(${p})`;
    stageLabel.textContent = p < .16 ? '01 / Enter the gym' : p < .83 ? '02 / Find your strength' : '03 / Own your progress';
  }
  function render() {
    const aim = new THREE.Vector3(); camera.getWorldDirection(aim); aim.add(camera.position); aim.z = 2 * mirrorZ - aim.z;
    reflectedCamera.position.copy(camera.position); reflectedCamera.position.z = 2 * mirrorZ - camera.position.z;
    reflectedCamera.up.copy(camera.up); reflectedCamera.lookAt(aim); reflectedCamera.projectionMatrix.copy(camera.projectionMatrix); reflectedCamera.updateMatrixWorld();
    textureMatrix.copy(bias).multiply(reflectedCamera.projectionMatrix).multiply(reflectedCamera.matrixWorldInverse);
    mirror.visible = false;
    // Only render the reflection when it is close enough to matter.
    if (current > .5 || paused) { renderer.clippingPlanes = [new THREE.Plane(new THREE.Vector3(0, 0, 1), -mirrorZ)]; renderer.setRenderTarget(reflection); renderer.render(scene, reflectedCamera); renderer.setRenderTarget(null); renderer.clippingPlanes = []; }
    mirror.visible = true; renderer.render(scene, camera);
  }
  function tick(now) {
    frame = 0; if (document.hidden || lost) return;
    const dt = Math.min((now - lastTime) / 1000 || .016, .05); lastTime = now;
    const goal = paused ? frozen : target;
    current += (goal - current) * (1 - Math.exp(-12 * dt));
    if (Math.abs(goal - current) < .0002) current = goal;
    pose(current); render();
    if (Math.abs(goal - current) > .0002) frame = requestAnimationFrame(tick);
  }
  function wake() { if (!frame && !document.hidden && !lost) frame = requestAnimationFrame(tick); }
  function resize() { renderer.setSize(innerWidth, innerHeight); camera.aspect = innerWidth / innerHeight; camera.fov = innerWidth < 700 ? 72 : 62; camera.updateProjectionMatrix(); readScroll(); }
  toggle.addEventListener('click', () => { paused = !paused; frozen = current; try { localStorage.setItem('form-fuel-gym-motion', paused ? 'off' : 'on'); } catch {} updateToggle(); wake(); });
  reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; frozen = current; updateToggle(); wake(); });
  addEventListener('scroll', readScroll, { passive: true }); addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => { lastTime = 0; wake(); });
  new ResizeObserver(readScroll).observe(document.body);
  renderer.domElement.addEventListener('webglcontextlost', e => { e.preventDefault(); lost = true; cancelAnimationFrame(frame); frame = 0; backdrop.classList.remove('gym-ready'); document.body.classList.remove('gym-enabled'); toggle.hidden = true; });
  renderer.domElement.addEventListener('webglcontextrestored', () => { lost = false; backdrop.classList.add('gym-ready'); document.body.classList.add('gym-enabled'); updateToggle(); wake(); });
  backdrop.classList.add('gym-ready'); document.body.classList.add('gym-enabled'); updateToggle(); resize();
} catch (error) {
  renderer?.dispose(); renderer?.domElement.remove();
  toggle.hidden = true; document.body.classList.remove('gym-enabled');
  console.warn('Gym background unavailable; using the static background.', error);
}

