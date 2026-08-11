package za.ac.cput.digitalpharmacysystem.factory;

import org.junit.jupiter.api.Test;
import za.ac.cput.digitalpharmacysystem.domain.Delivery;
import za.ac.cput.digitalpharmacysystem.domain.DeliveryStatus;

import static org.junit.jupiter.api.Assertions.*;
/*
 * Sesona Ntshatsha
 * 240773365

 */

public class DeliveryFactoryTest {

    @Test
    void testCreateDeliveryWithNullOrEmptyId() {
        Delivery deliveryWithEmptyId = DeliveryFactory.createDelivery(
                "",
                "TRK-98765",
                "123 Main Street, Cape Town",
                DeliveryStatus.PENDING
        );
        assertNull(deliveryWithEmptyId);


        Delivery deliveryWithNullId = DeliveryFactory.createDelivery(
                null,
                "TRK-98765",
                "123 Main Street, Cape Town",
                DeliveryStatus.PENDING
        );
        assertNull(deliveryWithNullId);
    }

    @Test
    void testCreateDeliveryWithEmptyAddress() {
        Delivery delivery = DeliveryFactory.createDelivery(
                "DEL-1001",
                "TRK-98765",
                "",
                DeliveryStatus.PENDING
        );

        assertNull(delivery);
    }

    @Test
    void testCreateDeliveryWithNullStatus() {
        Delivery delivery = DeliveryFactory.createDelivery(
                "DEL-1001",
                "TRK-98765",
                "123 Main Street, Cape Town",
                null
        );

        assertNull(delivery);
    }
}
