import * as THREE from 'three';

const CAM_LERP     = 0.045;
const PARALLAX_STR = 1.7;

const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.NoToneMapping;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 300);

const camCur = { x: 0, y: 42, z: 12, lx: 0, ly: 24, lz: -8 };
const camTgt = { x: 0, y: 42, z: 12, lx: 0, ly: 24, lz: -8 };

const WORLD = {
  intro:   { cam: [ 0, 200, 12], look: [ 0, 20,  -8] },
  main:    { cam: [ 5,   5, 16], look: [ 0,  5,  10] },
  video:   { cam: [-43,  7, 12], look: [-30, 5.5,  0] },
  contact: { cam: [61,   3,  3], look: [ 0, 40,   2] },
};

const WORLD_MOBILE = {
  intro:   { cam: [ 0, 200, 12],  look: [ 0,  20,  -8] },
  main:    { cam: [ 3,   5, 20],  look: [ 5,   5,   9] },
  video:   { cam: [-36, 5.5, 21], look: [-36, 5.5,  10] },
  contact: { cam: [50,   8, 12],  look: [50,   8,  -4] },
};

// ↓↓↓ MODIFIEZ ICI POUR AJUSTER LES SPRITES ↓↓↓
const SPRITES_DESKTOP = {
  main:    { x:   4, y:   5, z:  12, scale:  7 },
  video:   { x: -36, y: 5.5, z:  10, scale: 11 },
  contact: { x:  50, y:   8, z:  -4, scale: 19 },
};

const SPRITES_MOBILE = {
  main:    { x:   4, y:   5, z:   9, scale:  8 },
  video:   { x: -36, y:   7, z:  15, scale:  4 },
  contact: { x:  50, y:   5, z:  -2, scale: 19 },
};
// ↑↑↑ FIN ZONE D'ÉDITION SPRITES ↑↑↑

// ↓↓↓ MODIFIEZ ICI POUR AJUSTER LES TRIANGLES ↓↓↓
const TRIANGLES_DESKTOP = [
  { x:  5,  y: 12,  z:  5, width: 10.2, height: 10,  rotationZ: -48, rotationX: 75, rotationY: -15, color: 0x000000 },  // T0
  { x: -9,  y:  8,  z: 12, width: 10.2, height: 20,  rotationZ:   0, rotationX: 79, rotationY: -15, color: 0x000FF41 }, // T1
  { x: -4,  y: -3,  z:  2, width: 10.2, height: 20,  rotationZ:   0, rotationX: 70, rotationY: -15, color: 0x000FF41 }, // T2
  { x: -30, y:  9,  z: 10, width:   12, height: 19,  rotationZ:  45, rotationX:  0, rotationY:  90, color: 0x000FF41 }, // T3
  { x: -43, y: 10,  z:  9, width:    6, height: 16,  rotationZ:  45, rotationX:  0, rotationY:  90, color: 0x000FF41 }, // T4
  { x: -30, y:  9,  z:  5, width:  100, height:  60, rotationZ:   0, rotationX: 45, rotationY:  90, color: 0x000000 },  // T5
  { x:  55, y: 23,  z: 22, width:   16, height: 32,  rotationZ:  90, rotationX:  0, rotationY:   0, color: 0x000FF41 }, // T6
  { x:  46, y: 13,  z:-10, width:   16, height: 32,  rotationZ:   0, rotationX: 92, rotationY:   0, color: 0x000FF41 }, // T7
];

const TRIANGLES_MOBILE = [
  { x:  5,  y: 12,  z:  5, width: 10.2, height: 10,  rotationZ: -48, rotationX: 75, rotationY: -15, color: 0x000000 },  // T0
  { x:  6,  y:  8,  z:  3, width: 10.2, height: 20,  rotationZ:   0, rotationX: 79, rotationY: -15, color: 0x000FF41 }, // T1
  { x:  2,  y: -2,  z:  0, width: 10.2, height: 20,  rotationZ:   0, rotationX: 70, rotationY: -15, color: 0x000FF41 }, // T2
  { x: -36, y:  9,  z: 10, width:   12, height: 19,  rotationZ:  45, rotationX:  0, rotationY:  90, color: 0x000FF41 }, // T3
  { x: -37, y:  2,  z: 14, width:    6, height: 16,  rotationZ:  30, rotationX:  0, rotationY:  90, color: 0x000FF41 }, // T4
  { x: -30, y:  9,  z:  5, width:  100, height:  60, rotationZ:   0, rotationX: 45, rotationY:  90, color: 0x000000 },  // T5
  { x:  55, y: 23,  z: 22, width:   16, height: 32,  rotationZ:  90, rotationX:  0, rotationY:   0, color: 0x000FF41 }, // T6
  { x:  46, y: 13,  z:-10, width:   16, height: 32,  rotationZ:   0, rotationX: 92, rotationY:   0, color: 0x000FF41 }, // T7
];
// ↑↑↑ FIN ZONE D'ÉDITION TRIANGLES ↑↑↑

