import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import { GameProgress } from '../store/gameStore';

interface ColoringBookProps {
  progress: GameProgress;
  onBack: () => void;
  onComplete: (stars: number) => void;
}

const COLORS = [
  { color: '#ef4444', name: 'Red' },
  { color: '#f97316', name: 'Orange' },
  { color: '#eab308', name: 'Yellow' },
  { color: '#22c55e', name: 'Green' },
  { color: '#14b8a6', name: 'Teal' },
  { color: '#3b82f6', name: 'Blue' },
  { color: '#8b5cf6', name: 'Purple' },
  { color: '#ec4899', name: 'Pink' },
  { color: '#f59e0b', name: 'Amber' },
  { color: '#6366f1', name: 'Indigo' },
  { color: '#92400e', name: 'Brown' },
  { color: '#64748b', name: 'Gray' },
  { color: '#000000', name: 'Black' },
  { color: '#ffffff', name: 'White' },
];

const BRUSH_SIZES = [
  { size: 6, label: 'S' },
  { size: 12, label: 'M' },
  { size: 20, label: 'L' },
  { size: 30, label: 'XL' },
];

const TEMPLATES = [
  { id: 'star', name: 'Star', emoji: '⭐' },
  { id: 'heart', name: 'Heart', emoji: '❤️' },
  { id: 'flower', name: 'Flower', emoji: '🌸' },
  { id: 'sun', name: 'Sun', emoji: '☀️' },
  { id: 'tree', name: 'Tree', emoji: '🌳' },
  { id: 'house', name: 'House', emoji: '🏠' },
  { id: 'butterfly', name: 'Butterfly', emoji: '🦋' },
  { id: 'fish', name: 'Fish', emoji: '🐟' },
  { id: 'cat', name: 'Cat', emoji: '🐱' },
  { id: 'cupcake', name: 'Cupcake', emoji: '🧁' },
];

