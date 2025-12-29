import { useState } from 'react';

const SatelliteMap = () => {
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [hoveredZone, setHoveredZone] = useState(null);

  // Simplified India Map SVG Path
  const indiaPath = "M303,46 L335,16 L376,34 L415,31 L418,65 L446,65 L460,54 L520,70 L551,62 L563,85 L542,106 L552,125 L530,135 L516,160 L516,180 L545,200 L530,225 L490,240 L480,270 L460,300 L430,360 L400,450 L380,470 L360,450 L340,380 L320,320 L280,280 L250,250 L200,230 L180,200 L200,160 L230,120 L270,100 L280,80 L303,46 Z";

  // Zones Configuration (Adjusted for standard map visuals if needed)
  const zones = [
    { id: 1, name: "Ganga Basin (North)", risk: "CRITICAL", cx: 380, cy: 180, r: 50, color: "url(#gradRed)", description: "Heavy rainfall alert" },
    { id: 2, name: "Brahmaputra (North East)", risk: "WARNING", cx: 650, cy: 180, r: 40, color: "url(#gradOrange)", description: "Rising water levels" },
    { id: 3, name: "Kerala Coast", risk: "WATCH", cx: 280, cy: 520, r: 30, color: "url(#gradYellow)", description: "Normal monsoon activity" },
    { id: 4, name: "Gujarat Plains", risk: "WARNING", cx: 150, cy: 300, r: 40, color: "url(#gradOrange)", description: "Cyclonic disturbance" },
    { id: 5, name: "Godavari Basin", risk: "WATCH", cx: 350, cy: 350, r: 40, color: "url(#gradYellow)", description: "Stable flow" }
  ];

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden text-sans select-none">
      {/* Interactive Map Container */}
      <div className="relative w-full h-full flex items-center justify-center bg-[#b8d5e9]">
        {/* Base Map Image */}
        <img 
            src="/india_map.png" 
            alt="India Political Map" 
            className="h-full w-auto object-contain max-w-none opacity-90 transition-transform duration-500 hover:scale-[1.02]"
        />

        {/* Heatmap Overlay SVG - Positioned absolutely over everything */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
            <defs>
                 <radialGradient id="gradRed" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0%" stopColor="rgba(239, 68, 68, 0.8)"/>
                    <stop offset="100%" stopColor="rgba(239, 68, 68, 0)"/>
                 </radialGradient>
                 <radialGradient id="gradOrange" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0%" stopColor="rgba(249, 115, 22, 0.7)"/>
                    <stop offset="100%" stopColor="rgba(249, 115, 22, 0)"/>
                 </radialGradient>
                 <radialGradient id="gradYellow" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0%" stopColor="rgba(234, 179, 8, 0.6)"/>
                    <stop offset="100%" stopColor="rgba(234, 179, 8, 0)"/>
                 </radialGradient>
            </defs>
            
            {showHeatmap && zones.map((zone) => (
                <g key={zone.id} 
                   className="cursor-pointer pointer-events-auto"
                   onMouseEnter={() => setHoveredZone(zone)}
                   onMouseLeave={() => setHoveredZone(null)}
                >
                     <circle 
                        cx={zone.cx} 
                        cy={zone.cy} 
                        r={zone.r} 
                        fill={zone.color} 
                        className="animate-pulse"
                        style={{ animationDuration: zone.risk === 'CRITICAL' ? '1.5s' : '3s' }}
                    />
                    <circle cx={zone.cx} cy={zone.cy} r="3" fill="white" className="opacity-80"/>
                </g>
            ))}
        </svg>
      </div>
      {/* Tooltip for Hovered Zone */}
      {hoveredZone && (
        <div 
            className="absolute z-50 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-xl border border-slate-200 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-4"
            style={{ 
                left: `${(hoveredZone.cx / 800) * 100}%`,
                top: `${(hoveredZone.cy / 600) * 100}%` 
            }}
        >
            <div className={`text-xs font-bold px-2 py-0.5 rounded w-fit mb-1 ${
                hoveredZone.risk === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                hoveredZone.risk === 'WARNING' ? 'bg-orange-100 text-orange-700' :
                'bg-yellow-100 text-yellow-700'
            }`}>
                {hoveredZone.risk}
            </div>
            <div className="font-bold text-slate-800 text-sm">{hoveredZone.name}</div>
            <div className="text-xs text-slate-600">{hoveredZone.description}</div>
        </div>
      )}

      {/* Overlay Info Header */}
      <div className="absolute top-5 left-5 right-5 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg z-10 max-w-md border border-slate-100">
        <div className="flex items-center gap-3">
             <div className="bg-blue-100 p-2 rounded-full">🛰️</div>
             <div>
                <div className="font-bold text-slate-800">Flood Risk Heatmap</div>
                <div className="text-xs text-slate-500">Real-time Hydrological Stress Index (HSI) Zones</div>
             </div>
        </div>
        
        {/* Dynamic Status if hovering */}
        {hoveredZone ? (
             <div className="mt-3 p-2 bg-slate-50 rounded border border-slate-100 animate-in fade-in slide-in-from-top-1">
                <span className="text-xs font-semibold text-slate-500">Selected Zone:</span>
                <div className="text-sm font-medium text-slate-800">{hoveredZone.name}</div>
             </div>
        ) : (
            <div className="mt-3 text-xs text-slate-400 italic">Hover over zones for details...</div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute top-5 right-5 flex flex-col gap-2 z-10">
        <div className="bg-white/95 backdrop-blur rounded-xl shadow-lg flex flex-col overflow-hidden border border-slate-100">
            <MapButton icon="🔍" label="Zoom In" />
            <MapButton icon="🔍" label="Zoom Out" />
            <MapButton icon="📍" label="Center" />
            <div className="h-px bg-slate-100 my-1"></div>
            <MapButton 
            icon={showHeatmap ? "🔥" : "🌡️"} 
            label={showHeatmap ? "Hide Risks" : "Show Risks"} 
            onClick={() => setShowHeatmap(!showHeatmap)}
            active={showHeatmap}
            />
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg z-10 text-xs border border-slate-100">
        <strong className="block mb-2 text-slate-900 font-semibold">Risk Levels</strong>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
            <LegendItem color="bg-gray-300" label="Land Mass" />
            <LegendItem color="bg-blue-500" label="River Basins" />
            {showHeatmap && (
                <>
                    <LegendItem color="bg-red-500" label="Critical (>0.8 HSI)" />
                    <LegendItem color="bg-orange-500" label="Warning (0.5-0.8)" />
                    <LegendItem color="bg-yellow-400" label="Watch (<0.5)" />
                </>
            )}
        </div>
      </div>
    </div>
  );
};

const MapButton = ({ icon, label, onClick, active }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 hover:bg-gray-100 font-semibold text-xs border-b border-gray-100 last:border-0 text-left transition-colors flex items-center gap-2 ${active ? 'bg-blue-50 text-blue-700' : 'text-blue-500'}`}
  >
    {icon} {label}
  </button>
);

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-2 mb-2 last:mb-0">
    <div className={`w-6 h-4 rounded ${color}`}></div>
    <span>{label}</span>
  </div>
);

export default SatelliteMap;
