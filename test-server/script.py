from flask import Flask, jsonify
import pandas as pd

app = Flask(__name__)

# Load CSV data and clean it
csv_file = "Cleaned_Weather_Data.csv"

def load_and_clean_data():
    try:
        df = pd.read_csv(csv_file, dtype=str)  # Read as string to avoid conversion errors
        df = df.iloc[1:].copy()  # Skip first row if it's redundant
        df.columns = df.iloc[0]   # Set headers from second row
        df = df[1:]               # Remove the old header row

        # Convert numeric columns safely
        numeric_columns = [
            "Temp_Mean", "Temp_Max", "Temp_Min",
            "Humidity_Mean", "Humidity_Min", "Humidity_Max",
            "Solar_Radiation_Mean", "Wind_Speed_Mean", "Wind_Speed_Max", "ET0"
        ]
        
        for col in numeric_columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')  # Convert invalid values to NaN

        df = df.dropna(subset=["Temp_Mean", "Humidity_Mean", "Solar_Radiation_Mean"])  # Drop critical missing values
        df = df.fillna(0)  # Replace remaining NaN with default values
        return df.to_dict(orient="records")
    except Exception as e:
        print("Error loading or processing data:", e)
        return []

weather_data = load_and_clean_data()

@app.route('/weather_data.json', methods=['GET'])
def get_weather_data():
    return jsonify(weather_data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