const ColoringBook: React.FC<ColoringBookProps> = ({ progress, onBack, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const outlineCanvasRef = useRef<HTMLCanvasElement>(null); // Separate outline layer
  const [selectedColor, setSelectedColor] = useState(COLORS[0].color);
  const [brushSize, setBrushSize] = useState(BRUSH_SIZES[1].size);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isEraser, setIsEraser] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // Draw the black outline on separate canvas layer
  const drawOutline = useCallback(() => {
    const canvas = outlineCanvasRef.current;
    if (!canvas || !selectedTemplate) return;

    const container = canvas.parentElement;
    if (!container) return;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const template = TEMPLATES.find(t => t.id === selectedTemplate);
    if (!template) return;

    // Draw emoji as BLACK OUTLINE
    const size = Math.min(canvas.width, canvas.height) * 0.75;
    ctx.font = `${size}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Create black silhouette
    ctx.fillStyle = '#000000';
    ctx.fillText(template.emoji, canvas.width / 2, canvas.height / 2);

    // Extract only the outline using image data manipulation
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = canvas.width;
    const height = canvas.height;
    
    // Create a copy for outline detection
    const outlineData = new Uint8ClampedArray(data.length);
    
    // Simple edge detection - find edges of the black shape
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        const alpha = data[idx + 3];
        
        // Check surrounding pixels
        const topAlpha = data[((y - 1) * width + x) * 4 + 3];
        const bottomAlpha = data[((y + 1) * width + x) * 4 + 3];
        const leftAlpha = data[(y * width + x - 1) * 4 + 3];
        const rightAlpha = data[(y * width + x + 1) * 4 + 3];
        
        // If this pixel is opaque and any neighbor is transparent = edge
        const isEdge = alpha > 128 && (
          topAlpha < 128 || bottomAlpha < 128 || 
          leftAlpha < 128 || rightAlpha < 128
        );
        
        if (isEdge) {
          // Make edge black and thick
          for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
              const eIdx = ((y + dy) * width + (x + dx)) * 4;
              if (eIdx >= 0 && eIdx < outlineData.length) {
                outlineData[eIdx] = 0;
                outlineData[eIdx + 1] = 0;
                outlineData[eIdx + 2] = 0;
                outlineData[eIdx + 3] = 255;
              }
            }
          }
        }
      }
    }
    
    // Clear canvas and draw only the outline
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const outlineImageData = new ImageData(outlineData, width, height);
    ctx.putImageData(outlineImageData, 0, 0);
  }, [selectedTemplate]);

  // Initialize coloring canvas (white background)
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    initCanvas();
    drawOutline();
    
    const handleResize = () => {
      initCanvas();
      drawOutline();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initCanvas, drawOutline]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getPos(e);
    lastPos.current = pos;

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.arc(pos.x, pos.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = isEraser ? '#ffffff' : selectedColor;
    ctx.fill();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !lastPos.current) return;

    const pos = getPos(e);

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = isEraser ? '#ffffff' : selectedColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    lastPos.current = pos;
  };

  const stopDraw = () => {
    setIsDrawing(false);
    lastPos.current = null;
  };

  const clearCanvas = () => {
    if (confirm('Clear the drawing? 🎨')) {
      initCanvas();
    }
  };

  if (!selectedTemplate) {
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col">
          <Navigation title="🎨 Coloring Book" onBack={onBack} stars={progress.stars} />
          <div className="flex-1 flex flex-col items-center justify-center px-4 overflow-y-auto py-4">
            <motion.h2
              className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center"
              style={{ fontFamily: "'Bubblegum One', cursive" }}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              Pick a picture to color! 🖌️
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl w-full">
              {TEMPLATES.map((t, i) => (
                <motion.button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 text-center shadow-lg border-4 border-white"
                  style={{
                    boxShadow: '0 6px 0 rgba(139, 92, 246, 0.4), 0 8px 20px rgba(0,0,0,0.1)',
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ 
                    scale: 0.95, 
                    y: 4,
                    boxShadow: '0 2px 0 rgba(139, 92, 246, 0.4), 0 4px 10px rgba(0,0,0,0.1)'
                  }}
                >
                  <span className="text-6xl md:text-7xl block mb-2">{t.emoji}</span>
                  <span 
                    className="text-lg font-bold text-gray-700"
                    style={{ fontFamily: "'Bubblegum One', cursive" }}
                  >
                    {t.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </GameBackground>
    );
  }

  const template = TEMPLATES.find(t => t.id === selectedTemplate);

  return (
    <GameBackground variant="game">
      <div className="h-full flex flex-col">
        <Navigation
          title={`🎨 ${template?.name}`}
          onBack={() => { setSelectedTemplate(null); onComplete(3); }}
          stars={progress.stars}
        />

        {/* Canvas area with TWO layers */}
        <div className="flex-1 mx-3 mb-3 bg-white rounded-3xl shadow-xl overflow-hidden relative border-4 border-white">
          {/* Coloring layer (bottom) */}
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-crosshair touch-none block absolute inset-0"
            style={{ zIndex: 1 }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={stopDraw}
          />
          {/* Outline layer (top, non-interactive) */}
          <canvas
            ref={outlineCanvasRef}
            className="w-full h-full absolute inset-0 pointer-events-none"
            style={{ zIndex: 2 }}
          />
        </div>

        {/* Toolbar */}
        <div className="px-3 pb-3">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl p-4 shadow-2xl border-4 border-white">
            
            {/* Color Palette */}
            <div className="mb-4">
              <p 
                className="text-sm font-bold text-gray-600 mb-2 text-center"
                style={{ fontFamily: "'Bubblegum One', cursive" }}
              >
                🎨 Choose a Color
              </p>
              <div className="flex items-center gap-2 overflow-x-auto pb-2 justify-center flex-wrap">
                {COLORS.map((colorObj) => (
                  <motion.button
                    key={colorObj.color}
                    onClick={() => { setSelectedColor(colorObj.color); setIsEraser(false); }}
                    className={`rounded-full flex-shrink-0 border-4 transition-all shadow-md ${
                      selectedColor === colorObj.color && !isEraser 
                        ? 'border-gray-800 scale-125 ring-4 ring-offset-2 ring-yellow-300' 
                        : 'border-white'
                    }`}
                    style={{ 
                      backgroundColor: colorObj.color,
                      width: '44px',
                      height: '44px',
                    }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    title={colorObj.name}
                  />
                ))}
              </div>
            </div>

            {/* Brush Sizes */}
            <div className="mb-4">
              <p 
                className="text-sm font-bold text-gray-600 mb-2 text-center"
                style={{ fontFamily: "'Bubblegum One', cursive" }}
              >
                ✏️ Brush Size
              </p>
              <div className="flex items-center justify-center gap-3">
                {BRUSH_SIZES.map(({ size, label }) => (
                  <motion.button
                    key={size}
                    onClick={() => setBrushSize(size)}
                    className={`rounded-2xl flex items-center justify-center transition-all font-bold border-4 ${
                      brushSize === size 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-white shadow-lg scale-110' 
                        : 'bg-gray-100 text-gray-600 border-gray-200'
                    }`}
                    style={{ 
                      minWidth: '55px',
                      minHeight: '55px',
                      fontFamily: "'Bubblegum One', cursive",
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex flex-col items-center">
                      <div 
                        className={`rounded-full ${brushSize === size ? 'bg-white' : 'bg-gray-500'}`}
                        style={{ 
                          width: `${Math.min(size, 20)}px`, 
                          height: `${Math.min(size, 20)}px`,
                        }}
                      />
                      <span className="text-xs mt-1">{label}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                onClick={() => setIsEraser(!isEraser)}
                className={`rounded-2xl border-4 border-white shadow-lg flex items-center justify-center gap-2 py-4 ${
                  isEraser 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' 
                    : 'bg-gradient-to-r from-blue-400 to-cyan-500 text-white'
                }`}
                style={{
                  minHeight: '65px',
                  boxShadow: isEraser 
                    ? '0 6px 0 #831843, 0 8px 20px rgba(0,0,0,0.2)' 
                    : '0 6px 0 #0369A1, 0 8px 20px rgba(0,0,0,0.2)',
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ 
                  scale: 0.95, 
                  y: 4,
                }}
              >
                <motion.span 
                  className="text-3xl"
                  animate={isEraser ? { rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  🧽
                </motion.span>
                <span 
                  className="font-bold text-lg"
                  style={{ 
                    fontFamily: "'Bubblegum One', cursive",
                    textShadow: '2px 2px 0 rgba(0,0,0,0.2)'
                  }}
                >
                  {isEraser ? 'Erasing!' : 'Eraser'}
                </span>
              </motion.button>

              <motion.button
                onClick={clearCanvas}
                className="rounded-2xl border-4 border-white shadow-lg flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white"
                style={{
                  minHeight: '65px',
                  boxShadow: '0 6px 0 #991B1B, 0 8px 20px rgba(0,0,0,0.2)',
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ 
                  scale: 0.95, 
                  y: 4,
                }}
              >
                <span className="text-3xl">🗑️</span>
                <span 
                  className="font-bold text-lg"
                  style={{ 
                    fontFamily: "'Bubblegum One', cursive",
                    textShadow: '2px 2px 0 rgba(0,0,0,0.2)'
                  }}
                >
                  Clear All
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </GameBackground>
  );
};

export default ColoringBook;
