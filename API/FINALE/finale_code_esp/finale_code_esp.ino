#include <WiFi.h>
#include <HTTPClient.h>

#define RXD2 16
#define TXD2 17

const char* ssid = "La_Fibre_dOrange_AE78";
const char* password = "6ECSPXQ3Z4Y37NRKKN";

// const char* ssid = "LINGUA CAFE II";
// const char* password = "ABCD2022";

// const char* ssid = "Yassine";
// const char* password = "AaBbCc@#@#@#2022";
const char* serverUrl = "http://localhost:8080";  // Replace with your server URL
const char* apiEndpoint = "/addWeatherStationData";  // Replace with your API endpoint

void setup() {
  Serial.begin(115200);
  Serial2.begin(9600, SERIAL_8N1, RXD2, TXD2);
  connectWiFi();
}

void loop() {
  // Read data from Arduino
  if (Serial2.available()) {
    String arduinoData = Serial2.readStringUntil('\n');
    arduinoData.trim();

    // Create the provided JSON payload
    String payload = "{"
                      "\"hum_max\": 70, "
                      "\"hum_min\": 30, "
                      "\"hum_moy\": 50, "
                      "\"temp_max\": 25.5, "
                      "\"temp_min\": 18.2, "
                      "\"temp_moy\": 22.8"
                    "}";

    // Merge the Arduino data with the provided JSON
    payload.replace("\"hum_max\": 70", "\"hum_max\": " + arduinoData.substring(0, arduinoData.indexOf(',')));
    payload.replace("\"hum_min\": 30", "\"hum_min\": " + arduinoData.substring(arduinoData.indexOf(',') + 1));

    // Make HTTP POST request with the merged data
    postData(payload);

    // Delay before making the next request (adjust as needed)
    delay(5000);
  }
}

void postData(String data) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String apiUrl = String(serverUrl) + String(apiEndpoint);
    http.begin(apiUrl);

    http.addHeader("Content-Type", "application/json");

    int httpCode = http.POST(data);
    if (httpCode > 0) {
      if (httpCode == HTTP_CODE_OK) {
        String response = http.getString();
        Serial.println("POST request successful. Server response:");
        Serial.println(response);
      } else {
        Serial.printf("[HTTP] POST request failed, error: %s\n", http.errorToString(httpCode).c_str());
      }
    } else {
      Serial.printf("[HTTP] Unable to connect\n");
    }

    http.end();
  } else {
    Serial.println("WiFi not connected");
  }
}

void connectWiFi() {
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
