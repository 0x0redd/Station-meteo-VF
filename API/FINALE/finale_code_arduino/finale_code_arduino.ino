#include <OneWire.h>
#include <DallasTemperature.h>
#include "DHT.h"
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#define PinAnalogiqueHumidite A0
#define ONE_WIRE_BUS 13
#define DHT11_PIN 4

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);
DHT dht11(DHT11_PIN, DHT11);

const unsigned long INTERVAL = 6000;
const int NUM_READINGS = 30; // Number of readings to store for each parameter
float temperatureReadings[NUM_READINGS];
int humidityReadings[NUM_READINGS];
float dhtTemperatureReadings[NUM_READINGS];
float dhtHumidityReadings[NUM_READINGS];
int currentIndex = 0;

// Set the LCD address (you may need to adjust this based on your LCD)
#define LCD_ADDRESS 0x3F

// Set the LCD columns and rows
#define LCD_COLUMNS 16
#define LCD_ROWS 2

// Create an LCD object
LiquidCrystal_I2C lcd(LCD_ADDRESS, LCD_COLUMNS, LCD_ROWS);

void setup() {
  lcd.init();
  lcd.setBacklight(2);

  Serial.begin(9600);
  sensors.begin();
  pinMode(PinAnalogiqueHumidite, INPUT);
  dht11.begin(); // initialize the DHT sensor
}

