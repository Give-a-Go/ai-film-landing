import React, { useRef, useLayoutEffect, useEffect, useState } from "react";
import gsap from "gsap";
import * as THREE from "three";
import WaitlistMorph from "./WaitlistMorph";
import TeleprompterModal from "./TeleprompterModal";

interface HeroProps {
  isDarkMode: boolean;
}

const Hero: React.FC<HeroProps> = ({ isDarkMode }) => {
  const [isTeleprompterOpen, setIsTeleprompterOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Store refs for cleanup and animation
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const segmentsRef = useRef<THREE.Group[]>([]);
  const scrollPosRef = useRef(0);
  const autoScrollSpeedRef = useRef(0.1); // Slow auto-scroll speed
  const isUserScrollingRef = useRef(false);
  const lastUserScrollTimeRef = useRef(0);
  
  // Texture cache for performance - load each texture only once
  const textureLoaderRef = useRef<THREE.TextureLoader>(new THREE.TextureLoader());
  const textureCacheRef = useRef<Map<string, THREE.Texture>>(new Map());

  // --- CONFIGURATION ---
  // Tuned to match the reference design's density and scale
  const TUNNEL_WIDTH = 37.5;
  const TUNNEL_HEIGHT = 25.0;
  const SEGMENT_DEPTH = 6; // Short depth for "square-ish" floor tiles
  const NUM_SEGMENTS = 8; // Reduced from 14 for faster initial load
  const FOG_DENSITY = 0.02;

  // Grid Divisions
  const FLOOR_COLS = 6; // Number of columns on floor/ceiling
  const WALL_ROWS = 4; // Number of rows on walls

  // Derived dimensions
  const COL_WIDTH = TUNNEL_WIDTH / FLOOR_COLS;
  const ROW_HEIGHT = TUNNEL_HEIGHT / WALL_ROWS;

  // Optimized local images from public/images-optimized folder
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

  // Helper: Create a segment with grid lines and filled cells
  const createSegment = (zPos: number) => {
    const group = new THREE.Group();
    group.position.z = zPos;

    const w = TUNNEL_WIDTH / 2;
    const h = TUNNEL_HEIGHT / 2;
    const d = SEGMENT_DEPTH;

    // --- 1. Grid Lines ---
    // Start with purple accent colors; these will be updated by useEffect immediately on mount
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x7c3aed,
      transparent: true,
      opacity: 0.5,
    });
    const lineGeo = new THREE.BufferGeometry();
    const vertices: number[] = [];

    // A. Longitudinal Lines (Z-axis)
    // Floor & Ceiling (varying X)
    for (let i = 0; i <= FLOOR_COLS; i++) {
      const x = -w + i * COL_WIDTH;
      // Floor line
      vertices.push(x, -h, 0, x, -h, -d);
      // Ceiling line
      vertices.push(x, h, 0, x, h, -d);
    }
    // Walls (varying Y) - excluding top/bottom corners already drawn
    for (let i = 1; i < WALL_ROWS; i++) {
      const y = -h + i * ROW_HEIGHT;
      // Left Wall line
      vertices.push(-w, y, 0, -w, y, -d);
      // Right Wall line
      vertices.push(w, y, 0, w, y, -d);
    }

    // B. Latitudinal Lines (Ring at z=0)
    // Floor (Bottom edge)
    vertices.push(-w, -h, 0, w, -h, 0);
    // Ceiling (Top edge)
    vertices.push(-w, h, 0, w, h, 0);
    // Left Wall (Left edge)
    vertices.push(-w, -h, 0, -w, h, 0);
    // Right Wall (Right edge)
    vertices.push(w, -h, 0, w, h, 0);

    lineGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3),
    );
    const lines = new THREE.LineSegments(lineGeo, lineMaterial);
    group.add(lines);

    // Initial population of images
    populateImages(group, w, h, d);

    return group;
  };

  // Helper: Populate images in a segment with texture caching and optimization
  const populateImages = (
    group: THREE.Group,
    w: number,
    h: number,
    d: number,
  ) => {
    const cellMargin = 0.4;

    const addImg = (
      pos: THREE.Vector3,
      rot: THREE.Euler,
      wd: number,
      ht: number,
    ) => {
      const url = imageUrls[Math.floor(Math.random() * imageUrls.length)];
      const mat = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      });
      
      // Helper function to create mesh with proper aspect ratio
      const createMeshWithTexture = (tex: THREE.Texture) => {
        // Ensure image is loaded and has dimensions
        if (!tex.image || !tex.image.width || !tex.image.height) {
          // Fallback to cell dimensions if image not ready
          const geom = new THREE.PlaneGeometry(wd - cellMargin, ht - cellMargin);
          const m = new THREE.Mesh(geom, mat);
          m.position.copy(pos);
          m.rotation.copy(rot);
          m.name = "slab_image";
          group.add(m);
          return;
        }
        
        // Get texture aspect ratio
        const texAspect = tex.image.width / tex.image.height;
        const cellAspect = wd / ht;
        
        // Calculate dimensions that maintain image aspect ratio while fitting in cell
        let finalWidth = wd - cellMargin;
        let finalHeight = ht - cellMargin;
        
        if (texAspect > cellAspect) {
          // Image is wider than cell - fit to width
          finalHeight = finalWidth / texAspect;
        } else {
          // Image is taller than cell - fit to height
          finalWidth = finalHeight * texAspect;
        }
        
        const geom = new THREE.PlaneGeometry(finalWidth, finalHeight);
        const m = new THREE.Mesh(geom, mat);
        m.position.copy(pos);
        m.rotation.copy(rot);
        m.name = "slab_image";
        group.add(m);
      };
      
      // Check cache first, then load if not cached
      const cachedTexture = textureCacheRef.current.get(url);
      if (cachedTexture) {
        // Use cached texture immediately
        mat.map = cachedTexture;
        mat.needsUpdate = true;
        createMeshWithTexture(cachedTexture);
        gsap.to(mat, { opacity: 0.85, duration: 0.5 });
      } else {
        // Load texture and cache it
        textureLoaderRef.current.load(url, (tex) => {
          // Optimize texture settings for performance
          tex.minFilter = THREE.LinearFilter;
          tex.magFilter = THREE.LinearFilter;
          tex.generateMipmaps = false; // Skip mipmaps for better performance
          tex.encoding = THREE.sRGBEncoding;
          
          // Cache the texture for reuse
          textureCacheRef.current.set(url, tex);
          
          mat.map = tex;
          mat.needsUpdate = true;
          createMeshWithTexture(tex);
          gsap.to(mat, { opacity: 0.85, duration: 1 });
        });
      }
    };

    // Logic: Iterate slots, but skip if the previous slot was filled.
    // Threshold adjusted to 0.80 (20%) to compensate for skipped slots and maintain density.

    // Floor
    let lastFloorIdx = -999;
    for (let i = 0; i < FLOOR_COLS; i++) {
      // Must be at least 2 slots away from last image to avoid adjacency (i > last + 1)
      if (i > lastFloorIdx + 1) {
        if (Math.random() > 0.8) {
          addImg(
            new THREE.Vector3(-w + i * COL_WIDTH + COL_WIDTH / 2, -h, -d / 2),
            new THREE.Euler(-Math.PI / 2, 0, 0),
            COL_WIDTH,
            d,
          );
          lastFloorIdx = i;
        }
      }
    }

    // Ceiling
    let lastCeilIdx = -999;
    for (let i = 0; i < FLOOR_COLS; i++) {
      if (i > lastCeilIdx + 1) {
        if (Math.random() > 0.88) {
          // Keep ceiling sparser
          addImg(
            new THREE.Vector3(-w + i * COL_WIDTH + COL_WIDTH / 2, h, -d / 2),
            new THREE.Euler(Math.PI / 2, 0, 0),
            COL_WIDTH,
            d,
          );
          lastCeilIdx = i;
        }
      }
    }

    // Left Wall
    let lastLeftIdx = -999;
    for (let i = 0; i < WALL_ROWS; i++) {
      if (i > lastLeftIdx + 1) {
        if (Math.random() > 0.8) {
          addImg(
            new THREE.Vector3(-w, -h + i * ROW_HEIGHT + ROW_HEIGHT / 2, -d / 2),
            new THREE.Euler(0, Math.PI / 2, 0),
            d,
            ROW_HEIGHT,
          );
          lastLeftIdx = i;
        }
      }
    }

    // Right Wall
    let lastRightIdx = -999;
    for (let i = 0; i < WALL_ROWS; i++) {
      if (i > lastRightIdx + 1) {
        if (Math.random() > 0.8) {
          addImg(
            new THREE.Vector3(w, -h + i * ROW_HEIGHT + ROW_HEIGHT / 2, -d / 2),
            new THREE.Euler(0, -Math.PI / 2, 0),
            d,
            ROW_HEIGHT,
          );
          lastRightIdx = i;
        }
      }
    }
  };

  // --- INITIAL SETUP ---
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // THREE JS SETUP
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Generate segments
    const segments: THREE.Group[] = [];
    for (let i = 0; i < NUM_SEGMENTS; i++) {
      const z = -i * SEGMENT_DEPTH;
      const segment = createSegment(z);
      scene.add(segment);
      segments.push(segment);
    }
    segmentsRef.current = segments;

    // Animation Loop
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!cameraRef.current || !sceneRef.current || !rendererRef.current)
        return;

      // Auto-scroll: slowly increment scroll position when user is not actively scrolling
      const now = Date.now();
      const timeSinceLastScroll = now - lastUserScrollTimeRef.current;
      
      // If user hasn't scrolled in the last 100ms, enable auto-scroll
      if (timeSinceLastScroll > 100 && !isUserScrollingRef.current) {
        scrollPosRef.current += autoScrollSpeedRef.current;
      }

      const targetZ = -scrollPosRef.current * 0.05;
      const currentZ = cameraRef.current.position.z;
      cameraRef.current.position.z += (targetZ - currentZ) * 0.1;

      // Bidirectional Infinite Logic
      const tunnelLength = NUM_SEGMENTS * SEGMENT_DEPTH;

      const camZ = cameraRef.current.position.z;

      segmentsRef.current.forEach((segment) => {
        // 1. Moving Forward
        if (segment.position.z > camZ + SEGMENT_DEPTH) {
          let minZ = 0;
          segmentsRef.current.forEach(
            (s) => (minZ = Math.min(minZ, s.position.z)),
          );
          segment.position.z = minZ - SEGMENT_DEPTH;

          // Re-populate
          const toRemove: THREE.Object3D[] = [];
          segment.traverse((c) => {
            if (c.name === "slab_image") toRemove.push(c);
          });
          toRemove.forEach((c) => {
            segment.remove(c);
            if (c instanceof THREE.Mesh) {
              c.geometry.dispose();
              if (c.material.map) c.material.map.dispose();
              c.material.dispose();
            }
          });
          const w = TUNNEL_WIDTH / 2;
          const h = TUNNEL_HEIGHT / 2;
          const d = SEGMENT_DEPTH;
          populateImages(segment, w, h, d);
        }

        // 2. Moving Backward
        if (segment.position.z < camZ - tunnelLength - SEGMENT_DEPTH) {
          let maxZ = -999999;
          segmentsRef.current.forEach(
            (s) => (maxZ = Math.max(maxZ, s.position.z)),
          );
          segment.position.z = maxZ + SEGMENT_DEPTH;

          // Re-populate
          const toRemove: THREE.Object3D[] = [];
          segment.traverse((c) => {
            if (c.name === "slab_image") toRemove.push(c);
          });
          toRemove.forEach((c) => {
            segment.remove(c);
            if (c instanceof THREE.Mesh) {
              c.geometry.dispose();
              if (c.material.map) c.material.map.dispose();
              c.material.dispose();
            }
          });
          const w = TUNNEL_WIDTH / 2;
          const h = TUNNEL_HEIGHT / 2;
          const d = SEGMENT_DEPTH;
          populateImages(segment, w, h, d);
        }
      });

      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };
    animate();

    const onScroll = () => {
      isUserScrollingRef.current = true;
      lastUserScrollTimeRef.current = Date.now();
      scrollPosRef.current = window.scrollY;
      
      // Reset user scrolling flag after scroll ends
      clearTimeout((window as any).scrollTimeout);
      (window as any).scrollTimeout = setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 150);
    };
    window.addEventListener("scroll", onScroll);
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
      if ((window as any).scrollTimeout) {
        clearTimeout((window as any).scrollTimeout);
      }
      renderer.dispose();
      
      // Clean up texture cache
      textureCacheRef.current.forEach((texture) => {
        texture.dispose();
      });
      textureCacheRef.current.clear();
    };
  }, []); // Run once on mount

  // --- THEME UPDATE EFFECT ---
  useEffect(() => {
    if (!sceneRef.current) return;

    // Define theme colors
    const bgHex = isDarkMode ? 0x050505 : 0xffffff;
    const fogHex = isDarkMode ? 0x050505 : 0xffffff;

    // Purple accent for grid lines (matching purple theme)
    const lineHex = isDarkMode ? 0x9333ea : 0x7c3aed; // Purple-600 and Purple-700
    const lineOp = isDarkMode ? 0.4 : 0.5;

    // Apply to scene
    sceneRef.current.background = new THREE.Color(bgHex);
    if (sceneRef.current.fog) {
      (sceneRef.current.fog as THREE.FogExp2).color.setHex(fogHex);
    }

    // Apply to existing grid lines
    segmentsRef.current.forEach((segment) => {
      segment.children.forEach((child) => {
        if (child instanceof THREE.LineSegments) {
          const mat = child.material as THREE.LineBasicMaterial;
          mat.color.setHex(lineHex);
          mat.opacity = lineOp;
          mat.needsUpdate = true;
        }
      });
    });
  }, [isDarkMode]);

  // Text Entrance Animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          delay: 0.5,
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[10000vh] transition-colors duration-700 ${isDarkMode ? "bg-[#050505]" : "bg-white"}`}
    >
      <div
        className={`fixed inset-0 w-full h-full overflow-hidden z-0 transition-[filter,transform] duration-300 ease-out ${
          isTeleprompterOpen ? "blur-sm scale-[1.01]" : "blur-0 scale-100"
        }`}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      <div className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div
          ref={contentRef}
          className="text-center flex flex-col items-center max-w-4xl px-6 pointer-events-auto mix-blend-multiply-normal"
        >
          <h1
            className={`text-[2.5rem] sm:text-[3rem] md:text-[4rem] lg:text-[5rem] leading-[0.95] font-serif tracking-tight mb-4 transition-colors duration-500 ${isDarkMode ? "text-white" : "text-dark"}`}
          >
            <span className="block font-bold">AI Film Making</span>
            <span className="block italic font-light">
              Hackathon{" "}
              <span className="text-[1.25rem] sm:text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] font-light align-baseline ml-1">
                v2
              </span>
            </span>
          </h1>

          <p
            className={`text-lg md:text-xl font-normal mb-8 transition-colors duration-500 ${isDarkMode ? "text-gray-400" : "text-muted"}`}
          >
            Dublin &nbsp;•&nbsp; Late March
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <WaitlistMorph isDarkMode={isDarkMode} />
            <a
              href="https://giveago.co/sponsor"
              className={`w-full sm:w-auto rounded-full px-6 py-3 md:px-8 md:py-3.5 text-sm font-medium hover:scale-105 transition-all duration-300 whitespace-nowrap flex items-center justify-center gap-1 ${isDarkMode ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
            >
              Sponsor <span>→</span>
            </a>
          </div>

          <button
            onClick={() => setIsTeleprompterOpen(true)}
            className={`mt-4 text-sm font-medium underline underline-offset-4 hover:opacity-70 transition-opacity duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            More about the event
          </button>

          <TeleprompterModal
            isOpen={isTeleprompterOpen}
            onClose={() => setIsTeleprompterOpen(false)}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
