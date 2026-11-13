package za.ac.cput.digitalpharmacysystem.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import za.ac.cput.digitalpharmacysystem.config.CorsConfig;
import za.ac.cput.digitalpharmacysystem.config.SecurityConfig;
import za.ac.cput.digitalpharmacysystem.domain.Order;
import za.ac.cput.digitalpharmacysystem.domain.User;
import za.ac.cput.digitalpharmacysystem.domain.User.UserRole;
import za.ac.cput.digitalpharmacysystem.dto.PlaceOrderRequest;
import za.ac.cput.digitalpharmacysystem.repository.UserRepository;
import za.ac.cput.digitalpharmacysystem.service.*;
import za.ac.cput.digitalpharmacysystem.util.PrescriptionFileStorage;

import java.util.List;
import java.util.Set;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;


@WebMvcTest
@Import({SecurityConfig.class, CorsConfig.class})
class SecurityRulesTest {

    private static final String BASE = "/digitalpharmacysystem";

    private static final String ANON = "ANON";
    private static final Set<String> ALL_SIGNED_IN = Set.of("CUSTOMER", "PHARMACIST", "COURIER", "ADMIN");
    private static final Set<String> STAFF = Set.of("PHARMACIST", "ADMIN");
    private static final Set<String> ADMIN_ONLY = Set.of("ADMIN");
    private static final Set<String> COURIER_ONLY = Set.of("COURIER");
    private static final Set<String> EVERYONE = Set.of(ANON, "CUSTOMER", "PHARMACIST", "COURIER", "ADMIN");
    private static final List<String> ROLES = List.of(ANON, "CUSTOMER", "PHARMACIST", "COURIER", "ADMIN");

    @Autowired
    private MockMvc mvc;

    @MockBean private IOrderService orderService;
    @MockBean private IUserService userService;
    @MockBean private IPrescriptionService prescriptionService;
    @MockBean private IProductService productService;
    @MockBean private ICategoryService categoryService;
    @MockBean private IDeliveryService deliveryService;
    @MockBean private IRefillTrackerService refillTrackerService;
    @MockBean private IAuditLogService auditLogService;
    @MockBean private AuthService authService;
    @MockBean private PrescriptionFileStorage prescriptionFileStorage;
    @MockBean private JwtService jwtService;
    @MockBean private UserRepository userRepository;


    private static Authentication login(String role, long id) {
        User user = new User.Builder()
                .setId(id)
                .setFullName(role + " " + id)
                .setEmail(role.toLowerCase() + id + "@test.local")
                .setPasswordHash("x")
                .setRole(UserRole.valueOf(role))
                .build();
        return new UsernamePasswordAuthenticationToken(
                user, null, List.of(new SimpleGrantedAuthority("ROLE_" + role)));
    }

    private int send(HttpMethod method, String path, String role, long userId, String body) {
        MockHttpServletRequestBuilder request = MockMvcRequestBuilders.request(method, path)
                .contentType(MediaType.APPLICATION_JSON)
                .content(body == null ? "{}" : body);
        if (!ANON.equals(role)) {
            request = request.with(authentication(login(role, userId)));
        }
        try {
            return mvc.perform(request).andReturn().getResponse().getStatus();
        } catch (Exception e) {
            return 500;
        }
    }

    private static boolean blocked(int status) {
        return status == 401 || status == 403;
    }

    private Order orderOwnedBy(String customerId) {
        Order order = mock(Order.class);
        when(order.getCustomerId()).thenReturn(customerId);
        when(orderService.read("ORD-1")).thenReturn(order);
        return order;
    }


    record Rule(HttpMethod method, String path, Set<String> allowed, String body) {
        Rule(HttpMethod method, String path, Set<String> allowed) {
            this(method, path, allowed, null);
        }

        @Override public String toString() { return method + " " + path + " -> " + allowed; }
    }

    private static Rule rule(HttpMethod m, String path, Set<String> allowed) {
        return new Rule(m, BASE + path, allowed, null);
    }

    private static Rule rule(HttpMethod m, String path, Set<String> allowed, String body) {
        return new Rule(m, BASE + path, allowed, body);
    }

