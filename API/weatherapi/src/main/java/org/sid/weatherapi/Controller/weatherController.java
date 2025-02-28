package org.sid.weatherapi.Controller;

import org.sid.weatherapi.Entity.weatherStation;
import org.sid.weatherapi.Service.weatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@RestController
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST})
public class weatherController {
    @Autowired
    private weatherService ws;

    @PostMapping("/addWeatherStationData")
    public weatherStation postDetails(@RequestBody weatherStation wst){
        return ws.saveDetails(wst);
    }

    @GetMapping("/getAllWeatherStations")
    @ResponseBody
    public List<weatherStation> getAllWeatherStations() {
        return ws.getAllWeatherStations();
    }


    @GetMapping(params = "date")
    public List<weatherStation> getWeatherStationsByDate(@RequestParam("date") Timestamp date) {
        return ws.getWeatherStationsByDate(date);
    }

    @GetMapping(params = {"minDate", "maxDate"})
    public List<weatherStation> getWeatherStationsByDateRange(
            @RequestParam("minDate") Timestamp minDate,
            @RequestParam("maxDate") Timestamp maxDate) {
        return ws.getWeatherStationsByDateRange(minDate, maxDate);
    }
}