const TRIANGLE_MESHES = [];

function isMobilePortrait() {
  return window.innerWidth <= 768 && window.innerHeight > window.innerWidth;
}

function getWorldDef(name) {
  return (isMobilePortrait() ? WORLD_MOBILE : WORLD)[name];
}

function getSpriteConf(key) {
  return (isMobilePortrait() ? SPRITES_MOBILE : SPRITES_DESKTOP)[key];
}

function applyTrianglesLayout() {
  const configs = isMobilePortrait() ? TRIANGLES_MOBILE : TRIANGLES_DESKTOP;
  configs.forEach((conf, i) => {
    const mesh = TRIANGLE_MESHES[i];
    if (!mesh) return;
    mesh.position.set(conf.x, conf.y, conf.z);
    mesh.rotation.set(conf.rotationX, conf.rotationY, conf.rotationZ);
    const shape = new THREE.Shape();
    shape.moveTo(0, conf.height * 0.5);
    shape.lineTo(-conf.width * 0.5, -conf.height * 0.5);
    shape.lineTo(conf.width * 0.5, -conf.height * 0.5);
    shape.closePath();
    mesh.geometry.dispose();
    mesh.geometry = new THREE.ShapeGeometry(shape);
  });
}

function applySpritesLayout() {
  ['main', 'video', 'contact'].forEach(key => {
    const c = SCENE_SPRITES[key];
    if (!c || !c.sprite) return;
    const conf = getSpriteConf(key);
    c.sprite.position.set(conf.x, conf.y, conf.z);
    const map = c.sprite.material.map;
    if (map && map.image) {
      const ratio = map.image.width / (map.image.height || 1);
      c.sprite.scale.set(conf.scale * ratio, conf.scale, 1);
    }
  });
}

let currentScene = 'intro';
const emailWorldPos = new THREE.Vector3(55, 6, 0);
const emailEl = document.getElementById('contact-email-hud');
let mouseNDX = 0;
let mouseNDY = 0;

function createBlackTriangle({ x, y, z, width, height, rotationZ = 0, rotationX = 0, rotationY = 0, color = 0x000000, sceneKey = null }) {
  const shape = new THREE.Shape();
  shape.moveTo(0, height * 0.5);
  shape.lineTo(-width * 0.5, -height * 0.5);
  shape.lineTo(width * 0.5, -height * 0.5);
  shape.closePath();

  const geometry = new THREE.ShapeGeometry(shape);
  const material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide,
    color: color,
    transparent: true,
  });
  const triangle = new THREE.Mesh(geometry, material);
  triangle.position.set(x, y, z);
  triangle.rotation.set(rotationX, rotationY, rotationZ);
  triangle.renderOrder = -1;
  scene.add(triangle);

  if (sceneKey) {
    const initOpacity = (sceneKey === currentScene) ? 1 : 0;
    material.opacity = initOpacity;
    triangle.visible  = initOpacity > 0.005;
    SCENE_SPRITES[`triangle_${x}_${y}_${z}`] = { sprite: triangle, targetOpacity: initOpacity, sceneKey };
  }

  return triangle;
}

/* ═══════════════════════════════════════════════════════════
   SPRITES 2D (illustrations Visu1/2/3 — billboards)
   Rasterisés en Canvas pour éviter les problèmes SVG/WebGL
═══════════════════════════════════════════════════════════ */

// Conteneurs de sprites indexés par nom de scène { sprite, targetOpacity }
const SCENE_SPRITES = {};

function loadSpriteNow(svgPath, storageKey, x, y, z, baseScale, sceneKey) {
  const CANVAS_W = 2048;
  if (!SCENE_SPRITES[storageKey]) {
    SCENE_SPRITES[storageKey] = { sprite: null, targetOpacity: 0, loaded: false };
  }
  const container = SCENE_SPRITES[storageKey];
  if (sceneKey) container.sceneKey = sceneKey;
  const resolvedKey = sceneKey || storageKey;

  const img = new Image();
  img.onload = () => {
    const ratio  = img.naturalWidth / (img.naturalHeight || img.naturalWidth || 1);
    const canvas = document.createElement('canvas');
    canvas.width  = CANVAS_W;
    canvas.height = Math.round(CANVAS_W / (ratio || 1));
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;

    const initOpacity = (resolvedKey === currentScene) ? 1 : 0;
    const mat    = new THREE.SpriteMaterial({ map: tex, transparent: true, alphaTest: 0, opacity: initOpacity });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(baseScale * (ratio || 1), baseScale, 1);
    sprite.position.set(x, y, z);
    sprite.visible          = initOpacity > 0.001;
    container.sprite        = sprite;
    container.targetOpacity = initOpacity;
    container.loaded        = true;
    scene.add(sprite);
  };
  img.onerror = () => console.warn('Sprite not found:', svgPath);
  img.src = svgPath;
}

