package org.sid.weatherapi.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Entity
@Data
@Table(name = "station1")
@NoArgsConstructor
@AllArgsConstructor
public class weatherStation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generate unique ID
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;

    @Column(name = "date", nullable = false, updatable = false)
    private Timestamp date;

    @Column(name = "hum_moy")
    private int hum_moy;
    @Column(name = "hum_min")
    private int hum_min;
    @Column(name = "hum_max")
    private int hum_max;

    @Column(name = "temp_moy")
    private float temp_moy;
    @Column(name = "temp_min")
    private float temp_min;
    @Column(name = "temp_max")
    private float temp_max;

    @Column(name = "solar_radiation_min")
    private Double solar_radiation_min;
    @Column(name = "solar_radiation_max")
    private Double solar_radiation_max;
    @Column(name = "solar_radiation_moy")
    private Double solar_radiation_moy;
}
