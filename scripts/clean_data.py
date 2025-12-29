import pandas as pd
import os

# Define file paths
base_dir = "data"
ganga_path = os.path.join(base_dir, "archive", "ganga.csv")
sangam_path = os.path.join(base_dir, "archive", "sangam.csv")
flood_risk_path = os.path.join(base_dir, "archive (1)", "flood_risk.csv")

# Output directory
output_dir = os.path.join(base_dir, "processed")
os.makedirs(output_dir, exist_ok=True)

def process_water_quality(df_path, name):
    print(f"Processing {name}...")
    try:
        df = pd.read_csv(df_path)
        # Parse Dates
        df['Date'] = pd.to_datetime(df['Date'])
        # Sort by date just in case
        df = df.sort_values('Date')
        
        # Save
        output_path = os.path.join(output_dir, f"{name}_processed.csv")
        df.to_csv(output_path, index=False)
        print(f"Saved {name} to {output_path}")
        return df
    except Exception as e:
        print(f"Error processing {name}: {e}")
        return None

def process_flood_risk(df_path):
    print("Processing Flood Risk Data...")
    try:
        df = pd.read_csv(df_path)
        
        # Encode Categorical Variables using One-Hot Encoding
        # Columns: Land Cover, Soil Type
        categorical_cols = ['Land Cover', 'Soil Type']
        print(f"Encoding columns: {categorical_cols}")
        
        df_encoded = pd.get_dummies(df, columns=categorical_cols, prefix=categorical_cols)
        
        # Save
        output_path = os.path.join(output_dir, "flood_risk_processed.csv")
        df_encoded.to_csv(output_path, index=False)
        print(f"Saved Flood Risk Data to {output_path}")
        return df_encoded
    except Exception as e:
        print(f"Error processing Flood Risk Data: {e}")
        return None

def main():
    process_water_quality(ganga_path, "ganga")
    process_water_quality(sangam_path, "sangam")
    process_flood_risk(flood_risk_path)

if __name__ == "__main__":
    main()
