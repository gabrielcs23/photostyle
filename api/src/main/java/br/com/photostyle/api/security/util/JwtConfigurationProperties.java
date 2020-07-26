package br.com.photostyle.api.security.util;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("jwt")
public class JwtConfigurationProperties {

    private String secret = "";

    private String cookieName = "";

    private int maxage;

    protected String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    protected String getCookieName() {
        return cookieName;
    }

    public void setCookieName(String cookieName) {
        this.cookieName = cookieName;
    }

    protected int getMaxage() {
        return maxage;
    }

    public void setMaxage(int maxage) {
        this.maxage = maxage;
    }
}
