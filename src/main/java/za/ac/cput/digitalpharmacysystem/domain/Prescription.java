package za.ac.cput.digitalpharmacysystem.domain;


import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

/*
 * Likhona Noroyita
 * 230154239

 */

@Entity
@Table(name = "prescription")
public class Prescription {

    @Id

    private String prescriptionId;
    private String patientId;
    private String uploadedFilePath;


    @Enumerated(EnumType.STRING)
    private VerificationStatus verificationStatus;
    private String rejectionReason;
    private LocalDate issuedDate;
    private LocalDateTime uploadedAt;
    private String verifiedBy;
    private LocalDateTime verifiedAt;

    protected Prescription(){
    }

    private Prescription(Builder builder){
        this.prescriptionId = builder.prescriptionId;
        this.patientId = builder.patientId;
        this.uploadedFilePath = builder.uploadedFilePath;
        this.verificationStatus = builder.verificationStatus;
        this.rejectionReason = builder.rejectionReason;
        this.issuedDate = builder.issuedDate;
        this.uploadedAt =builder.uploadedAt;
        this.verifiedBy = builder.verifiedBy;
        this.verifiedAt = builder.verifiedAt;
    }

    public String getPrescriptionId(){
        return prescriptionId;
    }
    public String getPatientId(){
        return prescriptionId;
    }
    public String getUploadedFilePath(){
        return uploadedFilePath;
    }
    public VerificationStatus getVerificationStatus(){
        return verificationStatus;
    }
    public String getRejectionReason(){
        return rejectionReason;
    }
    public LocalDate getIssuedDate(){
        return issuedDate;
    }
    public LocalDateTime getUploadedAt(){
        return uploadedAt;
    }
    public String getVerifiedBy(){
        return verifiedBy;
    }
    public LocalDateTime getVerifiedAt(){
        return verifiedAt;
    }

    public static class Builder{
        private String prescriptionId;
        private String patientId;
        private String uploadedFilePath;
        private VerificationStatus verificationStatus;
        private String rejectionReason;
        private LocalDate issuedDate;
        private LocalDateTime uploadedAt;
        private String verifiedBy;
        private LocalDateTime verifiedAt;

        public Builder setPrescriptionId(String prescriptionId) {
            this.prescriptionId = prescriptionId;
            return this;
        }
        public Builder setPatientId(String patientId){
            this.patientId = patientId;
            return this;
        }
        public Builder setUploadedFilePath(String uploadedFilePath){
            this.uploadedFilePath = uploadedFilePath;
            return this;
        }
        public Builder setVerificationStatus(VerificationStatus verificationStatus){
            this.verificationStatus = verificationStatus;
            return this;
        }
        public Builder setRejectionReason(String rejectionReason){
            this.rejectionReason = rejectionReason;
            return this;
        }
        public Builder setIssuedDate(LocalDate issuedDate){
            this.issuedDate = issuedDate;
            return this;
        }
        public Builder setUploadedAt(LocalDateTime uploadedAt){
            this.uploadedAt = uploadedAt;
            return this;
        }
        public Builder setVerifiedBy(String verifiedBy){
            this.verifiedBy = verifiedBy;
            return this;
        }
        public Builder setVerifiedAt(LocalDateTime verifiedAt){
            this.verifiedAt = verifiedAt;
            return this;
        }
        public Builder copy(Prescription prescription){
            this.prescriptionId = prescription.prescriptionId;
            this.patientId = prescription.patientId;
            this.uploadedFilePath = prescription.uploadedFilePath;
            this.verificationStatus = prescription.verificationStatus;
            this.rejectionReason = prescription.rejectionReason;
            this.issuedDate = prescription.issuedDate;
            this.uploadedAt = prescription.uploadedAt;
            this.verifiedBy = prescription.verifiedBy;
            this.verifiedAt = prescription.verifiedAt;
            return this;
        }

        public Prescription build(){
            return new Prescription(this);
        }

    }


}
