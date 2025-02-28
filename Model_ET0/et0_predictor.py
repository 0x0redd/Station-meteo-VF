import pymysql
import pandas as pd
import joblib
import time
from datetime import datetime, timedelta

# Load the trained ET₀ prediction model
model = joblib.load("model_3_params_temps_raySol_humRel.joblib")

# Database connection details
DB_HOST = "localhost"
DB_USER = "root"
DB_PASSWORD = ""
DB_NAME = "stationmeteo"

# Define expected feature names based on the model training
EXPECTED_FEATURES = ["moy_Température[°C]", "moy_Rayonnement solaire[W/m2]", "moy_Humidité Relative[%]"]

def fetch_data():
    """Fetch last 1 hour of data from `station1` table."""
    try:
        conn = pymysql.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD, database=DB_NAME)
        cursor = conn.cursor()

        query = """
            SELECT 
                date, temp_moy, hum_moy, solar_radiation_moy
            FROM station1
            WHERE date >= NOW() - INTERVAL 1 HOUR
            ORDER BY date ASC;
        """
        cursor.execute(query)
        rows = cursor.fetchall()
        conn.close()

        return rows

    except Exception as e:
        print(f"❌ Error fetching data: {str(e)}")
        return None

def calculate_averages(rows):
    """Calculate the average of temperature, humidity, and solar radiation over the last hour."""
    if not rows:
        print("⚠ No data retrieved from station1.")
        return None

    df = pd.DataFrame(rows, columns=["date", "temp_moy", "hum_moy", "solar_radiation_moy"])

    print("\n📊 Data fetched from station1 in the last hour:")
    print(df.to_string(index=False))

    # Compute averages
    avg_temp = df["temp_moy"].mean()
    avg_humidity = df["hum_moy"].mean()
    avg_solar_radiation = df["solar_radiation_moy"].mean()

    print("\n📌 Calculated Averages:")
    print(f"🌡 Avg Temperature: {avg_temp:.2f} °C")
    print(f"💧 Avg Humidity: {avg_humidity:.2f} %")
    print(f"☀️ Avg Solar Radiation: {avg_solar_radiation:.2f} W/m²")

    return avg_temp, avg_humidity, avg_solar_radiation

def predict_et0(avg_temp, avg_humidity, avg_solar_radiation):
    """Predict ET₀ using the trained model with correctly ordered features."""
    X_pred = pd.DataFrame({
        "moy_Température[°C]": [avg_temp],
        "moy_Rayonnement solaire[W/m2]": [avg_solar_radiation],
        "moy_Humidité Relative[%]": [avg_humidity]
    })

    # Ensure correct column order to match training set
    X_pred = X_pred[EXPECTED_FEATURES]

    predicted_ET0 = model.predict(X_pred)[0]
    print(f"\n🔮 Predicted ET₀: {predicted_ET0:.4f} mm/day")
    return predicted_ET0

def store_et0_prediction(avg_temp, avg_humidity, avg_solar_radiation, predicted_ET0):
    """Store the predicted ET₀ value in the ET0 table."""
    try:
        conn = pymysql.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD, database=DB_NAME)
        cursor = conn.cursor()

        insert_query = """
            INSERT INTO ET0 (date, avg_temp, avg_humidity, avg_solar_radiation, predicted_ET0)
            VALUES (NOW(), %s, %s, %s, %s);
        """
        cursor.execute(insert_query, (avg_temp, avg_humidity, avg_solar_radiation, predicted_ET0))

        conn.commit()
        conn.close()

        print("✅ ET0 prediction successfully stored in the database!\n")

    except Exception as e:
        print(f"❌ Error inserting ET0 prediction: {str(e)}")

if __name__ == "__main__":
    while True:
        print("\n🕒 Fetching data from station1...")
        rows = fetch_data()

        if rows:
            averages = calculate_averages(rows)
            if averages:
                avg_temp, avg_humidity, avg_solar_radiation = averages
                predicted_ET0 = predict_et0(avg_temp, avg_humidity, avg_solar_radiation)
                store_et0_prediction(avg_temp, avg_humidity, avg_solar_radiation, predicted_ET0)
        
        print("⏳ Waiting 1 h  before next update...\n")
        time.sleep(3600)  # Wait for 1 hour before running again
