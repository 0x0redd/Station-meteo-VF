package org.sid.weatherapi.Service;

import org.sid.weatherapi.Entity.weatherStation;
import org.sid.weatherapi.Repository.weatherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Service
public class weatherService {

    @Autowired
    private weatherRepository weatherRepo;

    public weatherStation saveDetails(weatherStation ws) {
        // Ensure date is set (uses server time)
        if (ws.getDate() == null) {
            ws.setDate(Timestamp.from(LocalDateTime.now(ZoneOffset.UTC).toInstant(ZoneOffset.UTC)));
        }

        // Ensure this creates a new record instead of updating
        weatherStation newRecord = new weatherStation();
        newRecord.setDate(ws.getDate());
        newRecord.setHum_moy(ws.getHum_moy());
        newRecord.setHum_min(ws.getHum_min());
        newRecord.setHum_max(ws.getHum_max());
        newRecord.setTemp_moy(ws.getTemp_moy());
        newRecord.setTemp_min(ws.getTemp_min());
        newRecord.setTemp_max(ws.getTemp_max());
        newRecord.setSolar_radiation_min(ws.getSolar_radiation_min());
        newRecord.setSolar_radiation_max(ws.getSolar_radiation_max());
        newRecord.setSolar_radiation_moy(ws.getSolar_radiation_moy());

        return weatherRepo.save(newRecord); // Insert new record instead of updating
    }

    public List<weatherStation> getAllWeatherStations() {
        return weatherRepo.findAll();
    }

    public List<weatherStation> getWeatherStationsByDate(Timestamp date) {
        return weatherRepo.findByCreatedAt(date);
    }

    public List<weatherStation> getWeatherStationsByDateRange(Timestamp minDate, Timestamp maxDate) {
        return weatherRepo.findByCreatedAtBetween(minDate, maxDate);
    }
}
