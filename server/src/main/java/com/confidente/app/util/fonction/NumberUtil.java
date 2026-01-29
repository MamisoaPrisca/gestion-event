/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.util.fonction;

import java.text.DecimalFormat;
import java.text.FieldPosition;

/**
 *
 * @author Ny Anjara Mamisoa
 */
public class NumberUtil {
    public static String formaterNumbre(long nbr) {
        String result="" ;
        DecimalFormat formatter = new DecimalFormat();
        result = "" + formatter.format(nbr, new StringBuffer()
            , new FieldPosition(DecimalFormat.FRACTION_FIELD));
        return result;
    }
    
    public static String formaterNumbre(double nbr) {
        return formaterNumbre((long)nbr);
    }
}
