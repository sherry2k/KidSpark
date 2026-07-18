import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameBackground } from '../components/Background';
import Navigation from '../components/Navigation';
import { GameProgress } from '../store/gameStore';

interface CreativeStudioProps {
  progress: GameProgress;
  onBack: () => void;
  onComplete: (stars: number) => void;
}

type Tool = 'brush' | 'pencil' | 'marker' | 'eraser' | 'fill' | 'shape' | 'sticker';
type Shape = 'circle' | 'rectangle' | 'triangle' | 'line' | 'arrow' | 'star';

interface DrawingState {
  imageData: ImageData | null;
}

const COLORS = [
  '#000000', '#FFFFFF', '#EF4444', '#F97316', '#EAB308', 
  '#22C55E', '#14B8A6', '#3B82F6', '#8B5CF6', '#EC4899',
  '#92400E', '#64748B', '#F59E0B', '#10B981', '#6366F1'
];

const BRUSH_SIZES = [
  { size: 4, label: 'XS' },
  { size: 8, label: 'S' },
  { size: 16, label: 'M' },
  { size: 24, label: 'L' },
  { size: 40, label: 'XL' },
];

const STICKER_SIZES = [
  { size: 40, label: 'S' },
  { size: 60, label: 'M' },
  { size: 80, label: 'L' },
  { size: 120, label: 'XL' },
  { size: 160, label: 'XXL' },
];

const SHAPE_SIZES = [
  { size: 40, label: 'S' },
  { size: 80, label: 'M' },
  { size: 120, label: 'L' },
  { size: 160, label: 'XL' },
];

const STICKERS = [
  '⭐','☺️', '❤️', '🌟', '✨', '🎈', '🎨', '🎭', '🎪',
  '🐶', '🐱', '🐰', '🦊', '🦁', '🐼', '🐨', '🦄',
  '🌸', '🌺', '🌻', '🌷', '🌹', '🌼', '🌵', '🌳',
  '🚗', '✈️', '🚀', '🎯', '⚽', '🏆', '👑', '💎',
  '☀️', '🌙', '⛅', '🌈', '⚡', '🔥', '💫', '🎁',
];

const TOOLS: Array<{ id: Tool; icon: string; label: string; gradient: string; shadow: string }> = [
  { id: 'brush', icon: '🖌️', label: 'Brush', gradient: 'from-purple-500 to-pink-500', shadow: '#6B21A8' },
  { id: 'pencil', icon: '✏️', label: 'Pencil', gradient: 'from-gray-500 to-gray-700', shadow: '#374151' },
  { id: 'marker', icon: '🖊️', label: 'Marker', gradient: 'from-blue-500 to-cyan-500', shadow: '#0369A1' },
  { id: 'eraser', icon: '🧽', label: 'Eraser', gradient: 'from-orange-400 to-red-500', shadow: '#C2410C' },
  { id: 'fill', icon: '🪣', label: 'Fill', gradient: 'from-green-500 to-emerald-500', shadow: '#047857' },
  { id: 'shape', icon: '🔷', label: 'Shape', gradient: 'from-indigo-500 to-purple-500', shadow: '#4338CA' },
  { id: 'sticker', icon: '⭐', label: 'Sticker', gradient: 'from-yellow-400 to-orange-500', shadow: '#D97706' },
];

const SHAPES: Array<{ id: Shape; icon: string; label: string }> = [
  { id: 'circle', icon: '⭕', label: 'Circle' },
  { id: 'rectangle', icon: '⬜', label: 'Square' },
  { id: 'triangle', icon: '△', label: 'Triangle' },
  { id: 'line', icon: '➖', label: 'Line' },
  { id: 'arrow', icon: '➡️', label: 'Arrow' },
  { id: 'star', icon: '⭐', label: 'Star' },
];

