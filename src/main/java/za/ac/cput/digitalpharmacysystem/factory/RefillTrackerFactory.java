package za.ac.cput.digitalpharmacysystem.factory;

import za.ac.cput.digitalpharmacysystem.domain.RefillStatus;
import za.ac.cput.digitalpharmacysystem.domain.RefillTracker;

import java.time.LocalDate;
import java.util.UUID;

/*
 * Likhona Noroyita
 * 230154239

 */

public class RefillTrackerFactory {
    public static RefillTracker createRefillTracker(
            String patientId,
            String prescriptionId,
            int totalRefillsAllowed){
        if (patientId == null || patientId.isBlank()){
            return null;
        }
        if (prescriptionId == null || prescriptionId.isBlank()){
            return null;
        }
        if(totalRefillsAllowed <= 0){
            return null;
        }
        return new RefillTracker.Builder()
                .setRefillId(UUID.randomUUID().toString())
                .setPatientId(patientId)
                .setPrescriptionId(prescriptionId)
                .setTotalRefillsAllowed(totalRefillsAllowed)
                .setRefillsUsed(0)
                .setNextEligibleDate(LocalDate.now())
                .setRefillStatus(RefillStatus.AVAILABLE)
                .build();
    }
}
