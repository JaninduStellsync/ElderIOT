#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>
#include <Wire.h>
#include <MPU6050.h>

// ================= WIFI =================
const char* ssid = "Redmi Note 13";
const char* password = "JaninduOp0200";

// ================= MQTT =================
const char* mqtt_server = "b6a6de699cbe4b27be58d2c31ce301f5.s1.eu.hivemq.cloud";
const int mqtt_port = 8883;
const char* mqtt_user = "elder";
const char* mqtt_pass = "Elder@123";

// ================= OBJECTS =================
WiFiClientSecure espClient;
PubSubClient client(espClient);
MPU6050 mpu;

// ================= DEVICE ID =================
String deviceID;

// ================= FALL LOGIC VARIABLES =================
bool freeFallDetected = false;
bool impactDetected = false;
unsigned long impactTime = 0;

// ================= TIMING =================
unsigned long lastSendTime = 0;
const unsigned long normalInterval = 60000;  // 60 sec

// ================= WIFI CONNECT =================
void connectWiFi() {
  Serial.print("Connecting to WiFi...");
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi Connected");
}

// ================= MQTT CONNECT =================
void connectMQTT() {
  while (!client.connected()) {
    Serial.print("Connecting to MQTT...");
    if (client.connect(deviceID.c_str(), mqtt_user, mqtt_pass)) {
      Serial.println("Connected!");
    } else {
      Serial.print("Failed. Retrying...");
      delay(2000);
    }
  }
}

// ================= SETUP =================
void setup() {
  Serial.begin(115200);
  Wire.begin();

  // Generate unique ID from ESP32 MAC
  uint64_t chipid = ESP.getEfuseMac();
  deviceID = String((uint32_t)(chipid >> 32), HEX) +
             String((uint32_t)chipid, HEX);

  Serial.print("Device ID: ");
  Serial.println(deviceID);

  // Initialize MPU6050
  mpu.initialize();
  if (mpu.testConnection()) {
    Serial.println("MPU6050 connected");
  } else {
    Serial.println("MPU6050 connection failed");
  }

  connectWiFi();

  espClient.setInsecure();   // Required for HiveMQ SSL
  client.setServer(mqtt_server, mqtt_port);
}

// ================= LOOP =================
void loop() {

  if (!client.connected()) {
    connectMQTT();
  }
  client.loop();

  int16_t ax, ay, az, gx, gy, gz;
  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);

  long A = sqrt((long)ax * ax + (long)ay * ay + (long)az * az);

  bool fallDetectedNow = false;

  // ===== FREE FALL =====
  if (A < 6000) {
    freeFallDetected = true;
  }

  // ===== IMPACT =====
  if (freeFallDetected && A > 20000) {
    impactDetected = true;
    impactTime = millis();
  }

  // ===== STILLNESS CONFIRM =====
  if (impactDetected && (millis() - impactTime > 1500)) {
    if (A > 14000 && A < 18000) {
      fallDetectedNow = true;
      Serial.println("🚨 FALL DETECTED 🚨");
    }
    freeFallDetected = false;
    impactDetected = false;
  }

  // ===== ALWAYS PRINT SENSOR VALUES =====
  Serial.print("A: ");
  Serial.print(A);
  Serial.print(" | ax: "); Serial.print(ax);
  Serial.print(" ay: "); Serial.print(ay);
  Serial.print(" az: "); Serial.print(az);
  Serial.print(" | Fall: ");
  Serial.println(fallDetectedNow);

  unsigned long currentTime = millis();
  bool shouldSend = false;

  // Send immediately if fall detected
  if (fallDetectedNow) {
    shouldSend = true;
  }

  // Send normal data every minute
  if (currentTime - lastSendTime > normalInterval) {
    shouldSend = true;
  }

  if (shouldSend) {

    String payload = "{";
    payload += "\"deviceId\":\"" + deviceID + "\",";
    payload += "\"ax\":" + String(ax) + ",";
    payload += "\"ay\":" + String(ay) + ",";
    payload += "\"az\":" + String(az) + ",";
    payload += "\"gx\":" + String(gx) + ",";
    payload += "\"gy\":" + String(gy) + ",";
    payload += "\"gz\":" + String(gz) + ",";
    payload += "\"A\":" + String(A) + ",";
    payload += "\"fall\":" + String(fallDetectedNow ? "true" : "false");
    payload += "}";

    client.publish("fall/device01/data", payload.c_str());

    Serial.println("Published JSON:");
    Serial.println(payload);
    Serial.println("-------------------------");

    lastSendTime = currentTime;
  }

  delay(200);
}
