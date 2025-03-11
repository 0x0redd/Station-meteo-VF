package org.sid.weatherapi.Repository;

import org.sid.weatherapi.Entity.ET0;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ET0Repository extends JpaRepository<ET0, Long> {
    // Additional query methods can be defined here if needed
} 