/**
 * ============================================================================
 * WEBGL 3D INTERACTIVE ENGINE - CLOUD-NATIVE CONSTELLATION
 * CHECKPOINT 3.3: High-Performance Interactive Canvas Layer Container
 * Designated for custom 3D WebGL animation frames, safely isolating viewport context
 * ============================================================================
 */

(function () {
  'use strict';

  const container = document.getElementById('webgl-canvas-container');
  if (!container) return;

  // Track pointer and scroll state with damping
  const state = {
    mouseX: 0,
    mouseY: 0,
    targetX: 0,
    targetY: 0,
    scrollSpeed: 0,
    lastScrollY: window.scrollY,
    width: window.innerWidth,
    height: window.innerHeight,
    isTabActive: true
  };

  // Window event listeners
  window.addEventListener('mousemove', (e) => {
    state.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    state.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  }, { passive: true });

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    state.scrollSpeed = (currentScrollY - state.lastScrollY) * 0.05;
    state.lastScrollY = currentScrollY;
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    state.isTabActive = !document.hidden;
  });

  // Attempt Three.js initialization first; fall back to native WebGL if unavailable
  if (typeof THREE !== 'undefined') {
    initThreeJSScene();
  } else {
    initNativeWebGLFallback();
  }

  // --------------------------------------------------------------------------
  // PRIMARY WEBGL ENGINE: THREE.JS IMPLEMENTATION
  // --------------------------------------------------------------------------
  function initThreeJSScene() {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070a14, 0.0018);

    const camera = new THREE.PerspectiveCamera(60, state.width / state.height, 0.1, 1000);
    camera.position.z = 90;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(state.width, state.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x070a14, 0);
    container.appendChild(renderer.domElement);

    // Root cluster group for smooth mouse tilt
    const clusterGroup = new THREE.Group();
    scene.add(clusterGroup);

    // 1. Central Cloud Infrastructure Cluster (Icosahedron Wireframe)
    const icoGeometry = new THREE.IcosahedronGeometry(26, 2);
    const icoMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.22
    });
    const cloudCore = new THREE.Mesh(icoGeometry, icoMaterial);
    clusterGroup.add(cloudCore);

    // Inner glowing core
    const innerGeo = new THREE.OctahedronGeometry(14, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    clusterGroup.add(innerCore);

    // 2. Torus GitOps / CI/CD Continuous Ring
    const torusGeo = new THREE.TorusGeometry(40, 0.7, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    const gitOpsRing = new THREE.Mesh(torusGeo, torusMat);
    gitOpsRing.rotation.x = Math.PI / 3;
    gitOpsRing.rotation.y = Math.PI / 6;
    clusterGroup.add(gitOpsRing);

    // Second inclined ring
    const torusGeo2 = new THREE.TorusGeometry(48, 0.5, 12, 100);
    const torusMat2 = new THREE.MeshBasicMaterial({
      color: 0xa78bfa,
      wireframe: true,
      transparent: true,
      opacity: 0.12
    });
    const gitOpsRing2 = new THREE.Mesh(torusGeo2, torusMat2);
    gitOpsRing2.rotation.x = -Math.PI / 4;
    gitOpsRing2.rotation.z = Math.PI / 5;
    clusterGroup.add(gitOpsRing2);

    // 3. Floating Microservices & Distributed Data Nodes (Particles)
    const particleCount = 220;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const cyanColor = new THREE.Color(0x00f0ff);
    const purpleColor = new THREE.Color(0xa78bfa);
    const emeraldColor = new THREE.Color(0x34d399);

    for (let i = 0; i < particleCount; i++) {
      const radius = 35 + Math.random() * 85;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Random color assignment between cyan, purple, and emerald
      const rand = Math.random();
      const col = rand < 0.5 ? cyanColor : rand < 0.85 ? purpleColor : emeraldColor;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle sprite using canvas texture for clean circular glowing dots
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(0, 240, 255, 0.8)');
    grad.addColorStop(1, 'rgba(0, 240, 255, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const particleTexture = new THREE.CanvasTexture(canvas);
    const particleMat = new THREE.PointsMaterial({
      size: 3.2,
      map: particleTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    clusterGroup.add(particles);

    // Resize Handler
    window.addEventListener('resize', () => {
      state.width = window.innerWidth;
      state.height = window.innerHeight;
      camera.aspect = state.width / state.height;
      camera.updateProjectionMatrix();
      renderer.setSize(state.width, state.height);
    });

    // Animation Loop
    let clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      if (!state.isTabActive) return;

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth mouse damping (Lerp)
      state.mouseX += (state.targetX - state.mouseX) * 0.05;
      state.mouseY += (state.targetY - state.mouseY) * 0.05;

      // Base rotations
      cloudCore.rotation.y += 0.003;
      cloudCore.rotation.x += 0.0015;
      innerCore.rotation.y -= 0.006;
      innerCore.rotation.z += 0.004;

      gitOpsRing.rotation.z += 0.002;
      gitOpsRing2.rotation.y -= 0.0025;

      particles.rotation.y = time * 0.02;

      // Dynamic tilt responding to cursor & scroll velocity
      clusterGroup.rotation.y = state.mouseX * 0.45 + (time * 0.03);
      clusterGroup.rotation.x = -state.mouseY * 0.35;

      // Scroll responsiveness
      if (Math.abs(state.scrollSpeed) > 0.001) {
        clusterGroup.rotation.y += state.scrollSpeed * 0.02;
        cloudCore.rotation.z += state.scrollSpeed * 0.01;
        state.scrollSpeed *= 0.92; // friction
      }

      renderer.render(scene, camera);
    }
    animate();
  }

  // --------------------------------------------------------------------------
  // SECONDARY WEBGL FALLBACK (Native WebGL Shader Pipeline if Three.js offline)
  // --------------------------------------------------------------------------
  function initNativeWebGLFallback() {
    const canvas = document.createElement('canvas');
    canvas.width = state.width;
    canvas.height = state.height;
    container.appendChild(canvas);

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const vsSource = `
      attribute vec3 aPosition;
      uniform mat4 uMatrix;
      uniform float uPointSize;
      void main() {
        gl_Position = uMatrix * vec4(aPosition, 1.0);
        gl_PointSize = uPointSize;
      }
    `;

    const fsSource = `
      precision mediump float;
      uniform vec3 uColor;
      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        gl_FragColor = vec4(uColor, 1.0 - (dist * 2.0));
      }
    `;

    function createShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    }

    const program = gl.createProgram();
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vsSource));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(program);
    gl.useProgram(program);

    // Simple particle field
    const numPoints = 150;
    const positions = new Float32Array(numPoints * 3);
    for (let i = 0; i < numPoints * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 2;
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

    const uMatrix = gl.getUniformLocation(program, 'uMatrix');
    const uPointSize = gl.getUniformLocation(program, 'uPointSize');
    const uColor = gl.getUniformLocation(program, 'uColor');

    gl.uniform1f(uPointSize, 5.0);
    gl.uniform3f(uColor, 0.0, 0.94, 1.0);

    let angle = 0;
    function renderNative() {
      requestAnimationFrame(renderNative);
      if (!state.isTabActive) return;

      angle += 0.005;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      // Simple rotation matrix
      const matrix = [
        cosA, 0, sinA, 0,
        0, 1, 0, 0,
        -sinA, 0, cosA, 0,
        0, 0, 0, 1
      ];

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0.027, 0.039, 0.078, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniformMatrix4fv(uMatrix, false, new Float32Array(matrix));
      gl.drawArrays(gl.POINTS, 0, numPoints);
    }
    renderNative();

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }
})();
