package org.sid.weatherapi.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Entity
@Data
@Table(name = "ET0")
@NoArgsConstructor
@AllArgsConstructor
public class ET0 {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date")
    private Timestamp date;

    @Column(name = "avg_temp")
    private float avgTemp;

    @Column(name = "avg_humidity")
    private int avgHumidity;

    @Column(name = "avg_solar_radiation")
    private float avgSolarRadiation;

    @Column(name = "predicted_ET0")
    private float predictedET0;
} 