const CreativeStudio: React.FC<CreativeStudioProps> = ({ progress, onBack, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTool, setCurrentTool] = useState<Tool>('brush');
  const [currentColor, setCurrentColor] = useState('#EF4444');
  const [brushSize, setBrushSize] = useState(8);
  const [stickerSize, setStickerSize] = useState(80);
  const [shapeSize, setShapeSize] = useState(80);
  const [opacity, setOpacity] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingHistory, setDrawingHistory] = useState<DrawingState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showStickers, setShowStickers] = useState(false);
  const [showShapes, setShowShapes] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [previewPos, setPreviewPos] = useState<{ x: number; y: number } | null>(null);
  const [isDraggingItem, setIsDraggingItem] = useState(false); // NEW: Track dragging state
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const canvasPos = useRef<{ x: number; y: number } | null>(null); // NEW: Store canvas position

  // Initialize canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    saveToHistory();
  }, []);

  useEffect(() => {
    initCanvas();
    const handleResize = () => initCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initCanvas]);

  // Save to history
  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = drawingHistory.slice(0, historyIndex + 1);
    newHistory.push({ imageData });
    
    if (newHistory.length > 30) {
      newHistory.shift();
    }
    
    setDrawingHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Get position on canvas (for drawing)
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

  // Get display position for preview
  const getDisplayPos = (e: React.MouseEvent | React.TouchEvent) => {
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

  // Drawing handlers
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pos = getPos(e);
    const displayPos = getDisplayPos(e);
    
    // Sticker mode
    if (currentTool === 'sticker' && selectedSticker) {
      canvasPos.current = pos;
      setPreviewPos(displayPos);
      setIsDraggingItem(true);
      return;
    }

    // Shape mode
    if (currentTool === 'shape' && selectedShape) {
      canvasPos.current = pos;
      setPreviewPos(displayPos);
      setIsDraggingItem(true);
      return;
    }

    if (currentTool === 'fill') {
      fillArea(pos.x, pos.y);
      return;
    }

    // Regular drawing
    setIsDrawing(true);
    lastPos.current = pos;
    
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.globalAlpha = opacity;
    
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fillStyle = currentTool === 'eraser' ? '#FFFFFF' : currentColor;
    ctx.fill();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    
    const pos = getPos(e);
    const displayPos = getDisplayPos(e);
    
    // Update preview position when dragging sticker or shape
    if (isDraggingItem && (currentTool === 'sticker' || currentTool === 'shape')) {
      canvasPos.current = pos;
      setPreviewPos(displayPos);
      return;
    }
    
    if (!isDrawing) return;

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx || !lastPos.current) return;

    ctx.globalAlpha = opacity;

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = currentTool === 'eraser' ? '#FFFFFF' : currentColor;
    
    if (currentTool === 'pencil') {
      ctx.lineWidth = brushSize / 2;
      ctx.lineCap = 'round';
    } else if (currentTool === 'marker') {
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'square';
      ctx.globalAlpha = opacity * 0.7;
    } else {
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
    
    ctx.stroke();
    lastPos.current = pos;
  };

  const stopDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    
    // Place sticker at final position
    if (isDraggingItem && currentTool === 'sticker' && selectedSticker && canvasPos.current) {
      addSticker(canvasPos.current.x, canvasPos.current.y);
      setPreviewPos(null);
      setIsDraggingItem(false);
      canvasPos.current = null;
      return;
    }
    
    // Place shape at final position
    if (isDraggingItem && currentTool === 'shape' && selectedShape && canvasPos.current) {
      drawShape(selectedShape, canvasPos.current.x, canvasPos.current.y);
      setPreviewPos(null);
      setIsDraggingItem(false);
      canvasPos.current = null;
      return;
    }
    
    if (isDrawing) {
      setIsDrawing(false);
      lastPos.current = null;
      saveToHistory();
    }
  };

  // Add sticker to canvas
  const addSticker = (x: number, y: number) => {
    if (!selectedSticker) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.globalAlpha = 1;
    ctx.font = `${stickerSize}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(selectedSticker, x, y);
    
    saveToHistory();
  };

  // Fill area
  const fillArea = (x: number, y: number) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = currentColor;
    ctx.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    
    saveToHistory();
  };

  // Draw shape - ONLY OUTLINE (no fill)
  const drawShape = (shape: Shape, x: number, y: number) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const size = shapeSize;
    ctx.globalAlpha = 1;

    switch (shape) {
      case 'circle':
        // White outline (background)
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = brushSize + 6;
        ctx.stroke();
        // Main color outline
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = brushSize;
        ctx.stroke();
        break;
      
      case 'rectangle':
        // White outline
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = brushSize + 6;
        ctx.strokeRect(x - size, y - size / 2, size * 2, size);
        // Main color outline
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = brushSize;
        ctx.strokeRect(x - size, y - size / 2, size * 2, size);
        break;
      
      case 'triangle':
        // White outline
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.lineTo(x - size, y + size);
        ctx.lineTo(x + size, y + size);
        ctx.closePath();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = brushSize + 6;
        ctx.lineJoin = 'round';
        ctx.stroke();
        // Main color outline
        ctx.beginPath();
        ctx.moveTo(x, y - size);
        ctx.lineTo(x - size, y + size);
        ctx.lineTo(x + size, y + size);
        ctx.closePath();
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = brushSize;
        ctx.stroke();
        break;
      
      case 'line':
        // White outline
        ctx.beginPath();
        ctx.moveTo(x - size, y);
        ctx.lineTo(x + size, y);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = brushSize + 6;
        ctx.lineCap = 'round';
        ctx.stroke();
        // Main color line
        ctx.beginPath();
        ctx.moveTo(x - size, y);
        ctx.lineTo(x + size, y);
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = brushSize;
        ctx.stroke();
        break;
      
      case 'arrow':
        // White outline for arrow
        ctx.beginPath();
        ctx.moveTo(x - size, y);
        ctx.lineTo(x + size, y);
        ctx.moveTo(x + size, y);
        ctx.lineTo(x + size - 20, y - 20);
        ctx.moveTo(x + size, y);
        ctx.lineTo(x + size - 20, y + 20);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = brushSize + 6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        // Main color arrow
        ctx.beginPath();
        ctx.moveTo(x - size, y);
        ctx.lineTo(x + size, y);
        ctx.moveTo(x + size, y);
        ctx.lineTo(x + size - 20, y - 20);
        ctx.moveTo(x + size, y);
        ctx.lineTo(x + size - 20, y + 20);
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = brushSize;
        ctx.stroke();
        break;
      
      case 'star':
        // White outline
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
          const px = x + size * Math.cos(angle);
          const py = y + size * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = brushSize + 6;
        ctx.lineJoin = 'round';
        ctx.stroke();
        // Main color outline
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
          const px = x + size * Math.cos(angle);
          const py = y + size * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = brushSize;
        ctx.stroke();
        break;
    }
    
    saveToHistory();
  };

  // Undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx && drawingHistory[newIndex]?.imageData) {
        ctx.putImageData(drawingHistory[newIndex].imageData!, 0, 0);
      }
    }
  };

  // Redo
  const handleRedo = () => {
    if (historyIndex < drawingHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx && drawingHistory[newIndex]?.imageData) {
        ctx.putImageData(drawingHistory[newIndex].imageData!, 0, 0);
      }
    }
  };

  // Clear canvas
  const handleClear = () => {
    if (confirm('Clear the drawing? 🎨')) {
      initCanvas();
    }
  };

  // Save drawing
  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const timestamp = new Date().toISOString();
    const drawings = JSON.parse(localStorage.getItem('kidspark_drawings') || '[]');
    drawings.push({ id: timestamp, image: dataUrl, name: `Drawing ${drawings.length + 1}` });
    localStorage.setItem('kidspark_drawings', JSON.stringify(drawings));
    
    setSavedMessage('💾 Saved!');
    setTimeout(() => setSavedMessage(null), 2000);
    onComplete(2);
  };

  // Export as PNG
  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `kidspark-drawing-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    setSavedMessage('📥 Downloaded!');
    setTimeout(() => setSavedMessage(null), 2000);
  };

  // Render preview shape/sticker
  const renderPreview = () => {
    if (!previewPos || !isDraggingItem) return null;
    
    if (currentTool === 'sticker' && selectedSticker) {
      return (
        <div
          className="absolute pointer-events-none opacity-60"
          style={{
            left: `${previewPos.x}px`,
            top: `${previewPos.y}px`,
            fontSize: `${stickerSize / 1.5}px`,
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        >
          {selectedSticker}
        </div>
      );
    }
    
    if (currentTool === 'shape' && selectedShape) {
      return (
        <svg
          className="absolute pointer-events-none opacity-70"
          style={{
            left: `${previewPos.x}px`,
            top: `${previewPos.y}px`,
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
          width={shapeSize * 2 + 40}
          height={shapeSize * 2 + 40}
        >
          <g transform={`translate(${shapeSize + 20}, ${shapeSize + 20})`}>
            {selectedShape === 'circle' && (
              <>
                <circle cx="0" cy="0" r={shapeSize / 2} stroke="white" strokeWidth={brushSize + 6} fill="none" />
                <circle cx="0" cy="0" r={shapeSize / 2} stroke={currentColor} strokeWidth={brushSize} fill="none" />
              </>
            )}
            {selectedShape === 'rectangle' && (
              <>
                <rect x={-shapeSize / 2} y={-shapeSize / 4} width={shapeSize} height={shapeSize / 2} stroke="white" strokeWidth={brushSize + 6} fill="none" />
                <rect x={-shapeSize / 2} y={-shapeSize / 4} width={shapeSize} height={shapeSize / 2} stroke={currentColor} strokeWidth={brushSize} fill="none" />
              </>
            )}
            {selectedShape === 'triangle' && (
              <>
                <polygon 
                  points={`0,${-shapeSize / 2} ${-shapeSize / 2},${shapeSize / 2} ${shapeSize / 2},${shapeSize / 2}`}
                  stroke="white" strokeWidth={brushSize + 6} fill="none" strokeLinejoin="round"
                />
                <polygon 
                  points={`0,${-shapeSize / 2} ${-shapeSize / 2},${shapeSize / 2} ${shapeSize / 2},${shapeSize / 2}`}
                  stroke={currentColor} strokeWidth={brushSize} fill="none" strokeLinejoin="round"
                />
              </>
            )}
            {selectedShape === 'star' && (
              <>
                <polygon 
                  points={Array.from({length: 5}, (_, i) => {
                    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
                    return `${(shapeSize / 2) * Math.cos(angle)},${(shapeSize / 2) * Math.sin(angle)}`;
                  }).join(' ')}
                  stroke="white" strokeWidth={brushSize + 6} fill="none" strokeLinejoin="round"
                />
                <polygon 
                  points={Array.from({length: 5}, (_, i) => {
                    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
                    return `${(shapeSize / 2) * Math.cos(angle)},${(shapeSize / 2) * Math.sin(angle)}`;
                  }).join(' ')}
                  stroke={currentColor} strokeWidth={brushSize} fill="none" strokeLinejoin="round"
                />
              </>
            )}
            {selectedShape === 'line' && (
              <>
                <line x1={-shapeSize / 2} y1="0" x2={shapeSize / 2} y2="0" stroke="white" strokeWidth={brushSize + 6} strokeLinecap="round" />
                <line x1={-shapeSize / 2} y1="0" x2={shapeSize / 2} y2="0" stroke={currentColor} strokeWidth={brushSize} strokeLinecap="round" />
              </>
            )}
            {selectedShape === 'arrow' && (
              <>
                <g stroke="white" strokeWidth={brushSize + 6} strokeLinecap="round" strokeLinejoin="round" fill="none">
                  <line x1={-shapeSize / 2} y1="0" x2={shapeSize / 2} y2="0" />
                  <line x1={shapeSize / 2} y1="0" x2={shapeSize / 2 - 15} y2="-15" />
                  <line x1={shapeSize / 2} y1="0" x2={shapeSize / 2 - 15} y2="15" />
                </g>
                <g stroke={currentColor} strokeWidth={brushSize} strokeLinecap="round" strokeLinejoin="round" fill="none">
                  <line x1={-shapeSize / 2} y1="0" x2={shapeSize / 2} y2="0" />
                  <line x1={shapeSize / 2} y1="0" x2={shapeSize / 2 - 15} y2="-15" />
                  <line x1={shapeSize / 2} y1="0" x2={shapeSize / 2 - 15} y2="15" />
                </g>
              </>
            )}
          </g>
        </svg>
      );
    }
    
    return null;
  };

  return (
    <GameBackground variant="game">
      <div className="h-full flex flex-col">
        <Navigation title="🎨 Creative Studio" onBack={onBack} stars={progress.stars} />

        <AnimatePresence>
          {savedMessage && (
            <motion.div
              className="fixed top-24 left-1/2 -translate-x-1/2 pointer-events-none z-50"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full px-6 py-3 shadow-2xl border-4 border-white text-white font-black text-xl"
                style={{
                  boxShadow: '0 6px 0 #047857, 0 8px 20px rgba(0,0,0,0.3)',
                  fontFamily: "'Fredoka', 'Arial Black', sans-serif",
                }}
              >
                {savedMessage}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOP: Action Bar + Tools */}
        <div className="px-3 mb-2 space-y-2">
          <motion.div
            className="bg-white/95 rounded-2xl p-2 shadow-lg border-4 border-white flex items-center justify-between gap-2"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="flex gap-2">
              <motion.button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className={`rounded-xl p-2 md:p-3 shadow-md border-2 border-white ${
                  historyIndex > 0 ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' : 'bg-gray-200 text-gray-400'
                }`}
                style={{ minWidth: '50px', minHeight: '50px', boxShadow: historyIndex > 0 ? '0 4px 0 #0369A1' : 'none' }}
                whileTap={historyIndex > 0 ? { scale: 0.9, y: 2 } : {}}
              >
                <span className="text-xl md:text-2xl">↶</span>
              </motion.button>
              <motion.button
                onClick={handleRedo}
                disabled={historyIndex >= drawingHistory.length - 1}
                className={`rounded-xl p-2 md:p-3 shadow-md border-2 border-white ${
                  historyIndex < drawingHistory.length - 1 ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' : 'bg-gray-200 text-gray-400'
                }`}
                style={{ minWidth: '50px', minHeight: '50px', boxShadow: historyIndex < drawingHistory.length - 1 ? '0 4px 0 #0369A1' : 'none' }}
                whileTap={historyIndex < drawingHistory.length - 1 ? { scale: 0.9, y: 2 } : {}}
              >
                <span className="text-xl md:text-2xl">↷</span>
              </motion.button>
              <motion.button
                onClick={handleClear}
                className="rounded-xl p-2 md:p-3 shadow-md border-2 border-white bg-gradient-to-r from-red-500 to-pink-500 text-white"
                style={{ minWidth: '50px', minHeight: '50px', boxShadow: '0 4px 0 #B91C1C' }}
                whileTap={{ scale: 0.9, y: 2 }}
              >
                <span className="text-xl md:text-2xl">🗑️</span>
              </motion.button>
            </div>

            <div className="flex gap-2">
              <motion.button
                onClick={handleSave}
                className="rounded-xl px-4 py-2 md:px-5 md:py-3 shadow-md border-2 border-white bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black text-sm md:text-base flex items-center gap-2"
                style={{ boxShadow: '0 4px 0 #047857', fontFamily: "'Fredoka', 'Arial Black', sans-serif" }}
                whileTap={{ scale: 0.95, y: 2 }}
              >
                <span>💾</span>
                <span className="hidden md:inline">Save</span>
              </motion.button>
              <motion.button
                onClick={handleExport}
                className="rounded-xl px-4 py-2 md:px-5 md:py-3 shadow-md border-2 border-white bg-gradient-to-r from-orange-500 to-red-500 text-white font-black text-sm md:text-base flex items-center gap-2"
                style={{ boxShadow: '0 4px 0 #C2410C', fontFamily: "'Fredoka', 'Arial Black', sans-serif" }}
                whileTap={{ scale: 0.95, y: 2 }}
              >
                <span>📥</span>
                <span className="hidden md:inline">Export</span>
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/95 rounded-2xl p-3 shadow-lg border-4 border-white"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex gap-2 overflow-x-auto pb-1 justify-center">
              {TOOLS.map((tool) => {
                const isActive = currentTool === tool.id;
                return (
                  <motion.button
                    key={tool.id}
                    onClick={() => {
                      setCurrentTool(tool.id);
                      setShowStickers(tool.id === 'sticker');
                      setShowShapes(tool.id === 'shape');
                      if (tool.id !== 'sticker') setSelectedSticker(null);
                      if (tool.id !== 'shape') setSelectedShape(null);
                      setPreviewPos(null);
                      setIsDraggingItem(false);
                    }}
                    className={`rounded-2xl p-2 md:p-3 shadow-md border-4 border-white flex flex-col items-center flex-shrink-0 ${
                      isActive ? `bg-gradient-to-br ${tool.gradient} text-white scale-110` : 'bg-gray-100 text-gray-600'
                    }`}
                    style={{ minWidth: '55px', minHeight: '55px', boxShadow: isActive ? `0 4px 0 ${tool.shadow}` : '0 3px 0 rgba(0,0,0,0.1)' }}
                    whileHover={{ scale: isActive ? 1.15 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-xl md:text-2xl">{tool.icon}</span>
                    <span className="text-xs font-black mt-0.5" style={{ fontFamily: "'Fredoka', 'Arial Black', sans-serif" }}>{tool.label}</span>
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {showStickers && (
                <motion.div
                  className="mt-3 bg-yellow-50 rounded-2xl p-3 border-4 border-yellow-200"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <p className="text-center text-sm font-black text-gray-700 mb-2" style={{ fontFamily: "'Fredoka', 'Arial Black', sans-serif" }}>⭐ Choose a Sticker</p>
                  <div className="grid grid-cols-8 gap-2 max-h-32 overflow-y-auto mb-3">
                    {STICKERS.map((sticker, i) => (
                      <motion.button
                        key={i}
                        onClick={() => setSelectedSticker(sticker)}
                        className={`aspect-square rounded-xl text-2xl md:text-3xl flex items-center justify-center border-2 ${
                          selectedSticker === sticker ? 'bg-yellow-200 border-yellow-500 scale-110' : 'bg-white border-white'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {sticker}
                      </motion.button>
                    ))}
                  </div>
                  <div className="border-t-2 border-yellow-300 pt-2">
                    <p className="text-center text-xs font-black text-gray-700 mb-2" style={{ fontFamily: "'Fredoka', 'Arial Black', sans-serif" }}>📏 Sticker Size</p>
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      {STICKER_SIZES.map(({ size, label }) => (
                        <motion.button
                          key={size}
                          onClick={() => setStickerSize(size)}
                          className={`rounded-xl px-3 py-2 border-2 font-black text-sm ${
                            stickerSize === size ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-white scale-110' : 'bg-white text-gray-600 border-yellow-300'
                          }`}
                          style={{ minWidth: '50px', minHeight: '40px', fontFamily: "'Fredoka', 'Arial Black', sans-serif", boxShadow: stickerSize === size ? '0 3px 0 #D97706' : 'none' }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {label}
                        </motion.button>
                      ))}
                    </div>
                    {selectedSticker && (
                      <motion.p className="text-center text-xs font-black text-gray-600 mt-2 bg-white rounded-full py-1" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        💡 Touch and drag on canvas to place!
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showShapes && (
                <motion.div
                  className="mt-3 bg-indigo-50 rounded-2xl p-3 border-4 border-indigo-200"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <p className="text-center text-sm font-black text-gray-700 mb-2" style={{ fontFamily: "'Fredoka', 'Arial Black', sans-serif" }}>🔷 Choose a Shape</p>
                  <div className="grid grid-cols-6 gap-2 mb-3">
                    {SHAPES.map((shape) => (
                      <motion.button
                        key={shape.id}
                        onClick={() => setSelectedShape(shape.id)}
                        className={`aspect-square rounded-xl text-3xl md:text-4xl flex items-center justify-center border-2 ${
                          selectedShape === shape.id ? 'bg-indigo-200 border-indigo-500 scale-110' : 'bg-white border-white'
                        }`}
                        style={{ boxShadow: selectedShape === shape.id ? '0 3px 0 #4338CA' : '0 4px 0 rgba(0,0,0,0.1)' }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {shape.icon}
                      </motion.button>
                    ))}
                  </div>
                  <div className="border-t-2 border-indigo-300 pt-2">
                    <p className="text-center text-xs font-black text-gray-700 mb-2" style={{ fontFamily: "'Fredoka', 'Arial Black', sans-serif" }}>📏 Shape Size</p>
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      {SHAPE_SIZES.map(({ size, label }) => (
                        <motion.button
                          key={size}
                          onClick={() => setShapeSize(size)}
                          className={`rounded-xl px-3 py-2 border-2 font-black text-sm ${
                            shapeSize === size ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-white scale-110' : 'bg-white text-gray-600 border-indigo-300'
                          }`}
                          style={{ minWidth: '50px', minHeight: '40px', fontFamily: "'Fredoka', 'Arial Black', sans-serif", boxShadow: shapeSize === size ? '0 3px 0 #4338CA' : 'none' }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {label}
                        </motion.button>
                      ))}
                    </div>
                    {selectedShape && (
                      <motion.p className="text-center text-xs font-black text-gray-600 mt-2 bg-white rounded-full py-1" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        💡 Touch and drag on canvas to place!
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Canvas Area with Preview */}
        <div className="flex-1 mx-3 mb-2 bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-white relative">
          <canvas
            ref={canvasRef}
            className="w-full h-full cursor-crosshair touch-none block"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          {renderPreview()}
        </div>

        {/* BOTTOM */}
        <div className="px-3 pb-3">
          <div className="bg-white/95 rounded-3xl p-3 shadow-2xl border-4 border-white">
            {currentTool !== 'sticker' && (
              <div className="mb-3">
                <p className="text-center text-xs font-black text-gray-600 mb-2" style={{ fontFamily: "'Fredoka', 'Arial Black', sans-serif" }}>✏️ Brush Size</p>
                <div className="flex items-center justify-center gap-2">
                  {BRUSH_SIZES.map(({ size, label }) => (
                    <motion.button
                      key={size}
                      onClick={() => setBrushSize(size)}
                      className={`rounded-xl flex flex-col items-center justify-center border-2 ${
                        brushSize === size ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-white scale-110' : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}
                      style={{ minWidth: '45px', minHeight: '45px', fontFamily: "'Fredoka', 'Arial Black', sans-serif" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className={`rounded-full ${brushSize === size ? 'bg-white' : 'bg-gray-500'}`} style={{ width: `${Math.min(size, 20)}px`, height: `${Math.min(size, 20)}px` }} />
                      <span className="text-xs">{label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-center text-xs font-black text-gray-600 mb-2" style={{ fontFamily: "'Fredoka', 'Arial Black', sans-serif" }}>🎨 Colors</p>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 justify-center flex-wrap">
                {COLORS.map((color) => (
                  <motion.button
                    key={color}
                    onClick={() => setCurrentColor(color)}
                    className={`rounded-full flex-shrink-0 border-4 shadow-md ${
                      currentColor === color ? 'border-gray-800 scale-125 ring-4 ring-offset-2 ring-yellow-300' : 'border-white'
                    }`}
                    style={{ backgroundColor: color, width: '40px', height: '40px' }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </GameBackground>
  );
};

export default CreativeStudio;
