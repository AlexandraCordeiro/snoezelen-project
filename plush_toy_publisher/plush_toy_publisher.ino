#include <WiFi.h>
#include <MQTTClient.h>

#define PLUSH_IS_SQUEEZED(previous_state, current_state) (previous_state == LOW && current_state == HIGH)

#define UPDATES_PER_SECOND 100
#define EAP_ANONYMOUS_IDENTITY ""
#define EAP_IDENTITY "" 
#define EAP_PASSWORD "" 
#define EAP_USERNAME ""

// const char ssid[] = "eduroam";
const char ssid[] = "";
const char pass[] = "";

WiFiClient net;
MQTTClient client = MQTTClient(256);

const char MQTT_BROKER_ADRESS[] = "test.mosquitto.org";
const int MQTT_PORT = 1883;

const int toy_sensor_1 = 5;
int previous_state_toy_1 = LOW;
int sensorState;
int current_state_toy_1;
unsigned long lastDebounceTime = 0;  
unsigned long debounceDelay = 50;  


void setup() {
  Serial.begin(9600);
  pinMode(toy_sensor_1, INPUT_PULLUP);

  WiFi.begin(ssid, pass);
  // WiFi.begin(ssid, WPA2_AUTH_PEAP, EAP_IDENTITY, EAP_USERNAME, EAP_PASSWORD);
  Serial.println("Connecting to wifi ...");

  while(WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }

  Serial.println();
  Serial.println("Connected to WiFi!");

  connectToMQTT();
}

void debounce() {
  if (current_state_toy_1 != previous_state_toy_1) {
    lastDebounceTime = millis();
  }

  if ((millis() - lastDebounceTime) > debounceDelay) {

    if (current_state_toy_1 != sensorState) {
      sensorState = current_state_toy_1;

      if (sensorState == HIGH) {
        Serial.println("Toy 1: Squeezed!");
        client.publish("sensor/toy1", String(current_state_toy_1));
        Serial.println("Published to topic: sensor/toy1");
      }
    }
  }
}

void loop() {
  client.loop();

  current_state_toy_1 = !digitalRead(toy_sensor_1);
    
  debounce();
  previous_state_toy_1 = current_state_toy_1;

}

void connectToMQTT() {
  client.begin(MQTT_BROKER_ADRESS, MQTT_PORT, net);
  Serial.println("Connecting to broker...");

  while(!client.connect("arduinoESP32XPTO")) {
    Serial.print(".");
    delay(100);
  }

  Serial.println("\nConnected to broker!");
}
