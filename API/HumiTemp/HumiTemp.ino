#include <OneWire.h>
#include <DallasTemperature.h>
#include <ArduinoJson.h>
#include <Wire.h>
#define PinAnalogiqueHumidite A0
int pourcentage = 0;
int hsol;
// Data wire is conntec to the Arduino digital pin 4
#define ONE_WIRE_BUS 10

// Setup a oneWire instance to communicate with any OneWire devices
OneWire oneWire(ONE_WIRE_BUS);

// Pass our oneWire reference to Dallas Temperature sensor 
DallasTemperature sensors(&oneWire);

void setup(void)
{
  // Start serial communication for debugging purposes
  Serial.begin(9600);
  // Start up the library
  sensors.begin();
  pinMode(PinAnalogiqueHumidite, INPUT);


    
}

void loop(void){ 
  // Call sensors.requestTemperatures() to issue a global temperature and Requests to all devices on the bus
  sensors.requestTemperatures(); 


  StaticJsonDocument<200> doc;
  hsol = analogRead(PinAnalogiqueHumidite);
  pourcentage = Conversion(hsol);
  doc["sensor humi"] = "humidity";
  doc["value %"] = pourcentage;
  doc["sensor temp"] = "Celsius temperature: ";
  doc["value °C"] = sensors.getTempCByIndex(0);

  char jsonBuffer[256];
  serializeJson(doc, jsonBuffer);
  Serial.println(jsonBuffer);  
  delay(500);
}

 int Conversion(int value){
 int ValeurPorcentage = 0;
 ValeurPorcentage = map(value, 1023, 0, 0, 100);
 return ValeurPorcentage;
}

