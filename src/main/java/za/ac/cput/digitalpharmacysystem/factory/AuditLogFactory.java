package za.ac.cput.digitalpharmacysystem.factory;


import za.ac.cput.digitalpharmacysystem.domain.AuditLog;
import za.ac.cput.digitalpharmacysystem.util.Helper;

import java.time.LocalDateTime;


public class AuditLogFactory {
    public static AuditLog createAuditLog(String id, String action, String entityTarget, LocalDateTime timeStamp) {
        if (id == null || Helper.isNullOrEmpty(action) || Helper.isNullOrEmpty(entityTarget) || timeStamp == null) {
            return null;
        }
        return new AuditLog.Builder()
                .setId(id)
                .setAction(action)
                .setEntityTarget(entityTarget)
                .setTimeStamp(timeStamp)
                .build();

    }
}