package za.ac.cput.digitalpharmacysystem.service;

import za.ac.cput.digitalpharmacysystem.domain.Delivery;

import java.util.List;

/*
 * Sesona Ntshatsha
 * 240773365

 */

public interface IDeliveryService extends IService<Delivery, String> {
    Delivery findByOrderNumber(String orderNumber);
    List<Delivery> getCourierManifest(Long courierId);
}
