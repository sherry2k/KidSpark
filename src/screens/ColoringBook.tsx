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
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#6366f1',
  '#000000', '#ffffff', '#92400e', '#64748b',
];

const BRUSH_SIZES = [4, 8, 14, 22];

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
];

const ColoringBook: React.FC<ColoringBookProps> = ({ progress, onBack, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [brushSize, setBrushSize] = useState(BRUSH_SIZES[1]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isEraser, setIsEraser] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

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

    // Draw template outline if selected
    if (selectedTemplate) {
      const template = TEMPLATES.find(t => t.id === selectedTemplate);
      if (template) {
        ctx.font = `${Math.min(canvas.width, canvas.height) * 0.5}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = '#000000';
        ctx.fillText(template.emoji, canvas.width / 2, canvas.height / 2);
        ctx.globalAlpha = 1;
      }
    }
  }, [selectedTemplate]);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
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
    initCanvas();
  };

  if (!selectedTemplate) {
    return (
      <GameBackground variant="game">
        <div className="h-full flex flex-col">
          <Navigation title="🎨 Coloring Book" onBack={onBack} stars={progress.stars} />
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <motion.h2
              className="text-xl md:text-2xl font-bold text-gray-800 mb-4"
              style={{ fontFamily: "'Bubblegum One', cursive" }}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              Pick a picture to color! 🖌️
            </motion.h2>
            <div className="grid grid-cols-3 gap-3 max-w-md w-full">
              {TEMPLATES.map((t, i) => (
                <motion.button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className="game-card p-5 text-center"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-4xl block mb-1">{t.emoji}</span>
                  <span className="text-sm font-bold text-gray-600">{t.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </GameBackground>
    );
  }

  return (
    <GameBackground variant="game">
      <div className="h-full flex flex-col">
        <Navigation
          title={`🎨 Color the ${TEMPLATES.find(t => t.id === selectedTemplate)?.name}`}
          onBack={() => { setSelectedTemplate(null); onComplete(3); }}
          stars={progress.stars}
        />

        {/* Canvas area */}
        <div className="flex-1 mx-3 mb-2 bg-white rounded-2xl shadow-xl overflow-hidden relative">
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-crosshair touch-none"
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={stopDraw}
          />
        </div>

        {/* Toolbar */}
        <div className="px-3 pb-3">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-3 shadow-lg">
            {/* Colors */}
            <div className="flex items-center gap-1.5 mb-2 overflow-x-auto pb-1">
              {COLORS.map((color) => (
                <motion.button
                  key={color}
                  onClick={() => { setSelectedColor(color); setIsEraser(false); }}
                  className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex-shrink-0 border-2 transition-all ${
                    selectedColor === color && !isEraser ? 'border-gray-800 scale-110 ring-2 ring-offset-1 ring-gray-300' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            {/* Tools row */}
            <div className="flex items-center justify-between">
              {/* Brush sizes */}
              <div className="flex items-center gap-2">
                {BRUSH_SIZES.map((size) => (
                  <motion.button
                    key={size}
                    onClick={() => setBrushSize(size)}
                    className={`rounded-full flex items-center justify-center transition-all ${
                      brushSize === size ? 'bg-gray-800' : 'bg-gray-300'
                    }`}
                    style={{ width: size + 12, height: size + 12 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>

              {/* Tools */}
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => setIsEraser(!isEraser)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-bold ${
                    isEraser ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-500'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  🧹 Eraser
                </motion.button>
                <motion.button
                  onClick={clearCanvas}
                  className="px-3 py-1.5 rounded-xl text-sm font-bold bg-red-50 text-red-500"
                  whileTap={{ scale: 0.95 }}
                >
                  🗑️ Clear
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GameBackground>
  );
};

export default ColoringBook;
