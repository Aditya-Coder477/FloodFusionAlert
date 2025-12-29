def calculate_hsi(rainfall_mm: float, soil_moisture_index: float, river_level_m: float) -> float:
    """
    Calculates the Hydrological Stress Index (HSI) based on rainfall, soil moisture, and river level.
    
    The HSI is a physics-based proxy for flood potential, ranging from 0.0 to 1.0.
    
    Physics/Logic:
    - Rainfall contributes promptly to surface runoff.
    - High soil moisture reduces infiltration capacity, increasing runoff.
    - High river levels reduce the hydraulic gradient, slowing drainage and increasing backwater effects.
    
    Formula Approximation:
    HSI = w_r * f(rainfall) + w_s * f(soil) + w_l * f(river)
    
    Args:
        rainfall_mm: Rainfall in mm (last 24h).
        soil_moisture_index: 0.0 (dry) to 1.0 (saturated).
        river_level_m: River water level in meters.
        
    Returns:
        float: HSI value between 0.0 and 1.0.
    """
    
    # 1. Normalize Rainfall (Assume 200mm is extreme catastrophic rainfall)
    # Using a sigmoidal or capped linear function often models saturation better, 
    # but linear is safer for index interpretation without calibration.
    max_rainfall = 200.0
    norm_rainfall = min(rainfall_mm / max_rainfall, 1.0)
    
    # 2. Normalize Soil Moisture (Already 0-1 usually, but clamp it just in case)
    norm_soil = min(max(soil_moisture_index, 0.0), 1.0)
    
    # 3. Normalize River Level 
    # Assume base level 70m, Danger level 85m.
    # We care about the "fill" of the channel relative to danger capacity.
    base_level = 70.0
    danger_level = 85.0
    current_level = max(river_level_m, base_level)
    
    # Calculate how close we are to danger. 
    # if level >= danger, term should be near 1.0
    norm_river = (current_level - base_level) / (danger_level - base_level)
    norm_river = min(max(norm_river, 0.0), 1.0)
    
    # Weights - heuristic based on contribution to immediate flood risk
    # Rainfall: 0.5 (Primary driver)
    # River Level: 0.3 (Boundary condition)
    # Soil Moisture: 0.2 (Antecedent condition)
    
    w_rain = 0.5
    w_river = 0.3
    w_soil = 0.2
    
    hsi = (w_rain * norm_rainfall) + (w_river * norm_river) + (w_soil * norm_soil)
    
    return round(hsi, 4)

def determine_risk_category(hsi: float) -> str:
    if hsi < 0.3:
        return "LOW"
    elif hsi < 0.6:
        return "MEDIUM"
    elif hsi < 0.8:
        return "HIGH"
    else:
        return "CRITICAL"
