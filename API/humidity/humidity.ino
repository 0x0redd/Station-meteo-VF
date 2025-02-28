#include <Wire.h>
#include <ArduinoJson.h>
#define PinAnalogiqueHumidite A0
int pourcentage = 0;
int hsol;
void setup() {
  Serial.begin(9600);
  pinMode(PinAnalogiqueHumidite, INPUT);

}

void loop() {

  hsol = analogRead(PinAnalogiqueHumidite);
  StaticJsonDocument<200> doc;
  doc["sensor"] = "humidité";

  pourcentage = Conversion(hsol);
  Serial.println(pourcentage);
  // doc["value"] = pourcentage;

  // char jsonBuffer[256];
  // serializeJson(doc, jsonBuffer);
  // Serial.println(jsonBuffer);  
  delay(1500);

}
 int Conversion(int value){
 int ValeurPorcentage = 0;
 ValeurPorcentage = map(value, 1023, 0, 0, 100);
 return ValeurPorcentage;
}

