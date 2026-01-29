/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.util.fonction;

import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.ZonedDateTime;

/**
 *
 * @author Ny Anjara Mamisoa
 */
public class DateUtils {
    public static ZoneId madagascarZone = ZoneId.of("Indian/Antananarivo");
    public static Timestamp getCurrentTimestamp() {
        ZonedDateTime zonedDateTime = ZonedDateTime.now(madagascarZone);
        return Timestamp.valueOf(zonedDateTime.toLocalDateTime());
    }
}