function registerLazySprite(svgPath, sceneKey, x, y, z, baseScale) {
  SCENE_SPRITES[sceneKey] = {
    sprite: null,
    targetOpacity: 0,
    loaded: false,
    lazyArgs: [svgPath, sceneKey, x, y, z, baseScale],
  };
}

function triggerLazyLoad(sceneKey) {
  const container = SCENE_SPRITES[sceneKey];
  if (!container || container.loaded || !container.lazyArgs) return;
  container.loaded = true;
  loadSpriteNow(...container.lazyArgs);
}

function createSprites() {
  loadSpriteNow('assets/svg/MTP.svg',    'intro_mtp',    0, 185, 11, 33, 'intro');
  loadSpriteNow('assets/svg/CLOUDS.svg', 'intro_clouds', 2, 187,  4,  6, 'intro');
  const s1 = getSpriteConf('main');    registerLazySprite('assets/svg/Visu1.svg', 'main',    s1.x, s1.y, s1.z, s1.scale);
  const s2 = getSpriteConf('video');   registerLazySprite('assets/svg/Visu2.svg', 'video',   s2.x, s2.y, s2.z, s2.scale);
  const s3 = getSpriteConf('contact'); registerLazySprite('assets/svg/Visu3.svg', 'contact', s3.x, s3.y, s3.z, s3.scale);

  // triangles — lus depuis TRIANGLES_DESKTOP ou TRIANGLES_MOBILE selon le viewport
  const triConfs = isMobilePortrait() ? TRIANGLES_MOBILE : TRIANGLES_DESKTOP;
  triConfs.forEach(conf => TRIANGLE_MESHES.push(createBlackTriangle(conf)));


}

const panels = {
  intro:   document.getElementById('panel-intro'),
  main:    document.getElementById('panel-main'),
  video:   document.getElementById('panel-video'),
  contact: document.getElementById('panel-contact'),
};

const hudNameEl  = document.getElementById('hudName');
const hudSceneEl = document.getElementById('hudScene');

const LABELS = {
  intro:   '',
  main:    'HOME',
  video:   'Video Editing',
  contact: 'Contact',
};

function showPanel(name) {
  Object.entries(panels).forEach(([key, el]) => {
    el.classList.toggle('active', key === name);
  });
  hudSceneEl.textContent = LABELS[name];
  hudNameEl.classList.toggle('visible', name !== 'intro');
  emailEl.classList.toggle('visible', name === 'contact');
  Object.entries(SCENE_SPRITES).forEach(([key, c]) => {
    c.targetOpacity = ((c.sceneKey || key) === name) ? 1 : 0;
  });
}

function navigateTo(name) {
  if (name === currentScene) return;
  currentScene = name;
  triggerLazyLoad(name);
  const def = getWorldDef(name);
  camTgt.x  = def.cam[0];  camTgt.y  = def.cam[1];  camTgt.z  = def.cam[2];
  camTgt.lx = def.look[0]; camTgt.ly = def.look[1]; camTgt.lz = def.look[2];
  setTimeout(() => showPanel(name), 120);
}

function animate() {
  requestAnimationFrame(animate);

  camCur.x  += (camTgt.x  - camCur.x)  * CAM_LERP;
  camCur.y  += (camTgt.y  - camCur.y)  * CAM_LERP;
  camCur.z  += (camTgt.z  - camCur.z)  * CAM_LERP;
  camCur.lx += (camTgt.lx - camCur.lx) * CAM_LERP;
  camCur.ly += (camTgt.ly - camCur.ly) * CAM_LERP;
  camCur.lz += (camTgt.lz - camCur.lz) * CAM_LERP;

  const px = mouseNDX * PARALLAX_STR;
  const py = -mouseNDY * PARALLAX_STR * 0.6;

  camera.position.set(camCur.x + px, camCur.y + py, camCur.z);
  camera.lookAt(camCur.lx + px * 0.35, camCur.ly + py * 0.35, camCur.lz);

  Object.values(SCENE_SPRITES).forEach(c => {
    if (!c.sprite) return;
    const mat = c.sprite.material;
    mat.opacity += (c.targetOpacity - mat.opacity) * 0.06;
    c.sprite.visible = mat.opacity > 0.005;
  });

  const eProj = emailWorldPos.clone().project(camera);
  emailEl.style.left = ((eProj.x *  0.5 + 0.5) * window.innerWidth)  + 'px';
  emailEl.style.top  = ((eProj.y * -0.5 + 0.5) * window.innerHeight) + 'px';
  renderer.render(scene, camera);
}

