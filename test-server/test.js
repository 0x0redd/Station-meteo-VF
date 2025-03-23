// Weather Station Data Sender - JavaScript implementation
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
// For Node.js < 18, uncomment this line:
// const fetch = require('node-fetch');

// Server API details
const serverUrl = "http://192.168.1.6:8080";
const apiEndpoint = "/addWeatherStationData";

// Local path to CSV file instead of fetching from a server
const csvFilePath = path.resolve(__dirname, "Cleaned_Weather_Data.csv");

let weatherData = [];
let currentIndex = 0;

// Function to load weather data from the CSV file
async function loadWeatherDataFromCSV() {
    try {
        // Read the CSV file
        const fileContent = fs.readFileSync(csvFilePath, 'utf8');
        
        // Remove any comments (lines starting with //)
        const cleanedContent = fileContent
            .split('\n')
            .filter(line => !line.trim().startsWith('//'))
            .join('\n');
        
        // Parse the CSV data
        weatherData = parse(cleanedContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });
        
        console.log("[Client] Weather data loaded from CSV file. Total records:", weatherData.length);
    } catch (error) {
        console.error("[Client] Error loading weather data from CSV:", error);
    }
}

// Function to get weather data from the loaded CSV
function getRealWeatherData() {
    if (weatherData.length === 0) {
        console.error("[Client] No weather data available.");
        return null;
    }

    const data = weatherData[currentIndex];
    currentIndex = (currentIndex + 1) % weatherData.length;

    // Create a timestamp for the current hour exactly
    const now = new Date();
    const hourTimestamp = new Date(
        now.getFullYear(),
        now.getMonth(), 
        now.getDate(), 
        now.getHours(), 
        0, 0, 0
    ).toISOString();

    return {
        hum_moy: parseFloat(data.Humidity_Mean),
        hum_min: parseFloat(data.Humidity_Min),
        hum_max: parseFloat(data.Humidity_Max),
        temp_moy: parseFloat(data.Temp_Mean),
        temp_min: parseFloat(data.Temp_Min),
        temp_max: parseFloat(data.Temp_Max),
        solar_radiation_min: parseFloat(data.Solar_Radiation_Mean),
        solar_radiation_max: parseFloat(data.Solar_Radiation_Mean),
        solar_radiation_moy: parseFloat(data.Solar_Radiation_Mean),
        // Use the exact hour timestamp
        timestamp: hourTimestamp
    };
}

// Function to send data to API
async function postData() {
    try {
        const data = getRealWeatherData();
        if (!data) return;

        console.log("[Client] Sending JSON:", JSON.stringify(data));
        
        const response = await fetch(`${serverUrl}${apiEndpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        
        if (response.ok) {
            const responseData = await response.text();
            console.log("[Client] Server Response:", responseData);
        } else {
            console.error("[Client] POST failed with status:", response.status);
        }
    } catch (error) {
        console.error("[Client] Error sending data:", error);
    }
}

// Calculate time until next hour
function calculateTimeUntilNextHour() {
    const now = new Date();
    const nextHour = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours() + 1,
        0, 0, 0
    );
    
    return nextHour - now;
}

// Schedule the next data transmission at the top of the next hour
function scheduleNextTransmission() {
    const timeUntilNextHour = calculateTimeUntilNextHour();
    
    console.log(`[Client] Next transmission scheduled at ${new Date(Date.now() + timeUntilNextHour).toLocaleTimeString()}`);
    console.log(`[Client] Waiting ${Math.floor(timeUntilNextHour / 1000)} seconds...`);
    
    setTimeout(() => {
        // Send data at the top of the hour
        postData();
        // Schedule the next hour's transmission
        scheduleNextTransmission();
    }, timeUntilNextHour);
}

// Start the process
async function init() {
    await loadWeatherDataFromCSV();
    
    console.log("[Client] Weather Station Data Sender Started");
    console.log(`[Client] Server URL: ${serverUrl}${apiEndpoint}`);
    
    // Send data immediately for initial test
    console.log("[Client] Sending initial test data...");
    postData();
    
    // Schedule regular transmissions at the top of each hour
    scheduleNextTransmission();
}

// Start the application
init();