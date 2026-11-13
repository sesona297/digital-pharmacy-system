package za.ac.cput.digitalpharmacysystem.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import za.ac.cput.digitalpharmacysystem.domain.User;

/**
 * Who is making this request, taken from the verified JWT (never from the request body
 * or from client-supplied headers).
 */
public final class CurrentUser {

    private CurrentUser() {
    }

    /** The signed-in user, or null if the request is anonymous. */
    public static User get() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.getPrincipal() instanceof User user ? user : null;
    }

    public static boolean isAdmin(User user) {
        return user != null && user.getRole() == User.UserRole.ADMIN;
    }

    /** Pharmacist or admin. */
    public static boolean isStaff(User user) {
        return user != null
                && (user.getRole() == User.UserRole.ADMIN || user.getRole() == User.UserRole.PHARMACIST);
    }

    /** True when the given customer id is this user's own id. */
    public static boolean owns(User user, String customerId) {
        return user != null && user.getId() != null && String.valueOf(user.getId()).equals(customerId);
    }
}