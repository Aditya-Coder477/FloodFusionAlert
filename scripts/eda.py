import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import os

# Set style
sns.set_theme(style="whitegrid")

# Paths
processed_dir = os.path.join("data", "processed")
output_dir = os.path.join("output", "eda")
os.makedirs(output_dir, exist_ok=True)

def plot_water_quality(name):
    print(f"Plotting {name} data...")
    df = pd.read_csv(os.path.join(processed_dir, f"{name}_processed.csv"))
    df['Date'] = pd.to_datetime(df['Date'])
    
    # Plot WQI over time
    plt.figure(figsize=(12, 6))
    sns.lineplot(data=df, x='Date', y='WQI')
    plt.title(f'{name.capitalize()} River Water Quality Index (WQI) Over Time')
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, f"{name}_wqi_trend.png"))
    plt.close()

    # Plot DO, pH, Temp
    fig, axes = plt.subplots(3, 1, figsize=(12, 12), sharex=True)
    sns.lineplot(data=df, x='Date', y='DO', ax=axes[0], color='blue').set_title('Dissolved Oxygen')
    sns.lineplot(data=df, x='Date', y='pH', ax=axes[1], color='green').set_title('pH Level')
    sns.lineplot(data=df, x='Date', y='Temp', ax=axes[2], color='red').set_title('Temperature')
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, f"{name}_parameters_trend.png"))
    plt.close()
    
    # Status Countplot
    plt.figure(figsize=(10, 6))
    sns.countplot(data=df, x='Status', order=df['Status'].value_counts().index)
    plt.title(f'{name.capitalize()} Water Quality Status Distribution')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, f"{name}_status_dist.png"))
    plt.close()

def plot_flood_correlations():
    print("Plotting Flood Risk correlations...")
    df = pd.read_csv(os.path.join(processed_dir, "flood_risk_processed.csv"))
    
    # Select only numeric columns for correlation
    # (One-hot encoded columns are numeric/bool, so they work)
    corr = df.corr()
    
    plt.figure(figsize=(16, 14))
    sns.heatmap(corr, annot=False, cmap='coolwarm', linewidths=0.5)
    plt.title('Flood Risk Feature Correlation Matrix')
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, "flood_risk_correlation.png"))
    plt.close()
    
    # Correlation with Target
    target_corr = corr['Flood Occurred'].sort_values(ascending=False)
    print("\nTop Correlations with 'Flood Occurred':")
    print(target_corr.head(10))
    print("\nBottom Correlations with 'Flood Occurred':")
    print(target_corr.tail(10))

def main():
    plot_water_quality("ganga")
    plot_water_quality("sangam")
    plot_flood_correlations()
    print(f"\nEDA plots saved to {output_dir}")

if __name__ == "__main__":
    main()
