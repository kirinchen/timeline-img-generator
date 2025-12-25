import { Download } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

import Controls from './components/Controls';
import EventList from './components/EventList';
import { DEFAULT_CONFIG, SAMPLE_EVENTS } from './constants';
import type { TimelineConfig, TimelineEvent } from './types';
import { renderTimeline } from './utils/drawUtils';

const App: React.FC = () => {
  const [config, setConfig] = useState<TimelineConfig>(DEFAULT_CONFIG);
  const [events, setEvents] = useState<TimelineEvent[]>(SAMPLE_EVENTS);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Debounce render to prevent lag on sliders
  useEffect(() => {
    const timer = setTimeout(() => {
        if (canvasRef.current) {
            renderTimeline(canvasRef.current, config, events);
        }
    }, 50);
    return () => clearTimeout(timer);
  }, [config, events]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `timeline-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      
      {/* LEFT SIDEBAR: Controls & Data */}
      <aside className="w-96 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col shadow-lg z-10">
        <div className="p-5 border-b border-slate-200">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Timeline Gen
          </h1>
          <p className="text-xs text-slate-500 mt-1">Create beautiful timelines in seconds.</p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-8">
            <Controls config={config} onChange={setConfig} />
            <div className="border-t border-slate-200 pt-6">
                <EventList events={events} onEventsChange={setEvents} />
            </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200">
            <button 
                onClick={handleDownload}
                className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white py-2.5 px-4 rounded-lg font-medium transition-all transform active:scale-95"
            >
                <Download className="w-4 h-4" />
                <span>Download PNG</span>
            </button>
        </div>
      </aside>

      {/* RIGHT SIDE: Preview Area */}
      <main className="flex-1 relative bg-slate-100 overflow-auto flex items-center justify-center p-8">
        
        {/* Canvas Container */}
        <div className="relative shadow-2xl rounded-sm overflow-hidden bg-white ring-1 ring-slate-900/5">
            <canvas
                ref={canvasRef}
                width={config.width}
                height={config.height}
                className="max-w-full h-auto block"
                style={{ 
                    // Ensure it scales down nicely on smaller screens if canvas is huge
                    maxHeight: 'calc(100vh - 80px)', 
                    maxWidth: 'calc(100vw - 420px)'
                }}
            />
        </div>

        {/* Floating Info */}
        <div className="absolute top-4 right-4 bg-white/80 backdrop-blur text-xs px-3 py-1.5 rounded-full shadow border border-slate-200 text-slate-500">
            {config.width}px × {config.height}px
        </div>
      </main>
    </div>
  );
};

export default App;