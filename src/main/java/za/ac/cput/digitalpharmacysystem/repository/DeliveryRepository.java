package za.ac.cput.digitalpharmacysystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.digitalpharmacysystem.domain.Delivery;

import java.util.List;
import java.util.Optional;
/*
 * Sesona Ntshatsha
 * 240773365
 *

 */

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, String> {

    Optional<Delivery> findByOrder_OrderNumber(String orderNumber);

    List<Delivery> findByCourier_Id(Long courierId);
}
