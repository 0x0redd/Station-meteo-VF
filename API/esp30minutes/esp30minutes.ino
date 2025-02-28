#include <WiFi.h>
#include <HTTPClient.h>

#define RXD2 16
#define TXD2 17

// const char*  ssid = "La_Fibre_dOrange_AE78";
// const char* password = "6ECSPXQ3Z4Y37NRKKN";
// const char* serverURL = "http://192.168.11.124:8080/addWeatherStationData";

const char* ssid = "Yassine";
const char* password = "AaBbCc@#@#@#2022";
const char* serverURL = "http://192.168.1.28:8080/addWeatherStationData";

void setup() {
  Serial.begin(115200);
  Serial2.begin(9600, SERIAL_8N1, RXD2, TXD2);

  connectWiFi();
}

void loop() {
  if (Serial2.available()) {
    // Read the data from Serial2
    String data = Serial2.readStringUntil('\n');
    data.trim();

    // Parse the data
    float minTemp, maxTemp, averageTemp;
    int minHum, maxHum, averageHum;

    sscanf(data.c_str(), "%f,%f,%f,%d,%d,%d", &minTemp, &maxTemp, &averageTemp, &minHum, &maxHum, &averageHum);

    // Send the data to the API
    sendData(minTemp, maxTemp, averageTemp, minHum, maxHum, averageHum);
  }

  delay(1000);
}

void sendData(float minTemp, float maxTemp, float averageTemp, int minHum, int maxHum, int averageHum) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    WiFiClient client;

    // Create the JSON payload
    String payload = "{\"hum_min\": " + String(minHum) + ", "
                    "\"hum_max\": " + String(maxHum) + ", "
                    "\"hum_moy\": " + String(averageHum) + ", "
                    "\"temp_min\": " + String(minTemp) + ", "
                    "\"temp_max\": " + String(maxTemp) + ", "
                    "\"temp_moy\": " + String(averageTemp) + "}";

    http.begin(client, serverURL);
    http.addHeader("Content-Type", "application/json");

    int httpCode = http.POST(payload);
    if (httpCode > 0) {
      if (httpCode == HTTP_CODE_OK) {
        String response = http.getString();
        Serial.println(response);
      } else {
        Serial.printf("[HTTP] POST... code: %d\n", httpCode);
      }
    } else {
      Serial.printf("[HTTP] POST... failed, error: %s\n", http.errorToString(httpCode).c_str());
    }
    http.end();

    Serial.print("Min Temperature: ");
    Serial.println(minTemp);
    Serial.print("Max Temperature: ");
    Serial.println(maxTemp);
    Serial.print("Average Temperature: ");
    Serial.println(averageTemp);
    Serial.print("Min Humidity: ");
    Serial.println(minHum);
    Serial.print("Max Humidity: ");
    Serial.println(maxHum);
    Serial.print("Average Humidity: ");
    Serial.println(averageHum);
    Serial.print("HTTP code: ");
    Serial.println(httpCode);
  }
}


void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
}