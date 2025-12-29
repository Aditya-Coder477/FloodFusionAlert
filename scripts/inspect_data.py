import pandas as pd
import os

# Define file paths
# Note: Adjusting paths based on the user's workspace structure
base_dir = "data"
ganga_path = os.path.join(base_dir, "archive", "ganga.csv")
sangam_path = os.path.join(base_dir, "archive", "sangam.csv")
flood_risk_path = os.path.join(base_dir, "archive (1)", "flood_risk.csv")

def inspect_df(name, df):
    print(f"\n{'='*20} {name} {'='*20}")
    print(f"Shape: {df.shape}")
    print("\n--- Info ---")
    df.info()
    print("\n--- Missing Values ---")
    print(df.isnull().sum())
    print("\n--- Head ---")
    print(df.head())
    print(f"\n{'='*50}\n")

def main():
    try:
        ganga = pd.read_csv(ganga_path)
        inspect_df("Ganga Data", ganga)
    except FileNotFoundError:
        print(f"Error: Could not find {ganga_path}")

    try:
        sangam = pd.read_csv(sangam_path)
        inspect_df("Sangam Data", sangam)
    except FileNotFoundError:
        print(f"Error: Could not find {sangam_path}")

    try:
        flood_risk = pd.read_csv(flood_risk_path)
        inspect_df("Flood Risk Data", flood_risk)
    except FileNotFoundError:
        print(f"Error: Could not find {flood_risk_path}")

if __name__ == "__main__":
    main()
