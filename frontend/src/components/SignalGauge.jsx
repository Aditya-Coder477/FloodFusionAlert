
const SignalGauge = ({ value = 73, breakdown }) => {
  // value is 0-100
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border-l-8 border-orange-500 bg-gradient-to-r from-orange-50/50 to-white hover:-translate-y-1 transition-transform duration-300">
      <div className="text-lg font-bold text-blue-900 mb-4">River Stress Index (HSI)</div>
      
      <div className="text-center">
        <div className="text-5xl font-bold text-orange-500 my-5">{value}/100</div>
        
        <div className="w-full h-10 bg-gray-200 rounded-full overflow-hidden mb-4 relative">
          <div 
            className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 flex items-center justify-end pr-3 text-white font-bold text-xs transition-all duration-1000"
            style={{ width: `${value}%` }}
          >
          </div>
        </div>
        
        <div className="text-orange-500 font-bold mt-2">
          🔴 CRITICAL - System at breaking point
        </div>
      </div>

      {breakdown && (
        <p className="mt-4 text-xs text-gray-500">
          <strong>Breakdown:</strong><br/>
          Rainfall: {breakdown.rainfall}/100 | Soil: {breakdown.soil}/100 | Discharge: {breakdown.discharge}/100 | Lag: {breakdown.lag}/100
        </p>
      )}
    </div>
  );
};

export default SignalGauge;
