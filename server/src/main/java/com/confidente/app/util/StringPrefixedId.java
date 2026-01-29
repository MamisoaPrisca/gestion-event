/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.confidente.app.util;

import org.hibernate.annotations.IdGeneratorType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@IdGeneratorType(StringPrefixedGenerator.class)
@Retention(RetentionPolicy.RUNTIME)
public @interface StringPrefixedId {
    String prefix();
    String sequence();
    int size() default 5;
}
