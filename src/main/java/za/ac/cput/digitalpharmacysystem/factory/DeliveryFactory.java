package za.ac.cput.digitalpharmacysystem.factory;

import za.ac.cput.digitalpharmacysystem.domain.Delivery;
import za.ac.cput.digitalpharmacysystem.domain.DeliveryStatus;
import za.ac.cput.digitalpharmacysystem.util.Helper;

public class DeliveryFactory {

    public static Delivery createDelivery(String id, String trackingNo, String address, DeliveryStatus status) {
        if (id ==null || Helper.isNullOrEmpty(trackingNo) || Helper.isNullOrEmpty(address) || status == null) {
            return null;
        }
        return new Delivery.Builder()
                .setId(id)
                .setTrackingNo(trackingNo)
                .setAddress(address)
                .setStatus(status)
                .build();


    }
}
