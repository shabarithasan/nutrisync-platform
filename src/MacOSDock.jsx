import React, { useState, useEffect, useRef, useCallback } from 'react';

const MacOSDock = ({ apps = [], openApps = [], onAppClick, className = '' }) => {
  const [currentScales, setCurrentScales] = useState([]);
  const [currentPositions, setCurrentPositions] = useState([]);
  const [mouseX, setMouseX] = useState(null);
  
  const dockRef = useRef(null);
  const iconRefs = useRef([]);
  const animationFrameRef = useRef(undefined);
  const lastMouseMoveTime = useRef(0);

  const getResponsiveConfig = useCallback(() => {
    if (typeof window === 'undefined') return { baseIconSize: 64, maxScale: 1.6, effectWidth: 240 };
    const smallerDimension = Math.min(window.innerWidth, window.innerHeight);
    if (smallerDimension < 480) return { baseIconSize: Math.max(40, smallerDimension * 0.08), maxScale: 1.4, effectWidth: smallerDimension * 0.4 };
    if (smallerDimension < 768) return { baseIconSize: Math.max(48, smallerDimension * 0.07), maxScale: 1.5, effectWidth: smallerDimension * 0.35 };
    if (smallerDimension < 1024) return { baseIconSize: Math.max(56, smallerDimension * 0.06), maxScale: 1.6, effectWidth: smallerDimension * 0.3 };
    return { baseIconSize: Math.max(64, Math.min(80, smallerDimension * 0.05)), maxScale: 1.8, effectWidth: 300 };
  }, []);

  const [config, setConfig] = useState(getResponsiveConfig);
  const { baseIconSize, maxScale, effectWidth } = config;
  const minScale = 1.0;
  const baseSpacing = Math.max(4, baseIconSize * 0.08);

  useEffect(() => {
    const handleResize = () => setConfig(getResponsiveConfig());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getResponsiveConfig]);

  const calculateTargetMagnification = useCallback((mousePosition) => {
    if (mousePosition === null) return apps.map(() => minScale);
    return apps.map((_, index) => {
      const normalIconCenter = (index * (baseIconSize + baseSpacing)) + (baseIconSize / 2);
      const minX = mousePosition - (effectWidth / 2);
      const maxX = mousePosition + (effectWidth / 2);
      if (normalIconCenter < minX || normalIconCenter > maxX) return minScale;
      const theta = ((normalIconCenter - minX) / effectWidth) * 2 * Math.PI;
      const cappedTheta = Math.min(Math.max(theta, 0), 2 * Math.PI);
      const scaleFactor = (1 - Math.cos(cappedTheta)) / 2;
      return minScale + (scaleFactor * (maxScale - minScale));
    });
  }, [apps, baseIconSize, baseSpacing, effectWidth, maxScale, minScale]);

  const calculatePositions = useCallback((scales) => {
    let currentX = 0;
    return scales.map((scale) => {
      const scaledWidth = baseIconSize * scale;
      const centerX = currentX + (scaledWidth / 2);
      currentX += scaledWidth + baseSpacing;
      return centerX;
    });
  }, [baseIconSize, baseSpacing]);

  useEffect(() => {
    const initialScales = apps.map(() => minScale);
    setCurrentScales(initialScales);
    setCurrentPositions(calculatePositions(initialScales));
  }, [apps, calculatePositions, minScale, config]);

  const animateToTarget = useCallback(() => {
    const targetScales = calculateTargetMagnification(mouseX);
    const targetPositions = calculatePositions(targetScales);
    const lerpFactor = mouseX !== null ? 0.2 : 0.12;

    setCurrentScales(prev => prev.map((curr, i) => curr + ((targetScales[i] - curr) * lerpFactor)));
    setCurrentPositions(prev => prev.map((curr, i) => curr + ((targetPositions[i] - curr) * lerpFactor)));

    const needsUpdate = currentScales.some((s, i) => Math.abs(s - targetScales[i]) > 0.002) || 
                        currentPositions.some((p, i) => Math.abs(p - targetPositions[i]) > 0.1);
    
    if (needsUpdate || mouseX !== null) {
      animationFrameRef.current = requestAnimationFrame(animateToTarget);
    }
  }, [mouseX, calculateTargetMagnification, calculatePositions, currentScales, currentPositions]);

  useEffect(() => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(animateToTarget);
    return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  }, [animateToTarget]);

  const handleMouseMove = useCallback((e) => {
    const now = performance.now();
    if (now - lastMouseMoveTime.current < 16) return;
    lastMouseMoveTime.current = now;
    if (dockRef.current) {
      const rect = dockRef.current.getBoundingClientRect();
      const padding = Math.max(8, baseIconSize * 0.12);
      setMouseX(e.clientX - rect.left - padding);
    }
  }, [baseIconSize]);

  const handleMouseLeave = useCallback(() => setMouseX(null), []);

  const handleAppClick = (appId, index) => {
    const el = iconRefs.current[index];
    if (el) {
      const bounceHeight = Math.max(-12, -baseIconSize * 0.25);
      el.style.transition = 'transform 0.2s ease-out';
      el.style.transform = `translateY(${bounceHeight}px)`;
      setTimeout(() => el.style.transform = 'translateY(0px)', 200);
    }
    onAppClick(appId);
  };

  const contentWidth = currentPositions.length > 0 
    ? Math.max(...currentPositions.map((pos, i) => pos + (baseIconSize * currentScales[i]) / 2))
    : (apps.length * (baseIconSize + baseSpacing)) - baseSpacing;
  const padding = Math.max(8, baseIconSize * 0.12);

  return (
    <div 
      ref={dockRef}
      className={`macos-dock ${className}`}
      style={{
        width: `${contentWidth + padding * 2}px`,
        height: `${baseIconSize + padding * 2}px`,
        background: 'var(--card)',
        backdropFilter: 'blur(24px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
        borderRadius: `${Math.max(16, baseIconSize * 0.5)}px`,
        border: '1px solid var(--line)',
        boxShadow: `0 8px 24px rgba(0, 0, 0, 0.08)`,
        padding: `${padding}px`,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transition: 'background 0.3s'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        style={{
          position: 'relative',
          height: `${baseIconSize}px`,
          width: '100%'
        }}
      >
        {apps.map((app, index) => {
          const scale = currentScales[index];
          const position = currentPositions[index] || 0;
          const scaledSize = baseIconSize * scale;
          
          return (
            <div
              key={app.id}
              ref={(el) => { iconRefs.current[index] = el; }}
              title={app.name}
              onClick={() => handleAppClick(app.id, index)}
              style={{
                position: 'absolute',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                left: `${position - scaledSize / 2}px`,
                bottom: '0px',
                width: `${scaledSize}px`,
                height: `${scaledSize}px`,
                transformOrigin: 'center bottom',
                zIndex: Math.round(scale * 10)
              }}
            >
              <img
                src={app.icon}
                alt={app.name}
                width={scaledSize}
                height={scaledSize}
                style={{
                  objectFit: 'contain',
                  filter: `drop-shadow(0 4px 6px rgba(0,0,0,0.2))`
                }}
              />
              {openApps.includes(app.id) && (
                <div 
                  style={{
                    position: 'absolute',
                    bottom: `${Math.min(-4, -baseIconSize * 0.1)}px`,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: `${Math.max(4, baseIconSize * 0.06)}px`,
                    height: `${Math.max(4, baseIconSize * 0.06)}px`,
                    borderRadius: '50%',
                    backgroundColor: 'var(--brand)',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MacOSDock;
