package org.sid.weatherapi.Repository;

import org.sid.weatherapi.Entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@Repository
public interface weatherRepository extends JpaRepository<weatherStation, Integer> {


    @Query("SELECT ws FROM weatherStation ws WHERE ws.date = :date")
    List<weatherStation> findByCreatedAt(Timestamp date);

    @Query("SELECT ws FROM weatherStation ws WHERE ws.date BETWEEN :minDate AND :maxDate")
    List<weatherStation> findByCreatedAtBetween(Timestamp minDate, Timestamp maxDate);

}
