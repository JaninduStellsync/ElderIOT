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

// ================= FALL VARIABLES =================
bool impactDetected = false;
unsigned long impactTime = 0;
long previousA = 0;

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

  mpu.initialize();
  if (mpu.testConnection()) {
    Serial.println("MPU6050 connected");
  } else {
    Serial.println("MPU6050 connection failed");
  }

  connectWiFi();

  espClient.setInsecure();
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
  long gyroMag = sqrt((long)gx * gx + (long)gy * gy + (long)gz * gz);
  long deltaA = abs(A - previousA);

  bool fallDetectedNow = false;

  // ===== STAGE 1: SUDDEN MOVEMENT =====
  bool suddenMovement = (deltaA > 5000);

  // ===== STAGE 2: STRONG ROTATION =====
  bool strongRotation = (gyroMag > 1200);

  // ===== STAGE 3: IMPACT =====
  bool impact = (A > 17000);

  if (suddenMovement && strongRotation && impact) {
    impactDetected = true;
    impactTime = millis();
  }

  // ===== STAGE 4: STILLNESS CONFIRM =====
  if (impactDetected && (millis() - impactTime > 1200)) {

    bool stillness = (A > 14000 && A < 18000);

    if (stillness) {
      fallDetectedNow = true;
      Serial.println("🚨 FALL DETECTED (Improved v2) 🚨");
    }

    impactDetected = false;
  }

  previousA = A;

  // ===== DEBUG PRINT =====
  Serial.print("A: "); Serial.print(A);
  Serial.print(" | deltaA: "); Serial.print(deltaA);
  Serial.print(" | gyroMag: "); Serial.print(gyroMag);
  Serial.print(" | Fall: "); Serial.println(fallDetectedNow);

  unsigned long currentTime = millis();
  bool shouldSend = false;

  if (fallDetectedNow) {
    shouldSend = true;
  }

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