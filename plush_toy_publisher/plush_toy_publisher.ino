#include <WiFi.h>
#include <MQTTClient.h>

#define PLUSH_IS_SQUEEZED(previous_state, current_state) (previous_state == LOW && current_state == HIGH)

#define UPDATES_PER_SECOND 100
#define EAP_ANONYMOUS_IDENTITY "anonymous@uc.pt"
#define EAP_IDENTITY "##########@student.uc.pt" 
#define EAP_PASSWORD "##########" 
#define EAP_USERNAME "##########@student.uc.pt"

// const char ssid[] = "eduroam";
const char ssid[] = "";
const char pass[] = "";

WiFiClient net;
MQTTClient client = MQTTClient(256);

const char MQTT_BROKER_ADRESS[] = "test.mosquitto.org";
const int MQTT_PORT = 1883;

const int toy_sensor_1 = 25;
const int toy_sensor_2 = 26;

// toy 1
int previous_state_toy_1 = LOW;
int sensor_state_toy_1;
int current_state_toy_1;
unsigned long last_debounce_time_toy_1 = 0;  
bool toy1_payload = true;
const char str_toy_1[] = "toy1";

// toy 2
int previous_state_toy_2 = LOW;
int sensor_state_toy_2;
int current_state_toy_2;
unsigned long last_debounce_time_toy_2 = 0;  
bool toy2_payload = true;
const char str_toy_2[] = "toy2";

////////// debounce
unsigned long debounce_delay = 50;  


void setup() {
  Serial.begin(9600);
  pinMode(toy_sensor_1, INPUT_PULLUP);
  pinMode(toy_sensor_2, INPUT_PULLUP);

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

void loop() {
  client.loop();

  current_state_toy_1 = !digitalRead(toy_sensor_1);
  current_state_toy_2 = !digitalRead(toy_sensor_2);

  debounce(current_state_toy_1, previous_state_toy_1, sensor_state_toy_1, last_debounce_time_toy_1, str_toy_1, toy1_payload);
  debounce(current_state_toy_2, previous_state_toy_2, sensor_state_toy_2, last_debounce_time_toy_2, str_toy_2, toy2_payload);

  previous_state_toy_1 = current_state_toy_1;
  previous_state_toy_2 = current_state_toy_2;

}

void debounce(int current_state_toy, int previous_state_toy, int sensor_state, unsigned long last_debounce_time, const char str_toy[], bool &toy_payload) {
  if (current_state_toy != previous_state_toy) {
    last_debounce_time_toy_1 = millis();
  }

  if ((millis() - last_debounce_time) > debounce_delay) {

    // if the button state has changed:
    if (current_state_toy != sensor_state) {
      sensor_state = current_state_toy;

      if (/*sensor_state == HIGH*/ PLUSH_IS_SQUEEZED(previous_state_toy, current_state_toy)) {
        Serial.println(String(str_toy) + ": Squeezed!");
        client.publish("sensor/" + String(str_toy), String(toy_payload));
        Serial.println("Published to topic: sensor/" + String(str_toy));
        toy_payload = !toy_payload;
        Serial.println(toy_payload);
      }
    }
  }
}

void connectToMQTT() {
  client.begin(MQTT_BROKER_ADRESS, MQTT_PORT, net);
  Serial.println("Connecting to broker...");

  while(!client.connect("arduinoESP32XPTO98765")) {
    Serial.print(".");
    delay(100);
  }

  Serial.println("\nConnected to broker!");
}
