
const AlertCard = ({ 
  status = "WARNING",
  confidence = "82%",
  river = "Narmada",
  impactTime = "48±6 hours",
  population = "450,000+",
  villages = "28 villages",
  color = "orange"
}) => {
  const colorMap = {
    green: {
      border: "border-green-500",
      bg: "bg-gradient-to-r from-green-50/50 to-white",
      badge: "bg-green-100 text-green-800",
      icon: "🟢"
    },
    yellow: {
      border: "border-yellow-500",
      bg: "bg-gradient-to-r from-yellow-50/50 to-white",
      badge: "bg-yellow-100 text-yellow-800",
      icon: "🟡"
    },
    orange: {
      border: "border-orange-500",
      bg: "bg-gradient-to-r from-orange-50/50 to-white",
      badge: "bg-orange-100 text-orange-800",
      icon: "🟠"
    },
    red: {
      border: "border-red-500",
      bg: "bg-gradient-to-r from-red-50/50 to-white",
      badge: "bg-red-100 text-red-800",
      icon: "🔴"
    }
  };

  const currentStyle = colorMap[color] || colorMap.orange;

  return (
    <div className={`notification-card bg-white p-6 rounded-xl shadow-md border-l-8 hover:-translate-y-1 transition-transform duration-300 ${currentStyle.border} ${currentStyle.bg}`}>
      <div className={`inline-block px-4 py-2 rounded-full font-bold text-sm mb-4 ${currentStyle.badge}`}>
        {currentStyle.icon} {status}
      </div>
      
      <div className="text-lg font-bold text-blue-900 mb-4">Current Alert Status</div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <InfoRow label="Status" value={status} highlight />
        <InfoRow label="Confidence" value={confidence} />
        <InfoRow label="River" value={river} />
        <InfoRow label="Expected Impact" value={impactTime} />
        <InfoRow label="Affected Population" value={population} />
        <InfoRow label="Villages at Risk" value={villages} />
      </div>
    </div>
  );
};

const InfoRow = ({ label, value, highlight }) => (
  <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
    <span className="font-semibold text-gray-500">{label}:</span>
    <span className={`font-bold ${highlight ? 'text-blue-900' : 'text-gray-800'}`}>{value}</span>
  </div>
);

export default AlertCard;
