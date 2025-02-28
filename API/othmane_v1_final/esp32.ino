#include <WiFi.h>
#include <HTTPClient.h>
#include <HardwareSerial.h>

#define RX_PIN 16  // Connect to Mega TX1 (Pin 18)
#define TX_PIN 17  // Connect to Mega RX1 (Pin 19)

// Initialize Serial2 for ESP32
HardwareSerial SerialPort(2);

// WiFi Credentials
const char* ssid = "oth";
const char* password = "123456789";

// Server API details
const char* serverUrl = "http://192.168.86.153:8080";
const char* apiEndpoint = "/addWeatherStationData";

String receivedData = "";

void setup() {
  Serial.begin(115200);  // Debugging output
  SerialPort.begin(9600, SERIAL_8N1, RX_PIN, TX_PIN);  // Match Arduino Mega baud rate

  Serial.println("[ESP32] Ready - Waiting for data...");
  connectWiFi();
}

void loop() {
  // Check if data is available from Arduino Mega
  if (SerialPort.available() > 0) {
    receivedData = SerialPort.readStringUntil('\n'); // Read until newline
    receivedData.trim(); // Remove any unwanted whitespace or newlines

    if (receivedData.length() > 0) {
      Serial.print("[ESP32] Received: ");
      Serial.println(receivedData);  // Debug print received data

      // Process CSV data and send to server
      processAndSendData(receivedData);
    }
  }
}

// Function to parse CSV and send as JSON
void processAndSendData(String data) {
  float values[15]; // Array to hold parsed values
  int index = 0;

  // Parsing CSV
  int start = 0;
  int end = data.indexOf(",");
  while (end != -1 && index < 15) {
    values[index++] = data.substring(start, end).toFloat();
    start = end + 1;
    end = data.indexOf(",", start);
  }
  // Get last value
  if (index < 15 && start < data.length()) {
    values[index++] = data.substring(start).toFloat();
  }

  // Verify correct number of values
  if (index != 15) {
    Serial.println("[ESP32] Parsing error: Incorrect number of values");
    return;
  }

  // Assign parsed values
  float temp_min = values[0], temp_max = values[1], temp_moy = values[2];
  int hum_min = (int)values[3], hum_max = (int)values[4], hum_moy = (int)values[5];
  float temp_dht_min = values[6], temp_dht_max = values[7], temp_dht_moy = values[8];
  int hum_dht_min = (int)values[9], hum_dht_max = (int)values[10], hum_dht_moy = (int)values[11];
  float solar_radiation_min = values[12], solar_radiation_max = values[13], solar_radiation_moy = values[14];

  // Format JSON payload
  String payload = "{"
                    "\"hum_moy\": " + String(hum_dht_moy) + ", "
                    "\"hum_min\": " + String(hum_dht_min) + ", "
                    "\"hum_max\": " + String(hum_dht_max) + ", "
                    "\"temp_moy\": " + String(temp_dht_moy) + ", "
                    "\"temp_min\": " + String(temp_dht_min) + ", "
                    "\"temp_max\": " + String(temp_dht_max) + ", "
                    "\"temp_dht_moy\": " + String(temp_dht_moy) + ", " 
                    "\"temp_dht_min\": " + String(temp_dht_min) + ", "
                    "\"temp_dht_max\": " + String(temp_dht_max) + ", "
                    "\"hum_dht_moy\": " + String(hum_dht_moy) + ", "
                    "\"hum_dht_min\": " + String(hum_dht_min) + ", "
                    "\"hum_dht_max\": " + String(hum_dht_max) + ", "
                    "\"solar_radiation_min\": " + String(solar_radiation_min) + ", "
                    "\"solar_radiation_max\": " + String(solar_radiation_max) + ", "
                    "\"solar_radiation_moy\": " + String(solar_radiation_moy) + 
                  "}";

  Serial.println("[ESP32] Sending JSON: " + payload); // Debugging output
  postData(payload);
}

// Send JSON data to API
void postData(String data) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = String(serverUrl) + apiEndpoint;
    http.begin(url);
    http.addHeader("Content-Type", "application/json");
    http.setTimeout(5000);  // 5-second timeout

    int httpCode = http.POST(data);

    if (httpCode > 0) {
      String response = http.getString();
      Serial.println("[ESP32] Server Response: " + response);
    } else {
      Serial.printf("[ESP32] POST failed, error: %s\n", http.errorToString(httpCode).c_str());
    }

    http.end();
  } else {
    Serial.println("[ESP32] WiFi not connected");
  }
}

// Connect ESP32 to WiFi
void connectWiFi() {
  WiFi.begin(ssid, password);
  Serial.print("[ESP32] Connecting to WiFi");

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 30) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {
    Serial.print("[ESP32] Connected! IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("[ESP32] Failed to connect to WiFi!");
  }
}
