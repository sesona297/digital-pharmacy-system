package za.ac.cput.digitalpharmacysystem.controller;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.resttestclient.TestRestTemplate;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.*;
import za.ac.cput.digitalpharmacysystem.domain.Category;
import za.ac.cput.digitalpharmacysystem.domain.Product;
import za.ac.cput.digitalpharmacysystem.factory.CategoryFactory;
import za.ac.cput.digitalpharmacysystem.factory.ProductFactory;

import static org.junit.jupiter.api.Assertions.*;

/*
 * Asenathi Nini
 * 230452817
 */
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ProductControllerTest {

    @Autowired
    private TestRestTemplate restTemplate;

    private final String baseURL = "/digitalpharmacysystem/product";
    private static Product product;
    private static Category category;

    @BeforeAll
    static void setUp() {
        category = CategoryFactory.createCategory(
                "C002",
                "Antibiotics",
                "Capsule",
                "Schedule 4"
        );

        product = ProductFactory.createProduct(
                "P001",
                "Amoxicillin",
                "250mg capsules",
                120.00,
                "SKU-AMX-250",
                50,
                true,
                category
        );
    }

    @Test
    @Order(1)
    void a_create() {
        String url = baseURL + "/create";
        ResponseEntity<Product> postResponse = restTemplate.postForEntity(url, product, Product.class);

        assertNotNull(postResponse);
        assertNotNull(postResponse.getBody());
        assertEquals(HttpStatus.CREATED, postResponse.getStatusCode());
        assertEquals(product.getProductId(), postResponse.getBody().getProductId());
    }

    @Test
    @Order(2)
    void b_read() {
        String url = baseURL + "/read/" + product.getProductId();
        ResponseEntity<Product> response = restTemplate.getForEntity(url, Product.class);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(product.getProductId(), response.getBody().getProductId());
    }

    @Test
    @Order(3)
    void c_update() {
        Product updatedProduct = ProductFactory.createProduct(
                product.getProductId(),
                "Amoxicillin",
                "250mg capsules - Updated",
                135.00,
                "SKU-AMX-250",
                40,
                true,
                category
        );

        String url = baseURL + "/update";
        ResponseEntity<Product> response = restTemplate.postForEntity(url, updatedProduct, Product.class);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(135.00, response.getBody().getPrice());
    }

    @Test
    @Order(4)
    void d_getAll() {
        String url = baseURL + "/getall";
        HttpHeaders headers = new HttpHeaders();
        HttpEntity<String> entity = new HttpEntity<>(null, headers);

        ResponseEntity<Product[]> response = restTemplate.exchange(url, HttpMethod.GET, entity, Product[].class);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().length > 0);
    }

    @Test
    @Order(5)
    void e_delete() {
        String url = baseURL + "/delete/" + product.getProductId();
        restTemplate.delete(url);

        String readUrl = baseURL + "/read/" + product.getProductId();
        ResponseEntity<Product> response = restTemplate.getForEntity(readUrl, Product.class);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }
}
