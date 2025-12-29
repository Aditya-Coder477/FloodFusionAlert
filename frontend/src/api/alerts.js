
export const fetchAlertStatus = async () => {
  try {
    const response = await fetch('/api/alerts/current');
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.warn("API fetch failed, using mock data", error);
    return {
      status: "WARNING",
      confidence: "82%",
      river: "Narmada",
      impactTime: "48±6 hours",
      population: "450,000+",
      villages: "28 villages",
      hsi: 73,
      hsiBreakdown: { rainfall: 34, soil: 24, discharge: 40, lag: 8 }
    };
  }
};