void loop() {
  static unsigned long previousMillis = 0;
  unsigned long currentMillis = millis();

  // Read temperature and humidity every minute
  if (currentMillis - previousMillis >= INTERVAL) {
    previousMillis = currentMillis;

    sensors.requestTemperatures();
    int humidityValue = analogRead(PinAnalogiqueHumidite);
    int humidityPercentage = Conversion(humidityValue);
    float temperature = sensors.getTempCByIndex(0);

    // Read DHT sensor values
    float dhtHumidity = dht11.readHumidity();
    float dhtTemperatureC = dht11.readTemperature();
    float dhtTemperatureF = dht11.readTemperature(true);

    // Store readings in the arrays
    temperatureReadings[currentIndex] = temperature;
    humidityReadings[currentIndex] = humidityPercentage;
    dhtTemperatureReadings[currentIndex] = dhtTemperatureC;
    dhtHumidityReadings[currentIndex] = dhtHumidity;
    currentIndex++;

    // If enough readings have been collected, calculate and print statistics
    if (currentIndex == NUM_READINGS) {
      // Calculate min, max, and sum for temperature
      float minTemperature = temperatureReadings[0];
      float maxTemperature = temperatureReadings[0];
      float sumTemperature = 0.0;

      int minHumidity = humidityReadings[0];
      int maxHumidity = humidityReadings[0];
      int sumHumidity = 0;

      // Calculate min, max, and sum for Dallas temperature
      for (int i = 0; i < NUM_READINGS; i++) {
        if (temperatureReadings[i] < minTemperature) {
          minTemperature = temperatureReadings[i];
        }
        if (temperatureReadings[i] > maxTemperature) {
          maxTemperature = temperatureReadings[i];
        }
        sumTemperature += temperatureReadings[i];
      }

      // Calculate min, max, and sum for humidity
      for (int i = 0; i < NUM_READINGS; i++) {
        if (humidityReadings[i] < minHumidity) {
          minHumidity = humidityReadings[i];
        }
        if (humidityReadings[i] > maxHumidity) {
          maxHumidity = humidityReadings[i];
        }
        sumHumidity += humidityReadings[i];
      }

      // Calculate average temperature and humidity
      float averageTemperature = sumTemperature / NUM_READINGS;
      int averageHumidity = sumHumidity / NUM_READINGS;

      // Calculate min, max, and sum for DHT temperature
      float minDhtTemperature = dhtTemperatureReadings[0];
      float maxDhtTemperature = dhtTemperatureReadings[0];
      float sumDhtTemperature = 0.0;

      for (int i = 0; i < NUM_READINGS; i++) {
        if (dhtTemperatureReadings[i] < minDhtTemperature) {
          minDhtTemperature = dhtTemperatureReadings[i];
        }
        if (dhtTemperatureReadings[i] > maxDhtTemperature) {
          maxDhtTemperature = dhtTemperatureReadings[i];
        }
        sumDhtTemperature += dhtTemperatureReadings[i];
      }

      // Calculate min, max, and sum for DHT humidity
      int minDhtHumidity = dhtHumidityReadings[0];
      int maxDhtHumidity = dhtHumidityReadings[0];
      int sumDhtHumidity = 0.0;

      for (int i = 0; i < NUM_READINGS; i++) {
        if (dhtHumidityReadings[i] < minDhtHumidity) {
          minDhtHumidity = dhtHumidityReadings[i];
        }
        if (dhtHumidityReadings[i] > maxDhtHumidity) {
          maxDhtHumidity = dhtHumidityReadings[i];
        }
        sumDhtHumidity += dhtHumidityReadings[i];
      }

      // Calculate average DHT temperature and humidity
      float averageDhtTemperature = sumDhtTemperature / NUM_READINGS;
      int averageDhtHumidity = sumDhtHumidity / NUM_READINGS;

      // Print statistics for Dallas Temperature sensor
      // Serial.println("Dallas Temperature Sensor Statistics:");
      // Serial.print("Min Temperature: "); Serial.print(minTemperature); Serial.print("°C, ");
      // Serial.print("Max Temperature: "); Serial.print(maxTemperature); Serial.print("°C, ");
      // Serial.print("Average Temperature: "); Serial.print(averageTemperature); Serial.println("°C");

      // Serial.print("Min Humidity: "); Serial.print(minHumidity); Serial.print("%, ");
      // Serial.print("Max Humidity: "); Serial.print(maxHumidity); Serial.print("%, ");
      // Serial.print("Average Humidity: "); Serial.print(averageHumidity); Serial.println("%");
      // // Print statistics for DHT sensor
      // Serial.println("DHT Sensor Statistics:");
      // Serial.print("Min Temperature: "); Serial.print(minDhtTemperature); Serial.print("°C, ");
      // Serial.print("Max Temperature: "); Serial.print(maxDhtTemperature); Serial.print("°C, ");
      // Serial.print("Average Temperature: "); Serial.print(averageDhtTemperature); Serial.println("°C");

      // Serial.print("Min Humidity: "); Serial.print(minDhtHumidity); Serial.print("%, ");
      // Serial.print("Max Humidity: "); Serial.print(maxDhtHumidity); Serial.print("%, ");
      // Serial.print("Average Humidity: "); Serial.print(averageDhtHumidity); Serial.println("%");

      Serial.print(minTemperature);
      Serial.print(",");
      Serial.print(maxTemperature);
      Serial.print(",");
      Serial.print(averageTemperature);
      Serial.print(",");
      
      //Serial.println("Humidity Statistics:");
      Serial.print(minHumidity);
      Serial.print(",");
      Serial.print(maxHumidity);
      Serial.print(",");
      Serial.print(averageHumidity);
      Serial.print(",");

      Serial.print(minDhtTemperature);
      Serial.print(",");
      Serial.print(maxDhtTemperature);
      Serial.print(",");
      Serial.print(averageDhtTemperature);
      Serial.print(",");
      
      //Serial.println("Humidity Statistics:");
      Serial.print(minDhtHumidity);
      Serial.print(",");
      Serial.print(maxDhtHumidity);
      Serial.print(",");
      Serial.print(averageDhtHumidity);

      Serial.println();
      affi(averageTemperature, averageHumidity, averageDhtTemperature, averageDhtHumidity);
      // Serial.println("-------------------------------------------------------------");

      // Reset the currentIndex to start storing readings again
      currentIndex = 0;
    }
  }
}

void affi(float averageTemperature, float averageHumidity, float averageDhtTemperature, float averageDhtHumidity) {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("T sol: ");
  lcd.print(averageTemperature, 1);  // Assuming you want to display one decimal place
  lcd.print("C");

  lcd.setCursor(1, 1);
  lcd.print("Hum sol: ");
  lcd.print(averageHumidity, 1);  // Assuming you want to display one decimal place
  lcd.print("%");
}


int Conversion(int value) {
  int ValeurPourcentage = map(value, 1023, 0, 0, 100);
  return ValeurPourcentage;
}
