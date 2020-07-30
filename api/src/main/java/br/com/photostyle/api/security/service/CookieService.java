package br.com.photostyle.api.security.service;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
public class CookieService {

    public HttpHeaders createResponseHeaders(String token, String cookieName, int maxAgeSeconds) {
        ResponseCookie cookie = ResponseCookie.from(cookieName, token)
                .maxAge(maxAgeSeconds)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .build();

        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.add(HttpHeaders.SET_COOKIE, cookie.toString());
        return responseHeaders;
    }

}
