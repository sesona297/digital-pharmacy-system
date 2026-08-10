package za.ac.cput.digitalpharmacysystem.domain;


import jakarta.persistence.*;

import java.time.LocalDate;

/*
 * Likhona Noroyita
 * 230154239

 */

@Entity
@Table(name = "refill_tracker")
public class RefillTracker {

    @Id
    private String refillId;
    private String patientId;
    private String prescriptionId;
    private int totalRefillsAllowed;
    private int refillsUsed;
    private LocalDate nextEligibleDate;


    @Enumerated(EnumType.STRING)
    private RefillStatus refillStatus;

    protected  RefillTracker(){
    }

    private RefillTracker(Builder builder){
        this.refillId = builder.refillId;
        this.patientId = builder.patientId;
        this.prescriptionId = builder.prescriptionId;
        this.totalRefillsAllowed = builder.totalRefillsAllowed;
        this.refillsUsed = builder.refillsUsed;
        this.nextEligibleDate = builder.nextEligibleDate;
        this.refillStatus = builder.refillStatus;
    }

    public String getRefillId(){
        return refillId;
    }
    public String getPatientId(){
        return patientId;
    }
    public String getPrescriptionId(){
        return prescriptionId;
    }
    public int getTotalRefillsAllowed(){
        return totalRefillsAllowed;
    }
    public int getRefillsUsed(){
        return refillsUsed;
    }
    public LocalDate getNextEligibleDate(){
        return nextEligibleDate;
    }
    public RefillStatus getRefillStatus(){
        return refillStatus;
    }

    public static class Builder{
        private String refillId;
        private String patientId;
        private String prescriptionId;
        private int totalRefillsAllowed;
        private int refillsUsed;
        private LocalDate nextEligibleDate;
        private RefillStatus refillStatus;

        public Builder setRefillId(String refillId){
            this.refillId = refillId;
            return this;
        }
        public Builder setPatientId(String patientId){
            this.patientId = patientId;
            return this;
        }
        public Builder setPrescriptionId(String prescriptionId){
            this.prescriptionId = prescriptionId;
            return this;
        }
        public Builder setTotalRefillsAllowed(int totalRefillsAllowed){
            this.totalRefillsAllowed = totalRefillsAllowed;
            return this;
        }
        public Builder setRefillsUsed(int refillsUsed){
            this.refillsUsed = refillsUsed;
            return this;
        }
        public Builder setNextEligibleDate(LocalDate nextEligibleDate){
            this.nextEligibleDate = nextEligibleDate;
            return this;
        }
        public Builder setRefillStatus(RefillStatus refillStatus){
            this.refillStatus = refillStatus;
            return this;
        }
        public Builder copy(RefillTracker tracker){
            this.refillId = tracker.refillId;
            this.patientId = tracker.patientId;
            this.prescriptionId = tracker.prescriptionId;
            this.totalRefillsAllowed = tracker.totalRefillsAllowed;
            this.refillsUsed = tracker.refillsUsed;
            this.nextEligibleDate = tracker.nextEligibleDate;
            this.refillStatus = tracker.refillStatus;
            return this;
        }
        public RefillTracker build(){
            return new RefillTracker(this);
        }
    }
}
