import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import os

# Paths
processed_dir = os.path.join("data", "processed")
output_dir = os.path.join("output", "models")
os.makedirs(output_dir, exist_ok=True)

def train_flood_model():
    print("Loading processed Flood Risk Data...")
    df = pd.read_csv(os.path.join(processed_dir, "flood_risk_processed.csv"))
    
    # Features and Target
    X = df.drop('Flood Occurred', axis=1)
    y = df['Flood Occurred']
    
    # Split
    print("Splitting data into Train and Test sets...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train
    print("Training Random Forest Classifier...")
    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf.fit(X_train, y_train)
    
    # Predict
    print("Evaluating model...")
    y_pred = rf.predict(X_test)
    
    # Metrics
    acc = accuracy_score(y_test, y_pred)
    print(f"\nAccuracy: {acc:.4f}")
    
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    
    # Feature Importance
    importances = pd.Series(rf.feature_importances_, index=X.columns).sort_values(ascending=False)
    print("\nTop 10 Feature Importances:")
    print(importances.head(10))

def main():
    train_flood_model()

if __name__ == "__main__":
    main()
