import { useEffect, useState } from 'react';
import { fetchAlertStatus } from '../api/alerts';
import AlertCard from '../components/AlertCard';
import SignalGauge from '../components/SignalGauge';

const CommandCenter = () => {
  const [data, setData] = useState(null);
  
  // Timeline Action States
  const [alertActionState, setAlertActionState] = useState('idle');
  const [shelterActionState, setShelterActionState] = useState('idle');
  const [evacuationActionState, setEvacuationActionState] = useState('idle');

  // Quick Action States
  const [quickActions, setQuickActions] = useState({
    sms: 'idle',
    whatsapp: 'idle',
    sdrf: 'idle',
    export: 'idle',
    share: 'idle'
  });

  useEffect(() => {
    fetchAlertStatus().then(setData);
  }, []);

  // Simulating API Calls
  const handleSendAlerts = () => {
    setAlertActionState('loading');
    setTimeout(() => { setAlertActionState('sent'); }, 2000);
  };

  const handleCheckShelter = () => {
    setShelterActionState('loading');
    setTimeout(() => { setShelterActionState('checked'); }, 1500);
  };

  const handleStartEvacuation = () => {
    setEvacuationActionState('loading');
    setTimeout(() => { setEvacuationActionState('started'); }, 2500);
  };

  // Quick Action Handler
  const handleQuickAction = (key) => {
    setQuickActions(prev => ({ ...prev, [key]: 'loading' }));
    setTimeout(() => {
        setQuickActions(prev => ({ ...prev, [key]: 'success' }));
        // Reset success state after 3 seconds for reusable buttons
        setTimeout(() => {
            setQuickActions(prev => ({ ...prev, [key]: 'idle' }));
        }, 3000);
    }, 1500);
  };

  if (!data) return <div className="p-10 text-center">Loading Command Center...</div>;

  return (
    <div className="max-w-[1400px] mx-auto p-5">
      <div className="bg-white p-8 rounded-xl shadow-sm mb-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">🌊 FLOOD ALERT COMMAND CENTER</h1>
        <p className="text-gray-500">Narmada Basin | Bhopal District | Last Updated: 5 minutes ago</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <AlertCard 
          status={data.status}
          confidence={data.confidence}
          river={data.river}
          impactTime={data.impactTime}
          population={data.population}
          villages={data.villages}
          color={data.status === 'WARNING' ? 'orange' : 'red'}
        />
        <SignalGauge value={data.hsi} breakdown={data.hsiBreakdown} />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">🎯 Why This Alert? (Top Contributing Factors)</h2>
        <FactorItem 
          label="Rainfall 92% Above Normal" 
          badge="STRONGEST FACTOR" 
          color="red"
        />
        <FactorItem 
          label="Soil Saturation 72% (Critical at 75%)" 
          badge="CRITICAL" 
          color="orange"
        />
        <FactorItem 
          label="Multiple Tributaries Active Simultaneously" 
          badge="MULTIPLICATIVE" 
          color="orange"
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">⏰ ACTION TIMELINE (What to Do & When)</h2>
        <div className="space-y-6 relative ml-4 border-l-4 border-blue-100 pl-8 py-2">
           {/* Current Item */}
           <TimelineItem 
             time="✅ HOUR 0-4 (URGENT - DO NOW)"
             actions={[
                "Alert all district officials",
                "Activate emergency operations center",
                "Pre-position 8 rescue boats"
             ]}
             status={alertActionState === 'sent' ? "✅ Alerts successfully broadcast to all channels" : "Status: Alerts pending confirmation"}
             button={
                alertActionState === 'idle' ? "Send Alerts Now" :
                alertActionState === 'loading' ? "Sending..." :
                "Alerts Sent ✅"
             }
             buttonColor={alertActionState === 'sent' ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}
             isCurrent
             onClick={handleSendAlerts}
             disabled={alertActionState !== 'idle'}
           />
           
           <TimelineItem 
             time="⏳ HOUR 4-12 (PREPARE)"
             actions={[
               "Activate shelter spaces (8,000 bed capacity)",
               "Pre-position food/medical supplies",
               "Conduct evacuation drills"
             ]}
             status={shelterActionState === 'checked' ? "✅ 4/5 Shelters confirmed ready (Cap: 6500)" : null}
             button={
                shelterActionState === 'idle' ? "Check Shelter Status" :
                shelterActionState === 'loading' ? "Checking..." :
                "Status Verified ✅"
             }
             buttonColor={shelterActionState === 'checked' ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"}
             onClick={handleCheckShelter}
             disabled={shelterActionState !== 'idle'}
           />

           <TimelineItem 
             time="⏳ HOUR 12-24 (BEGIN EVACUATION)"
             actions={[
               "Start Phase 1 evacuation (28 villages)",
               "Deploy buses on evacuation routes",
               "Log evacuees in real-time"
             ]}
             status={evacuationActionState === 'started' ? "⚠️ Evacuation Protocol Initiated: Phase 1" : null}
             button={
                evacuationActionState === 'idle' ? "Start Evacuation" :
                evacuationActionState === 'loading' ? "Initiating..." :
                "Evacuation Active ⚠️"
             }
             buttonColor={evacuationActionState === 'started' ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-500 hover:bg-blue-600"}
             onClick={handleStartEvacuation}
             disabled={evacuationActionState !== 'idle'}
           />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <h2 className="text-xl font-bold text-slate-800 mb-4">📊 Confidence & Uncertainty</h2>
           <div className="flex justify-between border-b border-gray-100 py-3">
             <span className="font-semibold text-gray-500">Overall Confidence:</span>
             <span className="font-bold text-slate-800">{data.confidence}</span>
           </div>
           
           <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden my-4">
             <div className="h-full bg-gradient-to-r from-green-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm" style={{width: '82%'}}>
               82% Confidence
             </div>
           </div>
           <p className="text-sm text-gray-500 mb-4">
             <strong>What this means:</strong><br/>
             In 82 out of 100 similar situations, floods occurred within the predicted time range.
           </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <h2 className="text-xl font-bold text-slate-800 mb-4">🚨 Quick Actions</h2>
           <div className="grid grid-cols-2 gap-4">
             <ActionButton 
                label={quickActions.sms === 'idle' ? "[ Send SMS to DM ]" : quickActions.sms === 'loading' ? "Sending..." : "SMS Sent ✅"} 
                danger 
                onClick={() => handleQuickAction('sms')}
                isLoading={quickActions.sms === 'loading'}
                isSuccess={quickActions.sms === 'success'}
             />
             <ActionButton 
                label={quickActions.whatsapp === 'idle' ? "[ Send WhatsApp ]" : quickActions.whatsapp === 'loading' ? "Sending..." : "Message Sent ✅"} 
                danger 
                onClick={() => handleQuickAction('whatsapp')}
                isLoading={quickActions.whatsapp === 'loading'}
                isSuccess={quickActions.whatsapp === 'success'}
             />
             <ActionButton 
                label={quickActions.sdrf === 'idle' ? "[ Call SDRF ]" : quickActions.sdrf === 'loading' ? "Calling..." : "Calling..."} 
                onClick={() => handleQuickAction('sdrf')}
                isLoading={quickActions.sdrf === 'loading'}
                isSuccess={quickActions.sdrf === 'success'}
             />
             <ActionButton 
                label={quickActions.export === 'idle' ? "[ Export Report ]" : quickActions.export === 'loading' ? "Exporting..." : "Exported 📄"} 
                onClick={() => handleQuickAction('export')}
                isLoading={quickActions.export === 'loading'}
                isSuccess={quickActions.export === 'success'}
             />
             <ActionButton 
                label={quickActions.share === 'idle' ? "[ Share with State ]" : quickActions.share === 'loading' ? "Sharing..." : "Shared ✅"} 
                fullWidth 
                onClick={() => handleQuickAction('share')}
                isLoading={quickActions.share === 'loading'}
                isSuccess={quickActions.share === 'success'}
             />
           </div>
        </div>
      </div>
    </div>
  );
};

const FactorItem = ({ label, badge, color }) => {
  const borderColors = {
    red: "border-l-red-500",
    orange: "border-l-orange-500",
  };
  const badgeColors = {
    red: "bg-red-100 text-red-800",
    orange: "bg-orange-100 text-orange-800",
  };
  
  return (
    <div className={`flex justify-between items-center p-4 mb-3 bg-gray-50 rounded-lg border-l-4 ${borderColors[color] || borderColors.orange}`}>
      <span className="font-semibold text-slate-800 flex items-center gap-2">
        {color === 'red' ? '🔴' : '🟠'} {label}
      </span>
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${badgeColors[color] || badgeColors.orange}`}>
        {badge}
      </span>
    </div>
  );
};

const TimelineItem = ({ time, actions, status, button, buttonColor, isCurrent, onClick, disabled }) => (
  <div className={`p-6 mb-6 rounded-lg relative ${isCurrent ? 'bg-red-50 border-l-4 border-red-500 -ml-[36px]' : 'bg-gray-50 border-l-4 border-blue-500 -ml-[36px]'}`}>
    {isCurrent && <div className="absolute -left-[14px] top-6 w-6 h-6 bg-red-500 rounded-full border-4 border-white shadow-sm"></div>}
    {!isCurrent && <div className="absolute -left-[14px] top-6 w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-sm"></div>}
    
    <div className={`font-bold text-sm mb-2 ${isCurrent ? 'text-red-500' : 'text-blue-500'}`}>{time}</div>
    {actions.map((action, i) => (
      <div key={i} className="text-slate-700 mb-1 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"></span> {action}
      </div>
    ))}
    {status && <div className="text-xs text-slate-500 mt-2 italic font-semibold">{status}</div>}
    <button 
        onClick={onClick}
        disabled={disabled}
        className={`mt-4 px-6 py-2 rounded-lg text-white font-bold text-sm transition-all shadow-sm ${buttonColor} ${disabled ? 'opacity-80 cursor-not-allowed transform-none' : 'hover:shadow-md'}`}
    >
      {button}
    </button>
  </div>
);

const ActionButton = ({ label, danger, fullWidth, onClick, isLoading, isSuccess }) => {
    let bgColor = danger ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600';
    if (isSuccess) bgColor = 'bg-green-500 hover:bg-green-600';
    if (isLoading) bgColor = 'bg-gray-400 cursor-wait';

    return (
        <button 
            onClick={onClick}
            disabled={isLoading || isSuccess}
            className={`py-3 px-4 rounded-lg font-bold text-sm transition-all shadow-sm text-white ${bgColor} ${fullWidth ? 'col-span-2' : ''} active:scale-95`}
        >
            {label}
        </button>
    );
};

export default CommandCenter;
