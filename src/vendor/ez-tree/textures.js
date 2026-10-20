// Lazy texture loading for the vendored ez-tree library (original eagerly imported every bark and leaf texture).
// Textures are served from /garden/tree as 512px WebP.
import * as THREE from 'three';

const loader = new THREE.TextureLoader();
const cache = new Map();
const base = '/garden/tree/';

function load(file, srgb) {
  if (cache.has(file)) return cache.get(file);
  const t = loader.load(base + file);
  t.premultiplyAlpha = true;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  cache.set(file, t);
  return t;
}

export function getBarkTexture(barkType, fileType, scale = { x: 1, y: 1 }) {
  // one texture per type and repeat, so each loads its own image (a clone made before loading never updates)
  const key = `${barkType}_${fileType}.webp|${scale.x}|${scale.y}`;
  if (cache.has(key)) return cache.get(key);
  const texture = loader.load(base + `${barkType}_${fileType}.webp`);
  texture.premultiplyAlpha = true;
  if (fileType === 'color') texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.x = scale.x;
  texture.repeat.y = 1 / scale.y;
  cache.set(key, texture);
  return texture;
}

export function getLeafTexture(leafType) {
  return load(`leaf_${leafType}.webp`, true);
}