    private static final List<Rule> RULES = List.of(
            rule(HttpMethod.POST, "/auth/login", EVERYONE),
            rule(HttpMethod.POST, "/auth/register", EVERYONE),
            rule(HttpMethod.GET, "/product/catalogue", EVERYONE),
            rule(HttpMethod.GET, "/product/rx", EVERYONE),
            rule(HttpMethod.GET, "/product/otc", EVERYONE),
            rule(HttpMethod.GET, "/category/getAll", EVERYONE),

            rule(HttpMethod.POST, "/order/create", ALL_SIGNED_IN),
            rule(HttpMethod.GET, "/order/customer/1", ALL_SIGNED_IN),
            rule(HttpMethod.GET, "/order/read/ORD-1", ALL_SIGNED_IN),
            rule(HttpMethod.POST, "/order/ORD-1/pay", ALL_SIGNED_IN),
            rule(HttpMethod.POST, "/order/ORD-1/cancel", ALL_SIGNED_IN),
            rule(HttpMethod.GET, "/order/getall", STAFF),
            rule(HttpMethod.POST, "/order/ORD-1/pack", STAFF),
            rule(HttpMethod.POST, "/order/ORD-1/collect", STAFF),
            rule(HttpMethod.DELETE, "/order/delete/ORD-1", ADMIN_ONLY),

            rule(HttpMethod.GET, "/prescription/mine", ALL_SIGNED_IN),
            rule(HttpMethod.GET, "/prescription/P1/file", ALL_SIGNED_IN),
            rule(HttpMethod.GET, "/prescription/pending", STAFF),
            rule(HttpMethod.GET, "/prescription", STAFF),
            rule(HttpMethod.GET, "/prescription/P1", STAFF),
            rule(HttpMethod.GET, "/prescription/patient/1", STAFF),
            rule(HttpMethod.POST, "/prescription", STAFF),
            rule(HttpMethod.PUT, "/prescription/P1/approve", STAFF),
            rule(HttpMethod.PUT, "/prescription/P1/reject", STAFF),
            rule(HttpMethod.PUT, "/prescription/P1/clarify", STAFF),
            rule(HttpMethod.DELETE, "/prescription/P1", STAFF),
            new Rule(HttpMethod.GET, "/api/prescriptions/mine", ALL_SIGNED_IN),
            new Rule(HttpMethod.GET, "/api/prescriptions/pending", STAFF),
            new Rule(HttpMethod.PUT, "/api/prescriptions/P1/approve", STAFF),
            new Rule(HttpMethod.DELETE, "/api/prescriptions/P1", STAFF),

            rule(HttpMethod.GET, "/refills", STAFF),
            rule(HttpMethod.POST, "/refills/process/P1", STAFF),
            rule(HttpMethod.GET, "/auditlog/getall", ADMIN_ONLY),
            rule(HttpMethod.DELETE, "/auditlog/delete/1", ADMIN_ONLY),

            rule(HttpMethod.POST, "/user/update", ALL_SIGNED_IN, "{\"id\":1}"),
            rule(HttpMethod.GET, "/user/getAll", STAFF),
            rule(HttpMethod.POST, "/user/create", ADMIN_ONLY),
            rule(HttpMethod.GET, "/user/read/1", ADMIN_ONLY),
            rule(HttpMethod.DELETE, "/user/delete/1", ADMIN_ONLY),

            rule(HttpMethod.POST, "/product/create", STAFF),
            rule(HttpMethod.GET, "/product/getall", STAFF),
            rule(HttpMethod.PATCH, "/product/P1/stock", STAFF),
            rule(HttpMethod.POST, "/category/create", STAFF),

            rule(HttpMethod.GET, "/delivery/courier/manifest", COURIER_ONLY),
            rule(HttpMethod.PATCH, "/delivery/D1/status?status=DELIVERED", Set.of("COURIER", "PHARMACIST", "ADMIN")),
            rule(HttpMethod.GET, "/delivery/getall", STAFF),
            rule(HttpMethod.PUT, "/delivery/D1/courier/2", STAFF)
    );

    static Stream<org.junit.jupiter.params.provider.Arguments> matrix() {
        return RULES.stream().flatMap(rule -> ROLES.stream()
                .map(role -> org.junit.jupiter.params.provider.Arguments.of(rule, role)));
    }

