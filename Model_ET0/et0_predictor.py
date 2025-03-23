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

def fetch_data_by_hour():
    """Fetch data from `station1` table for the most recently completed hour."""
    try:
        conn = pymysql.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD, database=DB_NAME)
        cursor = conn.cursor()

        # Get the current hour
        now = datetime.now()
        current_hour_start = now.replace(minute=0, second=0, microsecond=0)
        
        # Get data from the previous full hour
        previous_hour_start = current_hour_start - timedelta(hours=1)
        previous_hour_end = current_hour_start - timedelta(seconds=1)

        query = """
            SELECT 
                date, temp_moy, hum_moy, solar_radiation_moy
            FROM station1
            WHERE date BETWEEN %s AND %s
            ORDER BY date ASC;
        """
        cursor.execute(query, (previous_hour_start, previous_hour_end))
        rows = cursor.fetchall()
        
        # If no data found for previous hour, try the hour before that
        if not rows:
            print("⚠️ No data found for the previous hour. Checking the hour before...")
            two_hours_ago_start = previous_hour_start - timedelta(hours=1)
            two_hours_ago_end = previous_hour_start - timedelta(seconds=1)
            
            cursor.execute(query, (two_hours_ago_start, two_hours_ago_end))
            rows = cursor.fetchall()
        
        conn.close()
        
        # Return the rows along with the time period they represent
        if rows:
            time_period = f"{previous_hour_start.strftime('%Y-%m-%d %H:00')} to {previous_hour_end.strftime('%H:59')}"
            return rows, time_period
        else:
            print("⚠️ No data found in the last two hours.")
            return None, None

    except Exception as e:
        print(f"❌ Error fetching data: {str(e)}")
        return None, None

def calculate_averages(rows, time_period):
    """Calculate the average of temperature, humidity, and solar radiation for a specific hour."""
    if not rows:
        print("⚠️ No data retrieved from station1.")
        return None

    df = pd.DataFrame(rows, columns=["date", "temp_moy", "hum_moy", "solar_radiation_moy"])

    print(f"\n📊 Data fetched from station1 for {time_period}:")
    print(df.to_string(index=False))

    # Compute averages
    avg_temp = df["temp_moy"].mean()
    avg_humidity = df["hum_moy"].mean()
    avg_solar_radiation = df["solar_radiation_moy"].mean()

    print("\n📌 Calculated Averages:")
    print(f"🌡️ Avg Temperature: {avg_temp:.2f} °C")
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

def store_et0_prediction(avg_temp, avg_humidity, avg_solar_radiation, predicted_ET0, time_period):
    """Store the predicted ET₀ value in the ET0 table."""
    try:
        conn = pymysql.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD, database=DB_NAME)
        cursor = conn.cursor()

        # Extract the date from the time period (first part)
        prediction_date = datetime.now().replace(minute=0, second=0, microsecond=0) - timedelta(hours=1)
        
        insert_query = """
            INSERT INTO ET0 (date, avg_temp, avg_humidity, avg_solar_radiation, predicted_ET0)
            VALUES (%s, %s, %s, %s, %s);
        """
        cursor.execute(insert_query, (prediction_date, avg_temp, avg_humidity, avg_solar_radiation, predicted_ET0))

        conn.commit()
        conn.close()

        print(f"✅ ET0 prediction for {time_period} successfully stored in the database!\n")

    except Exception as e:
        print(f"❌ Error inserting ET0 prediction: {str(e)}")

def check_last_prediction():
    """Check when the last ET0 prediction was made to avoid duplicates."""
    try:
        conn = pymysql.connect(host=DB_HOST, user=DB_USER, password=DB_PASSWORD, database=DB_NAME)
        cursor = conn.cursor()

        query = "SELECT MAX(date) FROM ET0"
        cursor.execute(query)
        result = cursor.fetchone()[0]
        conn.close()

        if result:
            last_prediction_time = result
            now = datetime.now()
            # Round to nearest hour for comparison
            last_prediction_hour = last_prediction_time.replace(minute=0, second=0, microsecond=0)
            current_hour = now.replace(minute=0, second=0, microsecond=0)
            
            # If we already have a prediction for the previous hour, skip
            if last_prediction_hour >= current_hour - timedelta(hours=1):
                print(f"⏭️ Already have a prediction for {last_prediction_hour}. Skipping...")
                return False
                
        return True

    except Exception as e:
        print(f"❌ Error checking last prediction: {str(e)}")
        # If there's an error, assume we should proceed
        return True

def wait_until_next_hour():
    """Wait until the start of the next hour."""
    now = datetime.now()
    next_hour = now.replace(hour=now.hour+1, minute=0, second=5, microsecond=0)
    if next_hour <= now:  # If we've already passed the next hour's start
        next_hour += timedelta(hours=1)
    
    wait_seconds = (next_hour - now).total_seconds()
    print(f"⏳ Waiting until {next_hour.strftime('%Y-%m-%d %H:%M:%S')} before next update ({wait_seconds:.0f} seconds)...")
    return wait_seconds

if __name__ == "__main__"
    print("🌱 ET0 Predictor Service Started")
    print("📊 This service calculates ET0 based on hourly weather data")
    
    while True:
        # Check if we should make a new prediction
        if check_last_prediction():
            print("\n🕒 Fetching hourly data from station1...")
            rows, time_period = fetch_data_by_hour()

            if rows:
                averages = calculate_averages(rows, time_period)
                if averages:
                    avg_temp, avg_humidity, avg_solar_radiation = averages
                    predicted_ET0 = predict_et0(avg_temp, avg_humidity, avg_solar_radiation)
                    store_et0_prediction(avg_temp, avg_humidity, avg_solar_radiation, predicted_ET0, time_period)
        
        # Wait until the next hour starts
        wait_time = wait_until_next_hour()
        time.sleep(wait_time)
