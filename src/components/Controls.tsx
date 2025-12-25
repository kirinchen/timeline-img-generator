import { Layout, Palette, Settings2 } from 'lucide-react';
import React from 'react';
import { Orientation, TimeInterval, type TimelineConfig } from '../types';

interface ControlsProps {
  config: TimelineConfig;
  onChange: (newConfig: TimelineConfig) => void;
}

const Controls: React.FC<ControlsProps> = ({ config, onChange }) => {
  const handleChange = (key: keyof TimelineConfig, value: string | number) => {
    onChange({ ...config, [key]: value });
  };

  return (
    <div className="space-y-6">
      
      {/* Date Range & Dimensions */}
      <section className="space-y-3">
        <h3 className="flex items-center text-sm font-semibold text-slate-500 uppercase tracking-wider">
          <Settings2 className="w-4 h-4 mr-2" /> Basics
        </h3>
        <div className="grid grid-cols-2 gap-3">
            <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Start Date</label>
                <input
                    type="date"
                    value={config.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
            </div>
            <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">End Date</label>
                <input
                    type="date"
                    value={config.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
            <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Width (px)</label>
                <input
                    type="number"
                    value={config.width}
                    onChange={(e) => handleChange('width', Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>
            <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Height (px)</label>
                <input
                    type="number"
                    value={config.height}
                    onChange={(e) => handleChange('height', Number(e.target.value))}
                    className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>
        </div>
      </section>

      {/* Layout & Style */}
      <section className="space-y-3 pt-4 border-t border-slate-200">
        <h3 className="flex items-center text-sm font-semibold text-slate-500 uppercase tracking-wider">
          <Layout className="w-4 h-4 mr-2" /> Layout
        </h3>
        
        <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Interval Scale</label>
            <select
                value={config.interval}
                onChange={(e) => handleChange('interval', e.target.value)}
                className="w-full px-2 py-1.5 text-sm bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            >
                {Object.values(TimeInterval).map((interval) => (
                    <option key={interval} value={interval}>{interval}</option>
                ))}
            </select>
        </div>

        <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Orientation</label>
            <div className="flex bg-slate-100 p-1 rounded-md">
                <button
                    onClick={() => handleChange('orientation', Orientation.Horizontal)}
                    className={`flex-1 py-1 text-xs rounded-sm transition-colors ${config.orientation === Orientation.Horizontal ? 'bg-white shadow text-blue-600 font-medium' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Horizontal
                </button>
                <button
                    onClick={() => handleChange('orientation', Orientation.Vertical)}
                    className={`flex-1 py-1 text-xs rounded-sm transition-colors ${config.orientation === Orientation.Vertical ? 'bg-white shadow text-blue-600 font-medium' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Vertical
                </button>
            </div>
        </div>
      </section>

      {/* Colors */}
      <section className="space-y-3 pt-4 border-t border-slate-200">
        <h3 className="flex items-center text-sm font-semibold text-slate-500 uppercase tracking-wider">
          <Palette className="w-4 h-4 mr-2" /> Appearance
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
             <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Theme Color</label>
                <div className="flex items-center space-x-2">
                    <input
                        type="color"
                        value={config.themeColor}
                        onChange={(e) => handleChange('themeColor', e.target.value)}
                        className="h-8 w-8 rounded cursor-pointer border-0 p-0"
                    />
                    <span className="text-xs text-slate-500 font-mono">{config.themeColor}</span>
                </div>
            </div>
             <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Background</label>
                <div className="flex items-center space-x-2">
                    <input
                        type="color"
                        value={config.backgroundColor}
                        onChange={(e) => handleChange('backgroundColor', e.target.value)}
                        className="h-8 w-8 rounded cursor-pointer border-0 p-0"
                    />
                    <span className="text-xs text-slate-500 font-mono">{config.backgroundColor}</span>
                </div>
            </div>
        </div>

        <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
                Font Size ({config.fontSize}px)
            </label>
            <input
                type="range"
                min="10"
                max="32"
                value={config.fontSize}
                onChange={(e) => handleChange('fontSize', Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
        </div>
      </section>

    </div>
  );
};

export default Controls;