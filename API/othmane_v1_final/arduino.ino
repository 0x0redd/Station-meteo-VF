#include <OneWire.h>
#include <DallasTemperature.h>
#include "DHT.h"

#define PinAnalogiqueHumidite A0
#define ONE_WIRE_BUS 13
#define DHT11_PIN 4
#define SUN_SENSOR_PIN A5 // Analog input for solar radiation sensor
#define CALIBRATION_FACTOR 0.0012  // Adjusted to match panel size

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);
DHT dht11(DHT11_PIN, DHT11);

const unsigned long INTERVAL = 60000; // Current interval (2 seconds)
const int NUM_READINGS = 2;
float temperatureReadings[NUM_READINGS];
int humidityReadings[NUM_READINGS];
float dhtTemperatureReadings[NUM_READINGS];
float dhtHumidityReadings[NUM_READINGS];
float solarRadiationReadings[NUM_READINGS];
int currentIndex = 0;

void setup() {
  Serial.begin(115200);  // Debugging
  Serial1.begin(9600);   // Serial communication with ESP32

  sensors.begin();
  pinMode(PinAnalogiqueHumidite, INPUT);
  dht11.begin();
}

void loop() {
  static unsigned long previousMillis = 0;
  unsigned long currentMillis = millis();

  if (currentMillis - previousMillis >= INTERVAL) {
    previousMillis = currentMillis;

    sensors.requestTemperatures();
    int humidityValue = analogRead(PinAnalogiqueHumidite);
    int humidityPercentage = Conversion(humidityValue);
    float temperature = sensors.getTempCByIndex(0);

    float dhtHumidity = dht11.readHumidity();
    float dhtTemperatureC = dht11.readTemperature();

    float solarVoltage = analogRead(SUN_SENSOR_PIN) * (1.5 / 1023.0);
    float solarRadiation = solarVoltage / CALIBRATION_FACTOR;

    temperatureReadings[currentIndex] = temperature;
    humidityReadings[currentIndex] = humidityPercentage;
    dhtTemperatureReadings[currentIndex] = dhtTemperatureC;
    dhtHumidityReadings[currentIndex] = dhtHumidity;
    solarRadiationReadings[currentIndex] = solarRadiation;
    currentIndex++;

    if (currentIndex == NUM_READINGS) {
      float minTemperature = temperatureReadings[0];
      float maxTemperature = temperatureReadings[0];
      float sumTemperature = 0.0;
      int minHumidity = humidityReadings[0];
      int maxHumidity = humidityReadings[0];
      int sumHumidity = 0;
      float minSolarRadiation = solarRadiationReadings[0];
      float maxSolarRadiation = solarRadiationReadings[0];
      float sumSolarRadiation = 0.0;

      for (int i = 0; i < NUM_READINGS; i++) {
        if (temperatureReadings[i] < minTemperature) minTemperature = temperatureReadings[i];
        if (temperatureReadings[i] > maxTemperature) maxTemperature = temperatureReadings[i];
        sumTemperature += temperatureReadings[i];

        if (humidityReadings[i] < minHumidity) minHumidity = humidityReadings[i];
        if (humidityReadings[i] > maxHumidity) maxHumidity = humidityReadings[i];
        sumHumidity += humidityReadings[i];

        if (solarRadiationReadings[i] < minSolarRadiation) minSolarRadiation = solarRadiationReadings[i];
        if (solarRadiationReadings[i] > maxSolarRadiation) maxSolarRadiation = solarRadiationReadings[i];
        sumSolarRadiation += solarRadiationReadings[i];
      }

      float averageTemperature = sumTemperature / NUM_READINGS;
      int averageHumidity = sumHumidity / NUM_READINGS;

      float minDhtTemperature = dhtTemperatureReadings[0];
      float maxDhtTemperature = dhtTemperatureReadings[0];
      float sumDhtTemperature = 0.0;
      for (int i = 0; i < NUM_READINGS; i++) {
        if (dhtTemperatureReadings[i] < minDhtTemperature) minDhtTemperature = dhtTemperatureReadings[i];
        if (dhtTemperatureReadings[i] > maxDhtTemperature) maxDhtTemperature = dhtTemperatureReadings[i];
        sumDhtTemperature += dhtTemperatureReadings[i];
      }

      int minDhtHumidity = dhtHumidityReadings[0];
      int maxDhtHumidity = dhtHumidityReadings[0];
      int sumDhtHumidity = 0;
      for (int i = 0; i < NUM_READINGS; i++) {
        if (dhtHumidityReadings[i] < minDhtHumidity) minDhtHumidity = dhtHumidityReadings[i];
        if (dhtHumidityReadings[i] > maxDhtHumidity) maxDhtHumidity = dhtHumidityReadings[i];
        sumDhtHumidity += dhtHumidityReadings[i];
      }

      float averageDhtTemperature = sumDhtTemperature / NUM_READINGS;
      int averageDhtHumidity = sumDhtHumidity / NUM_READINGS;
      float averageSolarRadiation = sumSolarRadiation / NUM_READINGS;

      // Format data as CSV
      String message = String(minTemperature) + "," +
                       String(maxTemperature) + "," +
                       String(averageTemperature) + "," +
                       String(minHumidity) + "," +
                       String(maxHumidity) + "," +
                       String(averageHumidity) + "," +
                       String(minDhtTemperature) + "," +
                       String(maxDhtTemperature) + "," +
                       String(averageDhtTemperature) + "," +
                       String(minDhtHumidity) + "," +
                       String(maxDhtHumidity) + "," +
                       String(averageDhtHumidity) + "," +
                       String(minSolarRadiation) + "," +
                       String(maxSolarRadiation) + "," +
                       String(averageSolarRadiation);

      Serial1.println(message);  // Send data to ESP32
      Serial.print("[Mega] Sent: "); // Debugging output
      Serial.println(message);

      currentIndex = 0;
    }
  }
}

int Conversion(int value) {
  return map(value, 1023, 0, 0, 100);
}
