
const TechMonitor = () => {
    return (
        <div className="bg-slate-900 min-h-screen text-slate-200 font-mono p-5">
            <div className="max-w-[1600px] mx-auto">
                <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 mb-6">
                    <h1 className="text-blue-400 text-2xl font-bold mb-1">🔧 TECHNICAL MONITORING DASHBOARD</h1>
                    <p className="text-slate-400 text-sm">System Health Status | Updated: Real-time (every 1 minute)</p>
                </div>

                {/* Signals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <SignalCard 
                        title="SIGNAL 1: LSTM Weather Pattern"
                        status="RUNNING"
                        confidence={78}
                        rows={[
                            { label: "Last update", value: "5 min ago" },
                            { label: "Model version", value: "LSTM-v3.2" },
                            { label: "Validation accuracy", value: "87.3%" }
                        ]}
                        sources={["IMD API", "OpenWeather"]}
                    />
                    <SignalCard 
                        title="SIGNAL 2: HSI River Stress"
                        status="RUNNING"
                        confidence={73}
                        rows={[
                            { label: "Current value", value: "73/100" },
                            { label: "Rainfall comp", value: "34/100" },
                            { label: "Diskarge comp", value: "40/100" },
                            { label: "Calculation time", value: "0.23 sec" }
                        ]}
                        sources={["IMD API", "Sensors", "NASA SMAP"]}
                        barColor="from-orange-500 to-red-500"
                    />
                    <SignalCard 
                        title="SIGNAL 3: CatBoost Classifier"
                        status="RUNNING"
                        confidence={82}
                        rows={[
                            { label: "Prediction", value: "WARNING" },
                            { label: "Top factor 1", value: "Rainfall+92%" },
                            { label: "Top factor 2", value: "Soil@72%" },
                            { label: "Model version", value: "CatBoost-v2.1" }
                        ]}
                        sources={["Feature eng", "Model v2.1"]}
                    />
                    <SignalCard 
                        title="SIGNAL 4: Satellite Validation"
                        status="DATA OK"
                        rows={[
                            { label: "Water area", value: "148 km²" },
                            { label: "Change", value: "+2.1%" },
                            { label: "Last image", value: "40 min ago" },
                            { label: "Next image", value: "In 4.8 hours" },
                            { label: "Cloud cover", value: "0%" }
                        ]}
                        sources={["Sentinel-1", "ESA Copernicus"]}
                        noConfidence
                    />
                </div>

                {/* Ensemble Voting */}
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
                    <div className="text-blue-400 font-bold mb-4 text-base">🗳️ ENSEMBLE VOTING SYSTEM</div>
                    
                    <VoteResult label="LSTM Signal votes" value="⚠️ WARNING (78% confidence)" color="text-yellow-400" />
                    <VoteResult label="HSI Signal votes" value="⚠️ ORANGE = WARNING (73/100)" color="text-yellow-400" />
                    <VoteResult label="CatBoost Signal votes" value="⚠️ WARNING (82% confidence)" color="text-yellow-400" />
                    <VoteResult label="Satellite Signal votes" value="✓ CONSISTENT (water rising)" color="text-green-500" />

                    <div className="bg-slate-900 p-5 rounded-md mt-4 border-2 border-green-500">
                        <div className="text-green-500 font-bold mb-2">✓ UNANIMOUS VOTE: 4/4 SIGNALS</div>
                        <div className="flex justify-between py-1 border-b border-slate-800">
                            <span>FINAL ALERT LEVEL:</span>
                            <span className="text-yellow-400 text-lg font-bold">⚠️ WARNING</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-slate-800">
                            <span>Overall confidence:</span>
                            <span className="text-blue-400 font-bold">82%</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span>Consensus strength:</span>
                            <span className="text-green-500 font-bold">VERY STRONG</span>
                        </div>
                    </div>
                </div>

                {/* Pipeline Health & Logs */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                        <div className="text-blue-400 font-bold mb-4 text-sm">📡 DATA PIPELINE HEALTH</div>
                        <PipelineItem label="Weather API (IMD)" status="✓ Connected (5 min ago)" />
                        <PipelineItem label="River Sensors (12 stations)" status="✓ Connected (10 min ago)" />
                        <PipelineItem label="Satellite API (Sentinel-1)" status="✓ Connected (40 min ago)" />
                        <PipelineItem label="Database (PostgreSQL + PostGIS)" status="✓ Healthy (78% storage used)" />
                        <PipelineItem label="Redis Cache" status="✓ Healthy (45% memory used)" />
                        <PipelineItem label="ML Model Inference Servers" status="✓ Running (uptime: 45 days)" />
                        <PipelineItem label="SMS Gateway (Twilio)" status="✓ Connected (delivery rate: 99.7%)" />
                        <PipelineItem label="WhatsApp API" status="✓ Connected (delivery rate: 98.4%)" />
                    </div>

                    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                        <div className="text-blue-400 font-bold mb-4 text-sm">📋 RECENT EVENTS (Last 24 Hours)</div>
                        <PipelineItem label="11:10 UTC - Alert escalated: WATCH → WARNING" status="⚠️ ALERT SENT" statusColor="text-yellow-500" />
                        <PipelineItem label="10:45 UTC - Satellite image received & processed" status="✓ SUCCESS" />
                        <PipelineItem label="10:30 UTC - SMS sent to DM" status="✓ DELIVERED" />
                        <PipelineItem label="09:15 UTC - River sensor #7 missed transmission" status="⚠️ RECOVERED" statusColor="text-orange-400" isError />
                        <PipelineItem label="04:30 UTC - Routine backup completed" status="✓ 2.3 GB backed up" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const SignalCard = ({ title, status, confidence, rows, sources, barColor = "from-green-500 to-yellow-500", noConfidence }) => (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-5 border-l-4 border-l-green-500">
        <div className="flex items-center gap-2 text-blue-400 font-bold text-sm mb-3">
             <span className="w-2 h-2 rounded-full bg-green-500"></span>
             {title}
        </div>
        <div className="flex justify-between py-1 text-slate-300 border-b border-slate-700 text-xs">
            <span className="text-slate-400">Status:</span>
            <span className="font-bold text-blue-400">✓ {status}</span>
        </div>
        
        {!noConfidence && (
            <>
                <div className="flex justify-between py-1 text-slate-300 text-xs">
                    <span className="text-slate-400">Confidence:</span>
                    <span className="font-bold text-blue-400">{confidence}%</span>
                </div>
                <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden my-2">
                    <div className={`h-full bg-gradient-to-r ${barColor} flex items-center justify-center text-slate-900 font-bold text-[10px]`} style={{width: `${confidence}%`}}>
                        {confidence}%
                    </div>
                </div>
            </>
        )}

        {rows.map((row, i) => (
             <div key={i} className="flex justify-between py-1 text-slate-300 border-b border-slate-700 last:border-0 text-xs">
                <span className="text-slate-400">{row.label}:</span>
                <span className="font-bold text-blue-400">{row.value}</span>
            </div>
        ))}
        
        <div className="flex flex-wrap gap-2 mt-3">
            {sources.map((src, i) => (
                <span key={i} className="bg-slate-700 px-2 py-1 rounded-full text-[10px] text-slate-300 flex items-center gap-1 border-l-2 border-green-500">
                    ✓ {src}
                </span>
            ))}
        </div>
    </div>
);

const VoteResult = ({ label, value, color }) => (
    <div className="bg-slate-900 p-3 rounded mb-2 border-l-4 border-green-500 flex justify-between text-sm">
        <span className="text-slate-300">{label}:</span>
        <span className={color}>{value}</span>
    </div>
);

const PipelineItem = ({ label, status, statusColor = "text-green-500", isError }) => (
    <div className={`p-2 mb-2 bg-slate-900 rounded flex justify-between items-center text-xs ${isError ? 'bg-red-900/20 text-red-300' : 'text-slate-300'}`}>
        <span>{label}</span>
        <div className="flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${isError ? 'bg-red-500' : 'bg-green-500'}`}></span>
            <span className={statusColor}>{status}</span>
        </div>
    </div>
);

export default TechMonitor;
