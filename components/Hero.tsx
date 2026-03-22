import React, { useRef, useLayoutEffect, useEffect, useState } from "react";
import gsap from "gsap";
import * as THREE from "three";
import TeleprompterModal from "./TeleprompterModal";

const Hero: React.FC = () => {
  const [isTeleprompterOpen, setIsTeleprompterOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const textOverlayRef = useRef<HTMLDivElement>(null);
  const fadeOverlayRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  // Tracks first render time for startup projector-fade effect
  const startTimeRef = useRef<number | null>(null);

  // Store refs for cleanup and animation
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const segmentsRef = useRef<THREE.Group[]>([]);
  const scrollPosRef = useRef(0);
  const autoScrollSpeedRef = useRef(0.5);
  const isUserScrollingRef = useRef(false);
  const lastUserScrollTimeRef = useRef(0);

  // Texture cache for performance
  const textureLoaderRef = useRef<THREE.TextureLoader>(
    new THREE.TextureLoader(),
  );
  const textureCacheRef = useRef<Map<string, THREE.Texture>>(new Map());

  // Video elements cache for reuse
  const videoElementsRef = useRef<Map<string, HTMLVideoElement>>(new Map());

  // Track recently used video URLs across segments to avoid close repetition
  const recentVideoUrlsRef = useRef<string[]>([]);

  // Grid line materials for potential animation
  const lineMaterialsRef = useRef<THREE.LineBasicMaterial[]>([]);

  // --- CONFIGURATION ---
  const TUNNEL_WIDTH = 37.5;
  const TUNNEL_HEIGHT = 25.0;
  const SEGMENT_DEPTH = 6;
  const NUM_SEGMENTS = 8;
  const FOG_DENSITY = 0.022;

  const FLOOR_COLS = 6;
  const WALL_ROWS = 4;

  const COL_WIDTH = TUNNEL_WIDTH / FLOOR_COLS;
  const ROW_HEIGHT = TUNNEL_HEIGHT / WALL_ROWS;

  // Cloudinary videos
  const videoUrls = [
    "https://res.cloudinary.com/dwgjwc96q/video/upload/v1769368553/PXL_20250329_140459146_kqw0rn.mp4",
    "https://res.cloudinary.com/dwgjwc96q/video/upload/v1769368527/PXL_20250816_110111789_1_jcfgsa.mp4",
    "https://res.cloudinary.com/dwgjwc96q/video/upload/v1769368537/PXL_20250816_111902752_1_wsjey1.mp4",
    "https://res.cloudinary.com/dwgjwc96q/video/upload/v1769368545/PXL_20250816_114424016_vuzphm.mp4",
    "https://res.cloudinary.com/dwgjwc96q/video/upload/v1769368536/PXL_20250816_120022662_bijv8t.mp4",
    "https://res.cloudinary.com/dwgjwc96q/video/upload/v1769368532/PXL_20250816_162740267_1_fa3uxb.mp4",
    "https://res.cloudinary.com/dwgjwc96q/video/upload/v1769368550/PXL_20251025_115448039_jgyjr1.mp4",
  ];

  const imageUrls = [
    "/images-optimized/DSC03927.webp",
    "/images-optimized/DSC03932.webp",
    "/images-optimized/DSC03983.webp",
    "/images-optimized/DSC03985.webp",
    "/images-optimized/DSC04276.webp",
    "/images-optimized/DSC04376.webp",
    "/images-optimized/DSC04911.webp",
    "/images-optimized/DSC04928.webp",
    "/images-optimized/DSC04931.webp",
    "/images-optimized/DSC04934.webp",
    "/images-optimized/DSC04936.webp",
    "/images-optimized/IMG_0090.webp",
    "/images-optimized/IMG_0132.webp",
    "/images-optimized/IMG_0164.webp",
    "/images-optimized/IMG_0344.webp",
    "/images-optimized/IMG_0354.webp",
    "/images-optimized/IMG_0381.webp",
    "/images-optimized/IMG_0382.webp",
    "/images-optimized/IMG_0399.webp",
    "/images-optimized/IMG_0403.webp",
    "/images-optimized/IMG_0407.webp",
    "/images-optimized/IMG_0436.webp",
    "/images-optimized/IMG_0445.webp",
    "/images-optimized/IMG_0506.webp",
    "/images-optimized/IMG_0578.webp",
    "/images-optimized/IMG_0659.webp",
    "/images-optimized/IMG_0665.webp",
    "/images-optimized/IMG_0675.webp",
    "/images-optimized/IMG_0687.webp",
    "/images-optimized/IMG_0694.webp",
    "/images-optimized/IMG_0698.webp",
    "/images-optimized/IMG_0743.webp",
    "/images-optimized/IMG_0758.webp",
    "/images-optimized/IMG_0868.webp",
    "/images-optimized/IMG_0871.webp",
    "/images-optimized/IMG_0879.webp",
    "/images-optimized/IMG_0977.webp",
    "/images-optimized/IMG_1248.webp",
    "/images-optimized/IMG_1375.webp",
    "/images-optimized/PXL_20250329_140247478.webp",
    "/images-optimized/PXL_20250329_140938227.MP.webp",
    "/images-optimized/PXL_20250329_141611004.webp",
  ];

  const createSegment = (zPos: number, fadeDelay = 0) => {
    const group = new THREE.Group();
    group.position.z = zPos;

    const w = TUNNEL_WIDTH / 2;
    const h = TUNNEL_HEIGHT / 2;
    const d = SEGMENT_DEPTH;

    // Gold/amber grid lines to match the cinematic palette
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xc6993a,
      transparent: true,
      opacity: 0.22,
    });
    const lineGeo = new THREE.BufferGeometry();
    const vertices: number[] = [];

    for (let i = 0; i <= FLOOR_COLS; i++) {
      const x = -w + i * COL_WIDTH;
      vertices.push(x, -h, 0, x, -h, -d);
      vertices.push(x, h, 0, x, h, -d);
    }
    for (let i = 1; i < WALL_ROWS; i++) {
      const y = -h + i * ROW_HEIGHT;
      vertices.push(-w, y, 0, -w, y, -d);
      vertices.push(w, y, 0, w, y, -d);
    }

    vertices.push(-w, -h, 0, w, -h, 0);
    vertices.push(-w, h, 0, w, h, 0);
    vertices.push(-w, -h, 0, -w, h, 0);
    vertices.push(w, -h, 0, w, h, 0);

    lineGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3),
    );
    const lines = new THREE.LineSegments(lineGeo, lineMaterial);
    group.add(lines);

    populateImages(group, w, h, d, fadeDelay);

    return group;
  };

  const pickSlots = (count: number, total: number): Set<number> => {
    const result = new Set<number>();
    if (count <= 0 || total <= 0) return result;
    const clamped = Math.min(count, total);
    const bucketSize = total / clamped;
    for (let b = 0; b < clamped; b++) {
      const start = Math.floor(b * bucketSize);
      const end = Math.floor((b + 1) * bucketSize);
      result.add(start + Math.floor(Math.random() * (end - start)));
    }
    return result;
  };

  const populateImages = (
    group: THREE.Group,
    w: number,
    h: number,
    d: number,
    fadeDelay = 0,
  ) => {
    const cellMargin = 0.4;
    const usedUrls = new Set<string>();

    const shuffledVideos = [...videoUrls].sort(() => Math.random() - 0.5);
    const shuffledImages = [...imageUrls].sort(() => Math.random() - 0.5);
    let videoIndex = 0;
    let imageIndex = 0;

    const addVideo = (
      pos: THREE.Vector3,
      rot: THREE.Euler,
      wd: number,
      ht: number,
    ) => {
      const recentGlobal = recentVideoUrlsRef.current;
      let url = "";

      for (let i = 0; i < shuffledVideos.length; i++) {
        const candidate =
          shuffledVideos[(videoIndex + i) % shuffledVideos.length];
        if (!usedUrls.has(candidate) && !recentGlobal.includes(candidate)) {
          url = candidate;
          videoIndex += i + 1;
          break;
        }
      }

      if (!url) {
        for (let i = 0; i < shuffledVideos.length; i++) {
          const candidate =
            shuffledVideos[(videoIndex + i) % shuffledVideos.length];
          if (!usedUrls.has(candidate)) {
            url = candidate;
            videoIndex += i + 1;
            break;
          }
        }
      }

      if (!url) {
        url = shuffledVideos[videoIndex % shuffledVideos.length];
        videoIndex++;
      }

      usedUrls.add(url);
      recentVideoUrlsRef.current = [...recentGlobal, url].slice(
        -videoUrls.length,
      );

      let video = videoElementsRef.current.get(url);

      if (!video) {
        video = document.createElement("video");
        video.src = url;
        video.crossOrigin = "anonymous";
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.autoplay = false;
        video.preload = "none";
        videoElementsRef.current.set(url, video);
      }

      const playVideo = () => {
        if (video.readyState >= 2) {
          if (video.paused) video.play().catch(() => {});
        } else {
          video.addEventListener(
            "loadedmetadata",
            () => {
              const randomStart = Math.random() * (video.duration || 0);
              video.currentTime = randomStart;
              video.play().catch(() => {});
            },
            { once: true },
          );
          video.load();
        }
      };

      setTimeout(playVideo, Math.random() * 1000);

      const videoTexture = new THREE.VideoTexture(video);
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;
      videoTexture.encoding = THREE.sRGBEncoding;

      const videoAspect =
        video.videoWidth && video.videoHeight
          ? video.videoWidth / video.videoHeight
          : 9 / 16;
      const cellAspect = (wd - cellMargin) / (ht - cellMargin);

      if (videoAspect < cellAspect) {
        const scale = cellAspect / videoAspect;
        videoTexture.repeat.set(1, 1 / scale);
        videoTexture.offset.set(0, (1 - 1 / scale) / 2);
      } else {
        const scale = videoAspect / cellAspect;
        videoTexture.repeat.set(1 / scale, 1);
        videoTexture.offset.set((1 - 1 / scale) / 2, 0);
      }

      const mat = new THREE.MeshBasicMaterial({
        map: videoTexture,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      });

      const geom = new THREE.PlaneGeometry(wd - cellMargin, ht - cellMargin);
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.copy(pos);
      mesh.rotation.copy(rot);
      mesh.name = "slab_video";
      mesh.userData.video = video;
      group.add(mesh);

      gsap.to(mat, { opacity: 0.85, duration: 1, delay: fadeDelay });
    };

    const addImg = (
      pos: THREE.Vector3,
      rot: THREE.Euler,
      wd: number,
      ht: number,
    ) => {
      const hasVideos = videoUrls.length > 0;
      const useVideo = hasVideos && Math.random() > 0.5;

      if (useVideo) {
        addVideo(pos, rot, wd, ht);
        return;
      }

      let url = "";
      let attempts = 0;
      const maxAttempts = shuffledImages.length;

      while (attempts < maxAttempts) {
        const candidateUrl = shuffledImages[imageIndex % shuffledImages.length];
        imageIndex++;
        if (!usedUrls.has(candidateUrl)) {
          url = candidateUrl;
          break;
        }
        attempts++;
      }

      if (!url) {
        url = shuffledImages[imageIndex % shuffledImages.length];
        imageIndex++;
      }

      usedUrls.add(url);
      const mat = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      });

      const createMeshWithTexture = (tex: THREE.Texture) => {
        if (!tex.image || !tex.image.width || !tex.image.height) {
          const geom = new THREE.PlaneGeometry(
            wd - cellMargin,
            ht - cellMargin,
          );
          const m = new THREE.Mesh(geom, mat);
          m.position.copy(pos);
          m.rotation.copy(rot);
          m.name = "slab_image";
          group.add(m);
          return;
        }

        const texAspect = tex.image.width / tex.image.height;
        const cellAspect = wd / ht;

        let finalWidth = wd - cellMargin;
        let finalHeight = ht - cellMargin;

        if (texAspect > cellAspect) {
          finalHeight = finalWidth / texAspect;
        } else {
          finalWidth = finalHeight * texAspect;
        }

        const geom = new THREE.PlaneGeometry(finalWidth, finalHeight);
        const m = new THREE.Mesh(geom, mat);
        m.position.copy(pos);
        m.rotation.copy(rot);
        m.name = "slab_image";
        group.add(m);
      };

      const cachedTexture = textureCacheRef.current.get(url);
      if (cachedTexture) {
        mat.map = cachedTexture;
        mat.needsUpdate = true;
        createMeshWithTexture(cachedTexture);
        gsap.to(mat, { opacity: 0.85, duration: 0.5, delay: fadeDelay });
      } else {
        textureLoaderRef.current.load(url, (tex) => {
          tex.minFilter = THREE.LinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = false;
          tex.encoding = THREE.sRGBEncoding;

          textureCacheRef.current.set(url, tex);

          mat.map = tex;
          mat.needsUpdate = true;
          createMeshWithTexture(tex);
          gsap.to(mat, { opacity: 0.85, duration: 1, delay: fadeDelay });
        });
      }
    };

    const isMobile = window.innerWidth < 768;
    const floorCount = isMobile ? 2 : 2;
    const ceilingCount = isMobile ? 1 : 1;
    const wallCount = isMobile ? 1 : 1;

    const floorSlots = pickSlots(floorCount, FLOOR_COLS);
    const ceilingSlots = pickSlots(ceilingCount, FLOOR_COLS);
    const leftWallSlots = pickSlots(wallCount, WALL_ROWS);
    const rightWallSlots = pickSlots(wallCount, WALL_ROWS);

    for (let i = 0; i < FLOOR_COLS; i++) {
      if (floorSlots.has(i)) {
        addImg(
          new THREE.Vector3(-w + i * COL_WIDTH + COL_WIDTH / 2, -h, -d / 2),
          new THREE.Euler(-Math.PI / 2, 0, 0),
          COL_WIDTH,
          d,
        );
      }
    }

    for (let i = 0; i < FLOOR_COLS; i++) {
      if (ceilingSlots.has(i)) {
        addImg(
          new THREE.Vector3(-w + i * COL_WIDTH + COL_WIDTH / 2, h, -d / 2),
          new THREE.Euler(Math.PI / 2, 0, 0),
          COL_WIDTH,
          d,
        );
      }
    }

    for (let i = 0; i < WALL_ROWS; i++) {
      if (leftWallSlots.has(i)) {
        addImg(
          new THREE.Vector3(-w, -h + i * ROW_HEIGHT + ROW_HEIGHT / 2, -d / 2),
          new THREE.Euler(0, Math.PI / 2, 0),
          d,
          ROW_HEIGHT,
        );
      }
    }

    for (let i = 0; i < WALL_ROWS; i++) {
      if (rightWallSlots.has(i)) {
        addImg(
          new THREE.Vector3(w, -h + i * ROW_HEIGHT + ROW_HEIGHT / 2, -d / 2),
          new THREE.Euler(0, -Math.PI / 2, 0),
          d,
          ROW_HEIGHT,
        );
      }
    }
  };

  // --- INITIAL SETUP ---
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    // Pure black background — cinematic dark tunnel
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, FOG_DENSITY);

    const width = window.innerWidth;
    const height = window.innerHeight;
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0);
    cameraRef.current = camera;

    const updateResponsiveSceneScale = (aspect: number) => {
      const scaleX = THREE.MathUtils.clamp(aspect * 1.2, 0.55, 1);
      scene.scale.set(scaleX, 1, 1);
    };
    updateResponsiveSceneScale(width / height);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: window.devicePixelRatio < 1.5,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    rendererRef.current = renderer;

    const segments: THREE.Group[] = [];

    // Create first 2 segments immediately — these are visible on initial load
    for (let i = 0; i < 2; i++) {
      const segment = createSegment(-i * SEGMENT_DEPTH, i * 0.35);
      scene.add(segment);
      segments.push(segment);
    }
    segmentsRef.current = segments;

    const collectLineMaterials = () => {
      lineMaterialsRef.current = [];
      segmentsRef.current.forEach((seg) => {
        seg.traverse((child) => {
          if (child instanceof THREE.LineSegments) {
            lineMaterialsRef.current.push(
              child.material as THREE.LineBasicMaterial,
            );
          }
        });
      });
    };
    collectLineMaterials();

    // Defer remaining segments until after first paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        for (let i = 2; i < NUM_SEGMENTS; i++) {
          const segment = createSegment(-i * SEGMENT_DEPTH, i * 0.35);
          scene.add(segment);
          segments.push(segment);
        }
        segmentsRef.current = [...segments];
        collectLineMaterials();
      });
    });

    // Animation Loop
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!cameraRef.current || !sceneRef.current || !rendererRef.current)
        return;

      const vh = window.innerHeight;
      const scrollY = window.scrollY;

      // ── Startup projector fade ─────────────────────────────────────────
      // First render captures the start time; overlay fades from opaque→clear
      if (startTimeRef.current === null) startTimeRef.current = Date.now();
      const elapsed = Date.now() - startTimeRef.current;
      const startupOp = Math.max(0, 1 - elapsed / 1400);

      // ── Scroll-driven blackout ─────────────────────────────────────────
      // Sticky scroll range = container (200vh) - viewport (1vh) = 100vh.
      // Blackout starts at 0.52vh, completes at 0.82vh — well within
      // the sticky range so the tunnel is fully black before it slides off.
      const scrollBlackout = Math.max(
        0,
        Math.min(1, (scrollY - vh * 0.52) / (vh * 0.3)),
      );

      const totalBlackout = Math.max(startupOp, scrollBlackout);
      if (fadeOverlayRef.current) {
        fadeOverlayRef.current.style.opacity = String(totalBlackout);
      }

      // ── Scroll cue (chevron at bottom of first viewport) ──────────────
      // Visible at page load, fades as user starts scrolling
      const scrollCueOp = Math.max(0, 1 - scrollY / (vh * 0.12));
      if (scrollCueRef.current) {
        scrollCueRef.current.style.opacity = String(scrollCueOp);
      }

      // ── Auto-scroll ────────────────────────────────────────────────────
      const now = Date.now();
      const timeSinceLastScroll = now - lastUserScrollTimeRef.current;
      if (timeSinceLastScroll > 100 && !isUserScrollingRef.current) {
        scrollPosRef.current += autoScrollSpeedRef.current;
      }

      const targetZ = -(scrollPosRef.current + scrollY) * 0.05;
      const currentZ = cameraRef.current.position.z;
      cameraRef.current.position.z += (targetZ - currentZ) * 0.1;

      // ── Bidirectional infinite segment recycling ───────────────────────
      const tunnelLength = NUM_SEGMENTS * SEGMENT_DEPTH;
      const camZ = cameraRef.current.position.z;

      segmentsRef.current.forEach((segment) => {
        if (segment.position.z > camZ + SEGMENT_DEPTH) {
          let minZ = 0;
          segmentsRef.current.forEach(
            (s) => (minZ = Math.min(minZ, s.position.z)),
          );
          segment.position.z = minZ - SEGMENT_DEPTH;

          const toRemove: THREE.Object3D[] = [];
          segment.traverse((c) => {
            if (c.name === "slab_image" || c.name === "slab_video")
              toRemove.push(c);
          });
          toRemove.forEach((c) => {
            segment.remove(c);
            if (c instanceof THREE.Mesh) {
              c.geometry.dispose();
              if (c.material.map) c.material.map.dispose();
              c.material.dispose();
            }
          });
          populateImages(
            segment,
            TUNNEL_WIDTH / 2,
            TUNNEL_HEIGHT / 2,
            SEGMENT_DEPTH,
          );
        }

        if (segment.position.z < camZ - tunnelLength - SEGMENT_DEPTH) {
          let maxZ = -999999;
          segmentsRef.current.forEach(
            (s) => (maxZ = Math.max(maxZ, s.position.z)),
          );
          segment.position.z = maxZ + SEGMENT_DEPTH;

          const toRemove: THREE.Object3D[] = [];
          segment.traverse((c) => {
            if (c.name === "slab_image" || c.name === "slab_video")
              toRemove.push(c);
          });
          toRemove.forEach((c) => {
            segment.remove(c);
            if (c instanceof THREE.Mesh) {
              c.geometry.dispose();
              if (c.material.map) c.material.map.dispose();
              c.material.dispose();
            }
          });
          populateImages(
            segment,
            TUNNEL_WIDTH / 2,
            TUNNEL_HEIGHT / 2,
            SEGMENT_DEPTH,
          );
        }
      });

      // ── Scroll-driven text fade ────────────────────────────────────────
      // Text fades out between 0.15vh–0.42vh, cleared before blackout starts
      const textOp = Math.max(
        0,
        Math.min(1, 1 - (scrollY - vh * 0.15) / (vh * 0.27)),
      );
      if (textOverlayRef.current) {
        textOverlayRef.current.style.opacity = String(textOp);
      }
      if (contentRef.current) {
        contentRef.current.style.pointerEvents =
          textOp < 0.05 ? "none" : "auto";
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    animate();

    const onScroll = () => {
      isUserScrollingRef.current = true;
      lastUserScrollTimeRef.current = Date.now();
      clearTimeout((window as any).scrollTimeout);
      (window as any).scrollTimeout = setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 150);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      updateResponsiveSceneScale(w / h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
      if ((window as any).scrollTimeout)
        clearTimeout((window as any).scrollTimeout);
      renderer.dispose();
      textureCacheRef.current.forEach((texture) => texture.dispose());
      textureCacheRef.current.clear();
      videoElementsRef.current.forEach((video) => {
        video.pause();
        video.src = "";
        video.load();
      });
      videoElementsRef.current.clear();
    };
  }, []);

  // Text entrance — delayed to let the startup fade reveal the scene first
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 24, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.4,
          ease: "power3.out",
          delay: 1.0, // after startup overlay has largely faded
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const scrollToInfoSections = () => {
    const target = document.getElementById("cinematic-transition");
    if (!target) return;
    const startY = window.scrollY;
    const targetY = target.getBoundingClientRect().top + window.scrollY - 24;
    const distance = targetY - startY;
    const duration = 1400;
    const start = performance.now();
    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(p);
      window.scrollTo(0, startY + distance * eased);
      if (p < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  return (
    <>
      <style>{`
        @keyframes heroScrollCuePulse {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50%       { transform: translateY(5px); opacity: 1; }
        }
        @keyframes sponsorFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sponsor-strip {
          animation: sponsorFadeIn 0.8s ease-out 0.4s both;
        }
        @keyframes sponsorMarquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .sponsor-marquee-track {
          animation: sponsorMarquee 18s linear infinite;
        }
        .sponsor-marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div
        ref={containerRef}
        className="relative w-full"
        style={{ height: "200vh", background: "#000" }}
      >
        <div
          className="sticky top-0 h-screen w-full overflow-hidden"
          style={{ background: "#000" }}
        >
          {/* Three.js canvas */}
          <div
            className={`absolute inset-0 w-full h-full overflow-hidden z-0 transition-[filter,transform] duration-300 ease-out ${
              isTeleprompterOpen ? "blur-sm scale-[1.01]" : "blur-0 scale-100"
            }`}
          >
            <canvas ref={canvasRef} className="w-full h-full block" />
          </div>

          {/* Cinema-style fade overlay — startup projector effect + scroll blackout.
              z:15 so it covers both canvas and text overlay during startup. */}
          <div
            ref={fadeOverlayRef}
            className="absolute inset-0 bg-black pointer-events-none"
            style={{ opacity: 1, zIndex: 15 }}
          />

          {/* Hero text + CTAs */}
          <div
            ref={textOverlayRef}
            className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          >
            <div
              ref={contentRef}
              className="text-center flex flex-col items-center max-w-4xl px-6 pointer-events-auto"
            >
              {/* Presented by tag */}
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "0.72rem",
                  letterSpacing: "0.18em",
                  color: "rgba(198,153,58,0.7)",
                  textTransform: "uppercase",
                  marginBottom: "1rem",
                }}
              >
                Give(a)Go{" "}
                <span style={{ color: "rgba(198,153,58,0.35)" }}>×</span> Napkin
              </div>

              <h1
                className="text-[2.5rem] sm:text-[3rem] md:text-[4rem] lg:text-[5rem] xl:text-[7rem] leading-[0.95] font-serif tracking-tight mb-4"
                style={{
                  color: "#E0D5C0",
                  textShadow:
                    "0 0 40px rgba(255,215,60,0.22), 0 4px 120px rgba(255,200,40,0.12), 0 -2px 60px rgba(255,230,100,0.08)",
                }}
              >
                <span className="block font-bold">AI Filmmaking</span>
                <span className="block italic font-light">
                  Hackathon{" "}
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontStyle: "normal",
                      fontWeight: 400,
                      fontSize: "0.38em",
                      verticalAlign: "super",
                      marginLeft: "0.15em",
                      color: "rgba(248,236,188,0.65)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    v2
                  </span>
                </span>
              </h1>

              <div className="flex items-center justify-center w-full sm:w-auto">
                <button
                  type="button"
                  onClick={scrollToInfoSections}
                  className="w-full sm:w-auto rounded-full px-6 py-3 md:px-8 md:py-3.5 text-sm font-medium hover:scale-105 transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-1"
                  style={{
                    background: "rgba(198,153,58,0.18)",
                    color: "rgba(248,236,188,0.95)",
                    border: "1px solid rgba(198,153,58,0.38)",
                  }}
                >
                  Apply to Join
                </button>
              </div>

              <button
                onClick={() => setIsTeleprompterOpen(true)}
                className="mt-4 text-sm font-medium underline underline-offset-4 hover:opacity-70 transition-opacity duration-300"
                style={{ color: "rgba(224,213,192,0.5)" }}
              >
                More about the event
              </button>

              <TeleprompterModal
                isOpen={isTeleprompterOpen}
                onClose={() => setIsTeleprompterOpen(false)}
                isDarkMode={false}
              />
            </div>
          </div>

          {/* Sponsor strip — z:20 keeps it above the startup fade overlay (z:15) */}
          <div
            className="sponsor-strip absolute left-0 right-0 bottom-0 pointer-events-none"
            style={{ zIndex: 20 }}
          >
            {/* Top fade */}
            <div
              style={{
                height: 56,
                background:
                  "linear-gradient(to bottom, transparent, rgba(0,0,0,0.88))",
              }}
            />
            {/* Bar */}
            <div
              style={{
                background: "rgba(0,0,0,0.88)",
                borderTop: "1px solid rgba(198,153,58,0.22)",
                padding: "12px 0 16px",
              }}
            >
              {/* Label */}
              <div
                style={{
                  textAlign: "center",
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.3em",
                  color: "rgba(198,153,58,0.6)",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}
              >
                Supported by
              </div>

              {(() => {
                const logos: {
                  src: string;
                  alt: string;
                  filter?: string;
                  scale: number;
                }[] = [
                  {
                    src: "/partners/elevenlabs-logo-white.svg",
                    alt: "ElevenLabs",
                    scale: 1,
                  },
                  { src: "/partners/wan.png", alt: "Wan", scale: 1 },
                  {
                    src: "/partners/fal-ai.svg",
                    alt: "fal.ai",
                    filter: "brightness(0) invert(1)",
                    scale: 1,
                  },
                  {
                    src: "/partners/wolfpack-digital-light.png",
                    alt: "Wolfpack Digital",
                    scale: 1.15,
                  },
                  { src: "/partners/redbull.png", alt: "Red Bull", scale: 1 },
                  {
                    src: "/partners/dogpatch-labs.png",
                    alt: "Dogpatch Labs",
                    filter: "brightness(0) invert(1)",
                    scale: 1,
                  },
                ];
                const LogoCell = ({
                  s,
                  borderRight,
                }: {
                  s: (typeof logos)[0];
                  borderRight: boolean;
                }) => (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 56,
                      padding: "8px 16px",
                      borderRight: borderRight
                        ? "1px solid rgba(198,153,58,0.14)"
                        : "none",
                    }}
                  >
                    <img
                      src={s.src}
                      alt={s.alt}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        width: "auto",
                        height: "auto",
                        objectFit: "contain",
                        opacity: 0.85,
                        display: "block",
                        transform:
                          s.scale !== 1 ? `scale(${s.scale})` : undefined,
                        filter: s.filter,
                      }}
                    />
                  </div>
                );
                return (
                  <>
                    {/* Desktop: single row of logos */}
                    <div
                      className="hidden sm:grid"
                      style={{
                        gridTemplateColumns: `repeat(${logos.length}, minmax(0, 1fr))`,
                        maxWidth: 1040,
                        margin: "0 auto",
                        padding: "0 1.5rem",
                      }}
                    >
                      {logos.map((s, i) => (
                        <LogoCell
                          key={s.alt}
                          s={s}
                          borderRight={i < logos.length - 1}
                        />
                      ))}
                    </div>
                    {/* Mobile: auto-scrolling marquee */}
                    <div
                      className="sm:hidden"
                      style={{
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {/* Left fade mask */}
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: 48,
                          background:
                            "linear-gradient(to right, rgba(0,0,0,0.88), transparent)",
                          zIndex: 2,
                          pointerEvents: "none",
                        }}
                      />
                      {/* Right fade mask */}
                      <div
                        style={{
                          position: "absolute",
                          right: 0,
                          top: 0,
                          bottom: 0,
                          width: 48,
                          background:
                            "linear-gradient(to left, rgba(0,0,0,0.88), transparent)",
                          zIndex: 2,
                          pointerEvents: "none",
                        }}
                      />
                      {/* Scrolling track — logos duplicated for seamless loop */}
                      <div
                        className="sponsor-marquee-track"
                        style={{
                          display: "flex",
                          width: "max-content",
                        }}
                      >
                        {[...logos, ...logos].map((s, i) => (
                          <div
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              height: 56,
                              width: 120,
                              padding: "8px 16px",
                              flexShrink: 0,
                            }}
                          >
                            <img
                              src={s.src}
                              alt={s.alt}
                              style={{
                                maxWidth: "100%",
                                maxHeight: "100%",
                                width: "auto",
                                height: "auto",
                                objectFit: "contain",
                                opacity: 0.85,
                                display: "block",
                                transform:
                                  s.scale !== 1
                                    ? `scale(${s.scale})`
                                    : undefined,
                                filter: s.filter,
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Scroll cue — fades once user starts scrolling */}
          <div
            ref={scrollCueRef}
            className="absolute pointer-events-none"
            style={{
              bottom: "6.5rem",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.55rem",
              zIndex: 12,
            }}
          >
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: "0.38rem",
                letterSpacing: "0.42em",
                color: "rgba(248,236,188,0.28)",
                textTransform: "uppercase",
              }}
            >
              Scroll
            </span>
            <div
              style={{
                width: 1,
                height: 40,
                background:
                  "linear-gradient(to bottom, rgba(248,236,188,0.35), transparent)",
                animation: "heroScrollCuePulse 2s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
