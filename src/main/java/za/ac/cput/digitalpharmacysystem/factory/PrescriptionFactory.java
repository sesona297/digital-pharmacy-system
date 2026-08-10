package za.ac.cput.digitalpharmacysystem.factory;

import za.ac.cput.digitalpharmacysystem.domain.Prescription;
import za.ac.cput.digitalpharmacysystem.domain.VerificationStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/*
 * Likhona Noroyita
 * 230154239

 */

public class PrescriptionFactory {

    public static Prescription createPrescription(
            String patientId,
            String uploadedFilePath,
            LocalDate issuedDate){

        if (patientId == null || patientId.isBlank()){
            return null;
        }
        if (uploadedFilePath == null || uploadedFilePath.isBlank()){
            return null;
        }
        if (issuedDate == null){
            return null;
        }
        return new Prescription.Builder()
                .setPatientId(UUID.randomUUID().toString())
                .setPatientId(patientId)
                .setUploadedFilePath(uploadedFilePath)
                .setIssuedDate(issuedDate)
                .setUploadedAt(LocalDateTime.now())
                .setVerificationStatus(VerificationStatus.PENDING)
                .build();

    }
}
