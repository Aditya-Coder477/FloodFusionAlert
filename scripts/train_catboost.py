import pandas as pd
from catboost import CatBoostClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import os
import pickle

# Paths
base_dir = "data"
# Use original file for CatBoost's native categorical handling
flood_risk_path = os.path.join(base_dir, "archive (1)", "flood_risk.csv")
output_dir = "models"
os.makedirs(output_dir, exist_ok=True)

def train_catboost():
    print("Loading Flood Risk Data...")
    df = pd.read_csv(flood_risk_path)
    
    # Identify Categorical Features
    cat_features = ['Land Cover', 'Soil Type']
    print(f"Categorical Features: {cat_features}")
    
    # Features and Target
    X = df.drop('Flood Occurred', axis=1)
    y = df['Flood Occurred']
    
    # Split
    print("Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train
    print("Training CatBoost Classifier...")
    model = CatBoostClassifier(
        iterations=500,
        learning_rate=0.1,
        depth=6,
        cat_features=cat_features,
        verbose=100
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate
    print("Evaluating model...")
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"\nAccuracy: {acc:.4f}")
    print(classification_report(y_test, y_pred))
    
    # Save Model (using pickle as requested)
    model_path = os.path.join(output_dir, "flood_risk_catboost.pkl")
    with open(model_path, 'wb') as f:
        pickle.dump(model, f)
    
    # Also save as CatBoost internal format for potential C++ usage
    model.save_model(os.path.join(output_dir, "flood_risk_catboost.cbm"))
    
    print(f"Model saved to {model_path}")

def main():
    train_catboost()

if __name__ == "__main__":
    main()
