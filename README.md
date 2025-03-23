# 🌦️ Station-meteo-VF

**Station-meteo-VF** is a weather monitoring and smart irrigation system that integrates environmental sensors, ET₀ (Reference Evapotranspiration) prediction, and automated irrigation control.

## 💁️ Repository Structure

This repository is organized into the following main directories:

- **Model_ETO/** 📊 - Contains the model for ET₀ prediction based on key environmental factors (humidity, temperature, solar radiation, and wind speed).
- **Station_API/** ⚙️ - Backend API for managing sensor data, computations, and communication with the irrigation system.
- **Station_meteo_nextjs/** 🌍 - Frontend application built with Next.js to visualize real-time weather data and system analytics.

## 🚀 Features

👉 **Real-time Weather Data Monitoring**  
👉 **ET₀ Prediction Using Machine Learning/Algorithms**  
👉 **Smart Irrigation Automation**  
👉 **Web Dashboard for Data Visualization**  

## 🛠️ Tech Stack

- **Backend:** Java 17 (Spring Boot)
- **Machine Learning:** Python, NumPy, Pandas, Scikit-learn
- **Frontend:** Next.js (React, TypeScript)
- **Database:** MySQL
- **Hardware:** Sensors for temperature, humidity, wind speed, and solar radiation

## 🛆 Installation & Setup

### Prerequisites

1️⃣ **Java Development Kit (JDK) 17**
- Download and install [OpenJDK 17](https://adoptium.net/)
- Set JAVA_HOME environment variable to your JDK installation path

2️⃣ **Maven**
- Download and install [Apache Maven](https://maven.apache.org/download.cgi)
- Ensure Maven is added to your system's PATH

3️⃣ **Python Environment**
- Python 3.8 or higher
- Virtual environment setup for ET0 model

4️⃣ **MySQL Database**
- Install [MySQL Server](https://dev.mysql.com/downloads/mysql/)
- Create a database named 'stationmeteo'

### Running the Application

1️⃣ **Clone the repository:**
```bash
git clone https://github.com/0x0redd/Station-meteo-VF.git
cd Station-meteo-VF
```

2️⃣ **Quick Start (Using run script)**
```bash
# Simply run the batch file
run.bat
```
This script will:
- Start the Spring Boot service
- Launch the ET0 prediction model in a separate window
- Handle all necessary environment checks

3️⃣ **Manual Setup (Alternative method)**

For Backend:
```bash
cd API/weatherapi
mvn clean install
mvn spring-boot:run
```

For ET0 Model:
```bash
cd Model_ET0
.\venv\Scripts\activate
python et0_predictor.py
```

For Frontend:
```bash
cd Station_meteo_nextjs
npm install
npm run dev
```

## 📊 Usage

- Access the API at `http://localhost:8080`
- The ET₀ model runs predictions automatically
- Frontend dashboard available at `http://localhost:3000`
- Monitor MySQL database for data storage

## 🛠️ Contributing

Feel free to contribute! Fork the repo and submit a pull request.

## 📄 License

This project is licensed under the **MIT License**.

## 📞 Contact


---
🌿 *Smart irrigation for a sustainable future!* 🚀

