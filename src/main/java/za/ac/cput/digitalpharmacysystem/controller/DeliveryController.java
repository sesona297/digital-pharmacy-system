package za.ac.cput.digitalpharmacysystem.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.digitalpharmacysystem.domain.Delivery;
import za.ac.cput.digitalpharmacysystem.domain.DeliveryStatus;
import za.ac.cput.digitalpharmacysystem.service.IAuditLogService;
import za.ac.cput.digitalpharmacysystem.service.IDeliveryService;
import za.ac.cput.digitalpharmacysystem.domain.AuditLog;
import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


import java.util.List;

/*
 * Sesona Ntshatsha
 * 240773365

 */

@RestController
@RequestMapping("/digitalpharmacysystem/delivery")
public class DeliveryController {
    private final IDeliveryService service;
    private final IAuditLogService auditLogService;

    @Autowired
    public DeliveryController(
            IDeliveryService service,
            IAuditLogService auditLogService) {
        this.service = service;
        this.auditLogService = auditLogService;
    }

    @PostMapping("/create")
    public ResponseEntity<Delivery> create(@RequestBody Delivery delivery) {
        Delivery created = service.create(delivery);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping("/read/{id}")
    public ResponseEntity<Delivery> read(@PathVariable String id) {
        Delivery delivery = service.read(id);
        if (delivery == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(delivery, HttpStatus.OK);
    }

    @PostMapping("/update")
    public ResponseEntity<Delivery> update(@RequestBody Delivery delivery) {
        Delivery updated = service.update(delivery);
        if (updated == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        boolean deleted = service.delete(id);
        if (!deleted) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/getall")
    public ResponseEntity<List<Delivery>> getAll() {
        List<Delivery> deliveries = service.getAll();
        return new ResponseEntity<>(deliveries, HttpStatus.OK);
    }



    @PatchMapping("/{id}/status")
    public ResponseEntity<Delivery> updateStatus(
            @PathVariable String id,
            @RequestParam DeliveryStatus status) {

        Delivery delivery = service.read(id);

        if (delivery == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        DeliveryStatus oldStatus = delivery.getStatus();

        delivery.setStatus(status);

        Delivery updated = service.update(delivery);

        if (updated == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        AuditLog auditLog = new AuditLog.Builder()
                .setId(UUID.randomUUID().toString())
                .setAction("Delivery status changed from "
                        + oldStatus + " to " + status)
                .setEntityTarget("Delivery ID: " + id)
                .setTimeStamp(LocalDateTime.now())
                .build();

        auditLogService.create(auditLog);

        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @GetMapping("/order/{orderNumber}")
    public ResponseEntity<Delivery> getByOrderNumber(
            @PathVariable String orderNumber) {

        Delivery delivery = service.findByOrderNumber(orderNumber);

        if (delivery == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(delivery, HttpStatus.OK);
    }

    @GetMapping("/courier/{courierId}/manifest")
    public ResponseEntity<List<Delivery>> getCourierManifest(
            @PathVariable Long courierId) {

        List<Delivery> deliveries = service.getCourierManifest(courierId);

        return new ResponseEntity<>(deliveries, HttpStatus.OK);
    }
}