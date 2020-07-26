package br.com.photostyle.api.security.controller;

import br.com.photostyle.api.security.model.http.AuthenticationRequest;
import br.com.photostyle.api.security.service.CookieService;
import br.com.photostyle.api.security.service.UserDetailsImplService;
import br.com.photostyle.api.security.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthenticationController {

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private UserDetailsImplService userDetailsService;

    @Autowired
    private JwtUtil jwtTokenUtil;

    @Autowired
    private CookieService cookieService;

    @GetMapping("/hello")
    public String hello() {
        return "Hello World";
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> createAuthenticationToken(
            @RequestBody AuthenticationRequest authRequest) {
        final UserDetails userDetails;
        try {
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );
            userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário ou senha incorreto(s)");
        }

        final String jwt = jwtTokenUtil.generateToken(userDetails);

        HttpHeaders responseHeaders = cookieService.createResponseHeaders(jwt, jwtTokenUtil.getCookieName(),
                jwtTokenUtil.getMaxAgeSeconds());

        return ResponseEntity.ok().headers(responseHeaders).build();
    }

}
