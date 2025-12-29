import os
import numpy as np
import logging

try:
    import tensorflow as tf
    TF_AVAILABLE = True
except ImportError as e:
    tf = None
    TF_AVAILABLE = False
    print(f"Warning: TensorFlow could not be imported. ML features will be disabled. Error: {e}")

# Configure proper logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FloodModelService:
    def __init__(self):
        self.model = None
        if TF_AVAILABLE:
            self.load_model()
        else:
            logger.warning("TensorFlow not available, skipping model load.")

    def load_model(self):
        # Potential paths for the model
        paths = [
            "models/rainfall_lstm.h5",              # New LSTM model
            "../models/rainfall_lstm.h5",
            "c:/Users/ADRAJ/Downloads/FloodFusionAlert/models/rainfall_lstm.h5",
            "models/flood_model.h5",              # Legacy/Fallback
            "../models/flood_model.h5",
            "/app/models/flood_model.h5",
            "c:/Users/ADRAJ/Downloads/FloodFusionAlert/models/flood_model.h5"
        ]
        
        for path in paths:
            if os.path.exists(path):
                try:
                    logger.info(f"Loading model from {path}...")
                    self.model = tf.keras.models.load_model(path)
                    logger.info("Model loaded successfully.")
                    return
                except Exception as e:
                    logger.error(f"Failed to load model from {path}: {e}")
        
        logger.warning("Models (rainfall_lstm.h5 or flood_model.h5) not found. Predictions will be unavailable.")

    def predict(self, features: list):
        if not self.model:
            return None
            
        try:
            # Check model input shape to decide reshaping
            input_shape = self.model.input_shape
            input_data = np.array(features)
            
            # LSTM expects (batch, steps, features) -> 3D
            if len(input_shape) == 3:
                # Reshape to (1, len(features), 1) assuming univariate sequence
                input_data = input_data.reshape(1, len(features), 1)
            else:
                # Fallback for Dense/RF models -> (1, num_features)
                input_data = input_data.reshape(1, -1)
                
            prediction = self.model.predict(input_data)
            return float(prediction[0][0]) # Assuming scalar output
        except Exception as e:
            logger.error(f"Prediction error: {e}")
            return None

# Singleton instance
ml_service = FloodModelService()