    @ParameterizedTest(name = "{0} as {1}")
    @MethodSource("matrix")
    void roleMatrix(Rule rule, String role) {
        orderOwnedBy("1");
        int status = send(rule.method(), rule.path(), role, 1L, rule.body());

        if (rule.allowed().contains(role)) {
            assertTrue(!blocked(status),
                    rule + " should be allowed for " + role + " but got " + status);
        } else {
            assertTrue(blocked(status),
                    rule + " should be blocked for " + role + " but got " + status);
        }
    }


    @Test
    @DisplayName("customer cannot list another customer's orders")
    void customerCannotListOthersOrders() {
        assertEquals(403, send(HttpMethod.GET, BASE + "/order/customer/1", "CUSTOMER", 2L, null));
        assertTrue(!blocked(send(HttpMethod.GET, BASE + "/order/customer/2", "CUSTOMER", 2L, null)));
    }

    @Test
    @DisplayName("staff can list any customer's orders")
    void staffCanListAnyOrders() {
        assertTrue(!blocked(send(HttpMethod.GET, BASE + "/order/customer/1", "PHARMACIST", 9L, null)));
    }

    @Test
    @DisplayName("customer cannot read, pay or cancel someone else's order")
    void customerCannotTouchOthersOrder() {
        orderOwnedBy("1");
        assertEquals(403, send(HttpMethod.GET, BASE + "/order/read/ORD-1", "CUSTOMER", 2L, null));
        assertEquals(403, send(HttpMethod.POST, BASE + "/order/ORD-1/pay", "CUSTOMER", 2L, null));
        assertEquals(403, send(HttpMethod.POST, BASE + "/order/ORD-1/cancel", "CUSTOMER", 2L, null));
    }

    @Test
    @DisplayName("owner can read, pay and cancel their own order")
    void ownerCanTouchOwnOrder() {
        orderOwnedBy("2");
        assertTrue(!blocked(send(HttpMethod.GET, BASE + "/order/read/ORD-1", "CUSTOMER", 2L, null)));
        assertTrue(!blocked(send(HttpMethod.POST, BASE + "/order/ORD-1/pay", "CUSTOMER", 2L, null)));
        assertTrue(!blocked(send(HttpMethod.POST, BASE + "/order/ORD-1/cancel", "CUSTOMER", 2L, null)));
    }

    @Test
    @DisplayName("a pharmacist can cancel or read any order, but only the owner or an admin can pay")
    void staffOrderRights() {
        orderOwnedBy("1");
        assertTrue(!blocked(send(HttpMethod.GET, BASE + "/order/read/ORD-1", "PHARMACIST", 9L, null)));
        assertTrue(!blocked(send(HttpMethod.POST, BASE + "/order/ORD-1/cancel", "PHARMACIST", 9L, null)));
        assertEquals(403, send(HttpMethod.POST, BASE + "/order/ORD-1/pay", "PHARMACIST", 9L, null));
        assertTrue(!blocked(send(HttpMethod.POST, BASE + "/order/ORD-1/pay", "ADMIN", 9L, null)));
    }

    @Test
    @DisplayName("placing an order always uses the signed-in customer, not the body's customerId")
    void orderCustomerComesFromToken() {
        send(HttpMethod.POST, BASE + "/order/create", "CUSTOMER", 2L,
                "{\"customerId\":\"1\",\"orderType\":\"CLICK_AND_COLLECT\",\"items\":[]}");
        verify(orderService).placeOrder(argThat((PlaceOrderRequest r) -> "2".equals(r.getCustomerId())));
    }

    @Test
    @DisplayName("a customer can edit their own profile but not another user's")
    void profileUpdateOwnership() {
        assertEquals(403, send(HttpMethod.POST, BASE + "/user/update", "CUSTOMER", 2L, "{\"id\":1}"));
        assertTrue(!blocked(send(HttpMethod.POST, BASE + "/user/update", "CUSTOMER", 2L, "{\"id\":2}")));
        assertTrue(!blocked(send(HttpMethod.POST, BASE + "/user/update", "ADMIN", 9L, "{\"id\":1}")));
    }
}