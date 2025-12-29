import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from sklearn.preprocessing import MinMaxScaler
import os

# Paths
processed_dir = os.path.join("data", "processed")
output_dir = "models"
os.makedirs(output_dir, exist_ok=True)

def create_sequences(data, seq_length):
    X = []
    y = []
    for i in range(len(data) - seq_length):
        X.append(data[i:i+seq_length])
        y.append(data[i+seq_length])
    return np.array(X), np.array(y)

def train_lstm():
    print("Loading Ganga water quality data...")
    df = pd.read_csv(os.path.join(processed_dir, "ganga_processed.csv"))
    df['Date'] = pd.to_datetime(df['Date'])
    
    # Synthesize Rainfall Data (Seasonality + Random Noise)
    # Assuming peak rainfall in July-Aug (Months 7-8)
    print("Synthesizing Rainfall data (missing in original dataset)...")
    df['Month'] = df['Date'].dt.month
    
    # Simple seasonality: 0 to 1 scale based on month distance from July (7)
    df['Seasonality'] = np.where(df['Month'].isin([6, 7, 8, 9]), 1.0, 0.2)
    
    # Add noise
    np.random.seed(42)
    df['Rainfall'] = df['Seasonality'] * np.random.uniform(0, 100, size=len(df)) + np.random.normal(0, 5, size=len(df))
    df['Rainfall'] = df['Rainfall'].clip(lower=0) # No negative rainfall
    
    # Use only Rainfall for this simple demo (Univariate Time Series)
    data = df[['Rainfall']].values
    
    # Scaling
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data)
    
    # Sequence Generation
    SEQ_LENGTH = 30 # Look back 30 steps (e.g., 30 hours if hourly)
    print(f"Generating sequences with length {SEQ_LENGTH}...")
    X, y = create_sequences(scaled_data, SEQ_LENGTH)
    
    # Split
    train_size = int(len(X) * 0.8)
    X_train, X_test = X[:train_size], X[train_size:]
    y_train, y_test = y[:train_size], y[train_size:]
    
    # Build Model
    print("Building LSTM Model...")
    model = Sequential([
        LSTM(units=50, return_sequences=True, input_shape=(X_train.shape[1], 1)),
        LSTM(units=50),
        Dense(1)
    ])
    
    model.compile(optimizer='adam', loss='mean_squared_error')
    
    # Train
    print("Training Model...")
    history = model.fit(X_train, y_train, epochs=5, batch_size=64, validation_data=(X_test, y_test), verbose=1)
    
    # Evaluate
    loss = model.evaluate(X_test, y_test, verbose=0)
    print(f"Test MSE: {loss:.4f}")
    
    # Save
    model_path = os.path.join(output_dir, "rainfall_lstm.h5")
    model.save(model_path)
    print(f"Model saved to {model_path}")

def main():
    train_lstm()

if __name__ == "__main__":
    main()
