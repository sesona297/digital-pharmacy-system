package za.ac.cput.digitalpharmacysystem.factory;

import org.junit.jupiter.api.Test;
import za.ac.cput.digitalpharmacysystem.domain.Category;
import za.ac.cput.digitalpharmacysystem.domain.Product;

import static org.junit.jupiter.api.Assertions.*;

/*
 * Asenathi Nini
 * 230452817
 */
class ProductFactoryTest {

    @Test
    void testCreateProductSuccess() {
        Category category = CategoryFactory.createCategory("C001", "Painkillers", "Tablet", "Schedule 2");

        Product product = ProductFactory.createProduct(
                "P001",
                "Panado",
                "500mg tablets",
                45.00,
                "SKU-PAN-500",
                100,
                false,
                category
        );

        assertNotNull(product);
        assertEquals("P001", product.getProductId());
        assertEquals("Panado", product.getProductName());
        assertEquals(45.00, product.getPrice());
        assertNotNull(product.getCategory());
        System.out.println("Success Test Passed: " + product);
    }

    @Test
    void testCreateProductNegativePriceFailure() {
        Category category = CategoryFactory.createCategory("C001", "Painkillers", "Tablet", "Schedule 2");

        Product product = ProductFactory.createProduct(
                "P001",
                "Panado",
                "500mg tablets",
                -10.00,
                "SKU-PAN-500",
                100,
                false,
                category
        );

        assertNull(product);
    }
}