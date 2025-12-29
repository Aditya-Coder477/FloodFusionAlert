import SatelliteMap from '../components/SatelliteMap';

const SatelliteDashboard = () => {
  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden bg-gray-100">
       {/* Map Area */}
       <div className="flex-1 relative bg-slate-800">
         <SatelliteMap />
       </div>

       {/* Side Panel */}
       <div className="w-full md:w-[350px] bg-white border-l border-gray-200 overflow-y-auto">
          {/* Stats */}
          <PanelSection title="📊 Flood Extent Statistics">
             <StatRow label="Baseline water" value="145 km²" />
             <StatRow label="Current water" value="162 km²" />
             <StatRow label="Increase" value="+17 km² (+11.7%)" />
             <StatRow label="Urban flooded" value="8.2 km²" />
             <StatRow label="Rural flooded" value="6.1 km²" />
          </PanelSection>

          {/* Stranded */}
          <PanelSection title="🚨 Stranded Populations">
             <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                <AlertItem 
                  title="📍 Village A"
                  type="alert"
                  details={[
                    "Population: 2,340 people",
                    "Status: URGENT",
                    "Water level: 145cm above normal",
                    "Action: Boat evacuation",
                    "ETA boat: 15 minutes"
                  ]}
                  action="Dispatch Boat"
                />
                <AlertItem 
                  title="📍 Village B"
                  type="alert"
                  details={[
                     "Population: 890 people",
                     "Status: CRITICAL",
                     "Water level: 210cm above normal",
                     "Action: IMMEDIATE evacuation",
                     "Method: Road + buses"
                  ]}
                  action="PRIORITY ALERT"
                  danger
                />
                <AlertItem 
                  title="📍 Urban Zone C"
                  type="warning"
                  details={[
                     "Population: 1,250 people",
                     "Status: WARNING",
                     "Water level: 85cm above street",
                     "Action: Pedestrian + buses"
                  ]}
                  action="Deploy Resources"
                />
             </div>
          </PanelSection>

          {/* Boats */}
          <PanelSection title="⛵ Rescue Boats Status">
             <BoatItem name="Boat-1" status="Ready" location="Bridge dock" capacity="20" />
             <BoatItem name="Boat-2" status="Standby" location="Supply dock" capacity="25" />
             <BoatItem name="Boat-3" status="En route" extra="50% toward Village A" eta="15 min" active />
             <BoatItem name="Boat-4" status="Returning" extra="Post-rescue refueling" eta="20 min" />
          </PanelSection>

          {/* Shelters */}
          <PanelSection title="🏥 Shelter Capacity">
             <ShelterItem name="School A" total={2000} current={1340} />
             <ShelterItem name="School B" total={1800} current={890} />
             <ShelterItem name="Stadium" total={3200} current={1200} />
          </PanelSection>

          {/* Actions */}
          <div className="p-5 border-b border-gray-200">
             <div className="text-sm font-bold text-blue-900 mb-3">⚡ Quick Actions</div>
             <button className="w-full p-2 mb-2 rounded bg-red-500 hover:bg-red-600 text-white font-bold text-xs transition-colors">🆘 Request More Boats</button>
             <button className="w-full p-2 mb-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs transition-colors">📞 Contact Commanders</button>
             <button className="w-full p-2 mb-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs transition-colors">📊 Export Report</button>
          </div>
       </div>
    </div>
  );
};

const PanelSection = ({ title, children }) => (
  <div className="p-5 border-b border-gray-200">
     <div className="text-sm font-bold text-blue-900 mb-3">{title}</div>
     {children}
  </div>
);

const StatRow = ({ label, value }) => (
  <div className="flex justify-between py-1 text-xs border-b border-gray-100 last:border-0">
    <span className="text-gray-500">{label}:</span>
    <span className="font-bold text-blue-900">{value}</span>
  </div>
);

const AlertItem = ({ title, type, details, action, danger }) => {
  const styles = {
    alert: "bg-red-50 border-l-4 border-red-500",
    warning: "bg-yellow-50 border-l-4 border-yellow-500",
  };

  return (
    <div className={`p-3 rounded mb-2 ${styles[type] || 'bg-gray-50'}`}>
       <div className="font-bold text-blue-900 mb-1 text-xs">{title}</div>
       <div className="text-[11px] text-gray-600 space-y-0.5 mb-2">
         {details.map((d, i) => <div key={i}>{d}</div>)}
       </div>
       <button className={`w-full py-1.5 rounded text-white font-bold text-[10px] ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-500 hover:bg-blue-600'}`}>
         {action}
       </button>
    </div>
  );
};

const BoatItem = ({ name, status, location, capacity, extra, eta, active }) => (
   <div className={`p-3 rounded mb-2 border-l-4 ${active ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-400'}`}>
      <div className="font-bold text-blue-900 text-xs mb-1">{name}</div>
      <div className="text-[11px] text-gray-600">
         {status && <div><strong>Status:</strong> {active ? '🟢' : '✓'} {status}</div>}
         {location && <div><strong>Location:</strong> {location}</div>}
         {capacity && <div><strong>Capacity:</strong> {capacity} people</div>}
         {extra && <div>{extra}</div>}
         {eta && <div><strong>ETA:</strong> {eta}</div>}
      </div>
   </div>
);

const ShelterItem = ({ name, total, current }) => {
  const percentage = Math.round((current / total) * 100);
  return (
    <div className="p-3 bg-green-50 rounded mb-2 border-l-4 border-green-500">
       <div className="font-bold text-blue-900 text-xs mb-1">{name}</div>
       <div className="text-[11px] text-gray-600 mb-1">
         <strong>Capacity:</strong> {total}<br/>
         <strong>Current:</strong> {current} ({percentage}%)
       </div>
       <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-1">
         <div className="h-full bg-gradient-to-r from-green-400 to-orange-500" style={{width: `${percentage}%`}}></div>
       </div>
       <div className="text-[10px] text-gray-500 font-bold">Available: {total - current} beds</div>
    </div>
  );
};

export default SatelliteDashboard;
