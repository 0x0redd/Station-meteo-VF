#include <OneWire.h>
#include <DallasTemperature.h>

#define PinAnalogiqueHumidite A0
#define ONE_WIRE_BUS 10

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

const unsigned long INTERVAL = 60000; // Interval of 1 minute (in milliseconds)
const int NUM_READINGS = 30; // Number of readings to store for each parameter
float temperatureReadings[NUM_READINGS];
int humidityReadings[NUM_READINGS];
int currentIndex = 0;

void setup() {
  Serial.begin(9600);
  sensors.begin();
  pinMode(PinAnalogiqueHumidite, INPUT);
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

    // Store readings in the arrays
    temperatureReadings[currentIndex] = temperature;
    humidityReadings[currentIndex] = humidityPercentage;
    currentIndex++;

    // If enough readings have been collected, calculate and print statistics
    if (currentIndex == NUM_READINGS) {
      float minTemperature = temperatureReadings[0];
      float maxTemperature = temperatureReadings[0];
      float sumTemperature = 0.0;

      int minHumidity = humidityReadings[0];
      int maxHumidity = humidityReadings[0];
      int sumHumidity = 0;

      // Calculate min, max, and sum for temperature
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

      // Print statistics
      //Serial.println("Temperature Statistics:");
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
      Serial.println();

      // Reset the currentIndex to start storing readings again
      currentIndex = 0;
    }
  }
}

int Conversion(int value) {
  int ValeurPourcentage = map(value, 1023, 0, 0, 100);
  return ValeurPourcentage;
}