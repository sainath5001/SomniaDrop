'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Plinkoo3DProps {
  pattern: number[];
  outcome: number;
  onAnimationComplete?: (outcome: number) => void;
  isPlaying: boolean;
}

export function Plinkoo3D({ pattern, outcome, onAnimationComplete, isPlaying }: Plinkoo3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    ball: THREE.Mesh | null;
    obstacles: THREE.Mesh[];
    sinks: THREE.Mesh[];
    animationId: number | null;
    currentDrop: number;
    ballVelocity: THREE.Vector3;
    patternCopy: number[];
    animationRunning: boolean;
    outcome: number;
    onAnimationComplete?: (outcome: number) => void;
  } | null>(null);

  // Initialize scene once (only on mount)
  useEffect(() => {
    if (!mountRef.current || sceneRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f9ff);
    
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 15);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    // Create obstacles (3D pins) - always visible
    const obstacles: THREE.Mesh[] = [];
    const rows = 8;
    const cols = 9;
    const spacing = 1.2;
    const startX = -(cols - 1) * spacing / 2;

    for (let row = 0; row < rows; row++) {
      const offset = row % 2 === 0 ? 0 : spacing / 2;
      for (let col = 0; col < cols - (row % 2); col++) {
        const geometry = new THREE.CylinderGeometry(0.15, 0.15, 0.3, 16);
        const material = new THREE.MeshStandardMaterial({ 
          color: 0x64748b,
          metalness: 0.3,
          roughness: 0.4
        });
        const obstacle = new THREE.Mesh(geometry, material);
        obstacle.position.set(
          startX + col * spacing + offset,
          -row * spacing + 3,
          0
        );
        scene.add(obstacle);
        obstacles.push(obstacle);
      }
    }

    // Create sinks (3D slots) - always visible
    const sinks: THREE.Mesh[] = [];
    const numSinks = 17;
    const sinkWidth = 0.6;
    const startSinkX = -(numSinks - 1) * sinkWidth / 2;

    for (let i = 0; i < numSinks; i++) {
      const geometry = new THREE.BoxGeometry(sinkWidth, 0.5, 0.3);
      const material = new THREE.MeshStandardMaterial({ 
        color: 0x1e293b,
        metalness: 0.2,
        roughness: 0.6
      });
      const sink = new THREE.Mesh(geometry, material);
      sink.position.set(startSinkX + i * sinkWidth, -8, 0);
      scene.add(sink);
      sinks.push(sink);
    }

    // Animation variables
    let ball: THREE.Mesh | null = null;
    let ballVelocity = new THREE.Vector3(0, -0.05, 0);
    let currentDrop = 0;
    let patternCopy: number[] = [];
    let animationRunning = true;

    // Animation loop
    const animate = () => {
      if (!sceneRef.current) return;
      
      const { scene, camera, renderer, obstacles, sinks } = sceneRef.current;
      const ball = sceneRef.current.ball;
      let ballVelocity = sceneRef.current.ballVelocity;
      let currentDrop = sceneRef.current.currentDrop;
      const patternCopy = sceneRef.current.patternCopy;
      
      // Update ball physics (only if ball exists)
      if (ball && sceneRef.current.animationRunning) {
        ballVelocity.y -= 0.01; // Gravity
        
        // Apply pattern-based direction
        const obstacleY = 3;
        if (ball.position.y < obstacleY && ball.position.y > -8 && currentDrop < patternCopy.length) {
          const direction = patternCopy[currentDrop] === 1 ? 1 : -1;
          ballVelocity.x += direction * 0.02;
          currentDrop++;
          sceneRef.current.currentDrop = currentDrop;
        }

        // Update ball position
        ball.position.add(ballVelocity);
        sceneRef.current.ballVelocity = ballVelocity;

        // Collision with obstacles
        for (const obstacle of obstacles) {
          const distance = ball.position.distanceTo(obstacle.position);
          if (distance < 0.35) {
            const direction = new THREE.Vector3()
              .subVectors(ball.position, obstacle.position)
              .normalize();
            ballVelocity.reflect(direction);
            ballVelocity.multiplyScalar(0.8);
            ball.position.add(direction.multiplyScalar(0.1));
          }
        }

        // Boundary collision
        if (Math.abs(ball.position.x) > 5) {
          ballVelocity.x *= -0.8;
          ball.position.x = Math.max(-5, Math.min(5, ball.position.x));
        }

        // Friction
        ballVelocity.x *= 0.99;

        // Rotate ball for visual effect
        ball.rotation.x += 0.1;
        ball.rotation.y += 0.1;

        // Check if ball reached bottom
        if (ball.position.y < -7.5) {
          // Remove ball from scene
          scene.remove(ball);
          ball.geometry.dispose();
          (ball.material as THREE.Material).dispose();
          sceneRef.current.ball = null;
          sceneRef.current.animationRunning = false;
          if (sceneRef.current.onAnimationComplete) {
            setTimeout(() => sceneRef.current!.onAnimationComplete!(sceneRef.current!.outcome), 100);
          }
          renderer.render(scene, camera);
          requestAnimationFrame(animate);
          return;
        }

        // Camera follow ball (smooth)
        camera.position.x += (ball.position.x * 0.3 - camera.position.x) * 0.05;
        camera.position.y += (ball.position.y * 0.3 - camera.position.y) * 0.05;
        camera.lookAt(ball.position);
      } else {
        // Reset camera when no ball
        camera.position.x += (0 - camera.position.x) * 0.05;
        camera.position.y += (0 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);
      }

      // Rotate obstacles slightly for motion
      obstacles.forEach((obs, i) => {
        obs.rotation.y += 0.01 * (i % 2 === 0 ? 1 : -1);
      });

      // Animate winning sink
      const currentOutcome = sceneRef.current.outcome;
      if (currentOutcome >= 0 && currentOutcome < sinks.length) {
        const winningSink = sinks[currentOutcome];
        if (winningSink.material instanceof THREE.MeshStandardMaterial) {
          winningSink.material.emissive = new THREE.Color(0x10b981);
          winningSink.material.emissiveIntensity = 0.5 + Math.sin(Date.now() * 0.005) * 0.3;
        }
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);
    
    sceneRef.current = {
      scene,
      camera,
      renderer,
      ball: null,
      obstacles,
      sinks,
      animationId,
      currentDrop: 0,
      ballVelocity: new THREE.Vector3(0, -0.05, 0),
      patternCopy: [],
      animationRunning: true,
      outcome: outcome,
      onAnimationComplete: onAnimationComplete
    };

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !sceneRef.current) return;
      const { camera, renderer } = sceneRef.current;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current?.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId);
      }
      if (mountRef.current && sceneRef.current?.renderer.domElement) {
        if (mountRef.current.contains(sceneRef.current.renderer.domElement)) {
          mountRef.current.removeChild(sceneRef.current.renderer.domElement);
        }
      }
      if (sceneRef.current) {
        sceneRef.current.renderer.dispose();
        // Clean up ball if exists
        if (sceneRef.current.ball) {
          sceneRef.current.scene.remove(sceneRef.current.ball);
          sceneRef.current.ball.geometry.dispose();
          (sceneRef.current.ball.material as THREE.Material).dispose();
        }
      }
      sceneRef.current = null;
    };
  }, []); // Only run once on mount

  // Handle ball creation/removal when isPlaying changes
  useEffect(() => {
    if (!sceneRef.current) return;

    const { scene } = sceneRef.current;

    // Remove existing ball if any
    if (sceneRef.current.ball) {
      scene.remove(sceneRef.current.ball);
      sceneRef.current.ball.geometry.dispose();
      (sceneRef.current.ball.material as THREE.Material).dispose();
      sceneRef.current.ball = null;
    }

    // Create ball if playing
    if (isPlaying && pattern.length > 0) {
      const ballGeometry = new THREE.SphereGeometry(0.2, 16, 16);
      const ballMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x3b82f6,
        metalness: 0.5,
        roughness: 0.3,
        emissive: 0x1e40af,
        emissiveIntensity: 0.3
      });
      const ball = new THREE.Mesh(ballGeometry, ballMaterial);
      ball.position.set(0, 5, 0);
      scene.add(ball);
      
      // Reset animation state
      sceneRef.current.ball = ball;
      sceneRef.current.ballVelocity = new THREE.Vector3(0, -0.05, 0);
      sceneRef.current.currentDrop = 0;
      sceneRef.current.patternCopy = [...pattern];
      sceneRef.current.animationRunning = true;
    }
  }, [isPlaying, pattern]);

  // Update outcome for sink highlighting
  useEffect(() => {
    if (!sceneRef.current) return;
    
    const { sinks } = sceneRef.current;
    sceneRef.current.outcome = outcome;
    sceneRef.current.onAnimationComplete = onAnimationComplete;
    
    // Reset all sinks
    sinks.forEach((sink, i) => {
      if (sink.material instanceof THREE.MeshStandardMaterial) {
        sink.material.color.setHex(i === outcome ? 0x10b981 : 0x1e293b);
        sink.material.emissive.setHex(0x000000);
        sink.material.emissiveIntensity = 0;
      }
    });
  }, [outcome, onAnimationComplete]);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-[600px] rounded-lg overflow-hidden shadow-2xl bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800"
      style={{ minHeight: '600px' }}
    />
  );
}