const cursorEl = document.getElementById('cursor');

document.addEventListener('mousemove', (e) => {
  cursorEl.style.left = e.clientX + 'px';
  cursorEl.style.top  = e.clientY + 'px';
  mouseNDX = (e.clientX / window.innerWidth)  - 0.5;
  mouseNDY = (e.clientY / window.innerHeight) - 0.5;
});

document.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  mouseNDX = ((touch.clientX / window.innerWidth)  - 0.5) * 0.35;
  mouseNDY = ((touch.clientY / window.innerHeight) - 0.5) * 0.35;
}, { passive: true });

document.addEventListener('touchend', () => {
  mouseNDX = 0;
  mouseNDY = 0;
});

document.querySelectorAll(
  'a, button, input, textarea, .nav-item, .back-btn, .reel-tab, .reel-item, .social-link, .click-prompt'
).forEach(el => {
  el.addEventListener('mouseenter', () => cursorEl.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursorEl.classList.remove('hover'));
});

function initEvents() {
  panels.intro.addEventListener('click', () => {
    if (currentScene === 'intro') navigateTo('main');
  });

  document.getElementById('navVideo').addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('video');
  });
  document.getElementById('navContact').addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('contact');
  });
  document.getElementById('backFromVideo').addEventListener('click', () => navigateTo('main'));
  document.getElementById('backFromContact').addEventListener('click', () => navigateTo('main'));

  document.getElementById('hudName').addEventListener('click', () => {
    if (currentScene !== 'intro' && currentScene !== 'main') navigateTo('main');
  });

  document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name    = form.querySelector('input[name="name"]').value.trim();
    const email   = form.querySelector('input[name="email"]').value.trim();
    const message = form.querySelector('textarea[name="message"]').value.trim();
    const subject = encodeURIComponent('Contact — Portfolio André Devesa');
    const body    = encodeURIComponent(`Nom : ${name}\nEmail : ${email}\n\n${message}`);
    window.location.href = `mailto:hello@andredevesa.com?subject=${subject}&body=${body}`;
  });

  const reelBoxBg    = document.getElementById('reelBoxBg');
  const reelsListEl  = document.getElementById('reelsList');
  const youtubeListEl = document.getElementById('youtubeList');

  document.querySelectorAll('.reel-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.reel-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const isYoutube = tab.dataset.tab === 'youtube';
      reelBoxBg.src = isYoutube ? 'assets/svg/YouTubeBox.svg' : 'assets/svg/ReelBox.svg';
      reelsListEl.style.display   = isYoutube ? 'none' : '';
      youtubeListEl.style.display = isYoutube ? ''     : 'none';
      reelBoxBg.classList.remove('stretching');
      void reelBoxBg.offsetWidth;
      reelBoxBg.classList.add('stretching');
      reelBoxBg.addEventListener('animationend', () => reelBoxBg.classList.remove('stretching'), { once: true });
    });
  });
}

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  const def = getWorldDef(currentScene);
  camTgt.x = def.cam[0]; camTgt.y = def.cam[1]; camTgt.z = def.cam[2];
  camTgt.lx = def.look[0]; camTgt.ly = def.look[1]; camTgt.lz = def.look[2];
  applySpritesLayout();
  applyTrianglesLayout();
});

window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    const def = getWorldDef(currentScene);
    camTgt.x = def.cam[0]; camTgt.y = def.cam[1]; camTgt.z = def.cam[2];
    camTgt.lx = def.look[0]; camTgt.ly = def.look[1]; camTgt.lz = def.look[2];
    applySpritesLayout();
    applyTrianglesLayout();
  }, 200);
});

(function init() {
  createSprites();
  initEvents();

  const intro = getWorldDef('intro');
  camera.position.set(...intro.cam);
  camera.lookAt(...intro.look);
  Object.assign(camCur, { x: intro.cam[0], y: intro.cam[1], z: intro.cam[2], lx: intro.look[0], ly: intro.look[1], lz: intro.look[2] });
  Object.assign(camTgt, { x: intro.cam[0], y: intro.cam[1], z: intro.cam[2], lx: intro.look[0], ly: intro.look[1], lz: intro.look[2] });

  showPanel('intro');
  animate();
  document.body.classList.remove('loading');
  document.body.classList.add('js-ready');
})();

document.querySelectorAll('a.reel-play').forEach(a => {
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
});
