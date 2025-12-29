import { Activity, Map, Monitor } from 'lucide-react';
import { useState } from 'react';
import CommandCenter from './pages/CommandCenter';
import SatelliteDashboard from './pages/SatelliteDashboard';
import TechMonitor from './pages/TechMonitor';

function App() {
  const [activeTab, setActiveTab] = useState('command');

  const renderContent = () => {
    switch (activeTab) {
      case 'command': return <CommandCenter />;
      case 'monitor': return <TechMonitor />;
      case 'satellite': return <SatelliteDashboard />;
      default: return <CommandCenter />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Navigation Bar */}
      <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌊</span>
              <span className="font-bold text-xl tracking-tight">FloodFusion Alert</span>
            </div>
            
            <div className="flex space-x-1">
              <NavButton 
                active={activeTab === 'command'} 
                onClick={() => setActiveTab('command')}
                icon={<Activity size={18} />}
                label="Command Center"
              />
              <NavButton 
                active={activeTab === 'monitor'} 
                onClick={() => setActiveTab('monitor')}
                icon={<Monitor size={18} />}
                label="Tech Monitor"
              />
              <NavButton 
                active={activeTab === 'satellite'} 
                onClick={() => setActiveTab('satellite')}
                icon={<Map size={18} />}
                label="Satellite Map"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {renderContent()}
      </main>
    </div>
  );
}

const NavButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
      active 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`}
  >
    {icon}
    {label}
  </button>
);

export default App;
