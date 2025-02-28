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

- **Backend:** Python (FastAPI / Flask)
- **Machine Learning:** NumPy, Pandas, Scikit-learn
- **Frontend:** Next.js (React, TypeScript)
- **Database:** PostgreSQL / MongoDB
- **Hardware:** Sensors for temperature, humidity, wind speed, and solar radiation

## 🛆 Installation

1️⃣ Clone the repository:

```bash
git clone https://github.com/0x0redd/Station-meteo-VF.git
cd Station-meteo-VF
```

2️⃣ Install dependencies for backend:

```bash
cd Station_API
pip install -r requirements.txt
```

3️⃣ Run the backend:

```bash
uvicorn main:app --reload
```

4️⃣ Install and run the frontend:

```bash
cd ../Station_meteo_nextjs
npm install
npm run dev
```

## 📊 Usage

- The API collects real-time weather data and stores it in a database.
- The ET₀ model predicts evapotranspiration based on weather conditions.
- The irrigation system adjusts water supply automatically based on ET₀ values.
- The Next.js frontend provides a dashboard to monitor weather conditions and irrigation status.

## 🛠️ Contributing

Feel free to contribute! Fork the repo and submit a pull request.

## 📄 License

This project is licensed under the **MIT License**.

## 📞 Contact

- **Author:** [0x0redd](https://github.com/0x0redd)
- **Email:** 0x0red.me@gmail.com
- **LinkedIn:** [CSC FSM](https://www.linkedin.com/in/othmane-ferrah-148a0b160/) 

---
🌿 *Smart irrigation for a sustainable future!* 🚀

