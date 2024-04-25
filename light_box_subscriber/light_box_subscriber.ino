#include <WiFi.h>
#include <MQTTClient.h>
#include <FastLED.h>
#include "esp_wpa2.h"

#define LED_PIN  33
#define NUM_LEDS    50
#define BRIGHTNESS  64
#define LED_TYPE    WS2811
#define COLOR_ORDER GRB
CRGB leds[NUM_LEDS];

#define UPDATES_PER_SECOND 100
#define EAP_ANONYMOUS_IDENTITY ""
#define EAP_IDENTITY "" 
#define EAP_PASSWORD "" 
#define EAP_USERNAME ""

bool led_pattern_1 = false;

const char ssid[] = "";
const char pass[] = "";


/*const char ssid[] = "eduroam";
const char pass[] = "";*/

const char MQTT_BROKER_ADRRESS[] = "test.mosquitto.org";
const int MQTT_PORT = 1883;


WiFiClient net;
MQTTClient client = MQTTClient(256);

CRGBPalette16 currentPalette;
TBlendType    currentBlending;

extern CRGBPalette16 myRedWhiteBluePalette;
extern const TProgmemPalette16 myRedWhiteBluePalette_p PROGMEM;

void setup() {
  Serial.begin(9600);

  FastLED.addLeds<LED_TYPE, LED_PIN, COLOR_ORDER>(leds, NUM_LEDS).setCorrection( TypicalLEDStrip );
  FastLED.setBrightness(  BRIGHTNESS );
  
  currentPalette = RainbowColors_p;
  currentBlending = LINEARBLEND;

  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);

  WiFi.begin(ssid, pass);
  // WiFi.begin(ssid, WPA2_AUTH_PEAP, EAP_IDENTITY, EAP_USERNAME, EAP_PASSWORD);

  Serial.println("Connecting to wifi ...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.println("Connected to WiFi!");

  connectToMQTT();
}

void loop() {
  client.loop();

  if (led_pattern_1) {
    ChangePalettePeriodically();
    
    static uint8_t startIndex = 0;
    startIndex = startIndex + 1; /* motion speed */
    
    FillLEDsFromPaletteColors( startIndex);
    
    FastLED.show();
    FastLED.delay(1000 / UPDATES_PER_SECOND);
  }
}

void connectToMQTT() {
  client.begin(MQTT_BROKER_ADRRESS, MQTT_PORT, net);

  client.onMessage(messageReceived);

  Serial.println("Connecting to MQTT broker...");

  while (!client.connect("arduinoESP32XPTO123"/*, "public", "public"*/)) {
    Serial.print(".");
    delay(100);
  }
  Serial.println();
  

  // toy 1
  if (client.subscribe("sensor/toy1"))
    Serial.println("Subscribed to the topic: sensor/toy1");
  else
    Serial.println("Failed to subscribe to the topic: sensor/toy1");
  
  /*
  // toy 2
  if (client.subscribe("sensor/toy2"))
    Serial.println("Subscribed to the topic: sensor/toy2");
  else
    Serial.println("Failed to subscribe to the topic: sensor/toy2");
  
  // toy 3
  if (client.subscribe("sensor/toy3"))
    Serial.println("Subscribed to the topic: sensor/toy3");
  else
    Serial.println("Failed to subscribe to the topic: sensor/toy3");

  */
  
  Serial.println("Connected to broker!");
}

void messageReceived(String &topic, String &payload) {
  Serial.println("received from MQTT:");
  Serial.println("- topic: " + topic);
  Serial.print("- payload: ");
  Serial.println(payload);

  char command = payload[0];
  
  if (topic == "sensor/toy1") {
    led_pattern_1 = true;
  } else if (topic == "sensor/toy2") {
    led_pattern_1 = false; 
    Serial.println("received from toy 2");
  } else if (topic == "sensor/toy3") {
    led_pattern_1 = false; 
    Serial.println("received from toy 3");
  } else {
    Serial.println("not subscribed to this topic");
  }

}

// Note: The following LED effect can be found in one of the examples included in the FastLED Library

void FillLEDsFromPaletteColors( uint8_t colorIndex)
{
    uint8_t brightness = 255;
    
    for( int i = 0; i < NUM_LEDS; ++i) {
        leds[i] = ColorFromPalette( currentPalette, colorIndex, brightness, currentBlending);
        colorIndex += 3;
    }
}


void ChangePalettePeriodically()
{
    uint8_t secondHand = (millis() / 1000) % 60;
    static uint8_t lastSecond = 99;
    
    if( lastSecond != secondHand) {
        lastSecond = secondHand;
        if( secondHand ==  0)  { currentPalette = RainbowColors_p;         currentBlending = LINEARBLEND; }
        if( secondHand == 10)  { currentPalette = RainbowStripeColors_p;   currentBlending = NOBLEND;  }
        if( secondHand == 15)  { currentPalette = RainbowStripeColors_p;   currentBlending = LINEARBLEND; }
        if( secondHand == 20)  { SetupPurpleAndGreenPalette();             currentBlending = LINEARBLEND; }
        if( secondHand == 25)  { SetupTotallyRandomPalette();              currentBlending = LINEARBLEND; }
        if( secondHand == 30)  { SetupBlackAndWhiteStripedPalette();       currentBlending = NOBLEND; }
        if( secondHand == 35)  { SetupBlackAndWhiteStripedPalette();       currentBlending = LINEARBLEND; }
        if( secondHand == 40)  { currentPalette = CloudColors_p;           currentBlending = LINEARBLEND; }
        if( secondHand == 45)  { currentPalette = PartyColors_p;           currentBlending = LINEARBLEND; }
        if( secondHand == 50)  { currentPalette = myRedWhiteBluePalette_p; currentBlending = NOBLEND;  }
        if( secondHand == 55)  { currentPalette = myRedWhiteBluePalette_p; currentBlending = LINEARBLEND; }
    }
}


void SetupTotallyRandomPalette()
{
    for( int i = 0; i < 16; ++i) {
        currentPalette[i] = CHSV( random8(), 255, random8());
    }
}

void SetupBlackAndWhiteStripedPalette()
{
    
    fill_solid( currentPalette, 16, CRGB::Black);
    
    currentPalette[0] = CRGB::White;
    currentPalette[4] = CRGB::White;
    currentPalette[8] = CRGB::White;
    currentPalette[12] = CRGB::White;
    
}


void SetupPurpleAndGreenPalette()
{
    CRGB purple = CHSV( HUE_PURPLE, 255, 255);
    CRGB green  = CHSV( HUE_GREEN, 255, 255);
    CRGB black  = CRGB::Black;
    
    currentPalette = CRGBPalette16(
                                   green,  green,  black,  black,
                                   purple, purple, black,  black,
                                   green,  green,  black,  black,
                                   purple, purple, black,  black );
}


const TProgmemPalette16 myRedWhiteBluePalette_p PROGMEM =
{
    CRGB::Red,
    CRGB::Gray, 
    CRGB::Blue,
    CRGB::Black,
    
    CRGB::Red,
    CRGB::Gray,
    CRGB::Blue,
    CRGB::Black,
    
    CRGB::Red,
    CRGB::Red,
    CRGB::Gray,
    CRGB::Gray,
    CRGB::Blue,
    CRGB::Blue,
    CRGB::Black,
    CRGB::Black
};
