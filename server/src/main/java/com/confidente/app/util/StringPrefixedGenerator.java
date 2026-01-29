package com.confidente.app.util;

import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.generator.BeforeExecutionGenerator;
import org.hibernate.generator.EventType;
import java.io.Serializable;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.EnumSet;

public class StringPrefixedGenerator implements BeforeExecutionGenerator {

    private final String prefix;
    private final String sequenceName;
    private final int size;

    public StringPrefixedGenerator(StringPrefixedId config) {
        this.prefix = config.prefix();
        this.sequenceName = config.sequence();
        this.size=config.size();
    }

    @Override
    public Serializable generate(SharedSessionContractImplementor session, Object object, Object currentValue, EventType eventType) {
        try (Connection connection = session.getJdbcConnectionAccess().obtainConnection();
             Statement statement = connection.createStatement();
             ResultSet rs = statement.executeQuery("SELECT nextval('" + sequenceName + "')")) {

            if (rs.next()) {
                int nextVal = rs.getInt(1);
                int sizeReste= this.size-prefix.length();
                String id=prefix + String.format("%0"+sizeReste+"d", nextVal);
                return id;
            }
        } catch (SQLException e) {
            throw new RuntimeException("Erreur lors de la génération de l'ID", e);
        }

        throw new RuntimeException("Impossible de générer l'ID pour " + object.getClass());
    }

    @Override
    public EnumSet<EventType> getEventTypes() {
        return EnumSet.of(EventType.INSERT);
    }
}