/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.util.fonction;

import java.security.SecureRandom;

/**
 *
 * @author Ny Anjara Mamisoa
 */
public final class RandomStringGenerator {
    private static final String UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String LOWER = UPPER.toLowerCase();
    private static final String DIGITS = "0123456789";

    private static final SecureRandom RANDOM = new SecureRandom();

    private RandomStringGenerator() { /* utilitaire */ }

    /**
     * Génère une chaîne aléatoire composée de lettres (maj + min) et chiffres.
     *
     * @param length longueur désirée (doit être >= 0)
     * @return chaîne aléatoire de longueur length ("" si length == 0)
     * @throws IllegalArgumentException si length < 0
     */
    public static String randomAlphaNumeric(int length) {
        if (length < 0) throw new IllegalArgumentException("length must be >= 0");
        if (length == 0) return "";

        String alphabet = UPPER + LOWER + DIGITS;
        return randomFromAlphabet(length, alphabet);
    }

    /**
     * Génère une chaîne aléatoire avec options :
     *
     * @param length longueur désirée
     * @param useUpper inclure majuscules
     * @param useLower inclure minuscules
     * @param useDigits inclure chiffres
     * @return chaîne aléatoire
     */
    public static String random(int length, boolean useUpper, boolean useLower, boolean useDigits) {
        if (length < 0) throw new IllegalArgumentException("length must be >= 0");
        StringBuilder alphabet = new StringBuilder();
        if (useUpper) alphabet.append(UPPER);
        if (useLower) alphabet.append(LOWER);
        if (useDigits) alphabet.append(DIGITS);

        if (alphabet.length() == 0) {
            throw new IllegalArgumentException("At least one character set must be enabled");
        }
        return randomFromAlphabet(length, alphabet.toString());
    }

    // Implémentation privée commune
    private static String randomFromAlphabet(int length, String alphabet) {
        StringBuilder sb = new StringBuilder(length);
        final int aLen = alphabet.length();
        for (int i = 0; i < length; i++) {
            int idx = RANDOM.nextInt(aLen);
            sb.append(alphabet.charAt(idx));
        }
        return sb.toString();
    }
}
