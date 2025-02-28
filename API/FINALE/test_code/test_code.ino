#include <SoftwareSerial.h>

#define ESP_RX 0 // RX pin of ESP connected to pin 2 of Arduino
#define ESP_TX 1 // TX pin of ESP connected to pin 3 of Arduino

SoftwareSerial espSerial(ESP_RX, ESP_TX); // RX, TX

const char* ssid = "Master_IAAD";
const char* password = "4242FSM1337";

void setup() {
  Serial.begin(9600);     // Serial monitor baud rate
  espSerial.begin(9600);  // ESP-01 baud rate
  
  // Reset the ESP module
  espSerial.println("AT+RST");
  delay(2000);  // Wait for ESP module to reset
  
  // Set the ESP module as a WiFi client
  espSerial.println("AT+CWMODE=1");
  delay(2000);
  
  // Connect to WiFi network
  String command = "AT+CWJAP=\"";
  command += ssid;
  command += "\",\"";
  command += password;
  command += "\"";
  espSerial.println(command);
  delay(5000);  // Wait for ESP module to connect to WiFi
}

void loop() {
  // Your code here
}
