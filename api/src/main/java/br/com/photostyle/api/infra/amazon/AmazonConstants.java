package br.com.photostyle.api.infra.amazon;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("amazon")
public class AmazonConstants {

    private String accesskey = "";
    private String bucket = "";
    private String region = "";
    private String secretkey = "";

    public String getAccesskey() {
        return accesskey;
    }

    public String getBucket() {
        return bucket;
    }

    public String getRegion() {
        return region;
    }

    public String getSecretkey() {
        return secretkey;
    }

    public void setAccesskey(String accesskey) {
        this.accesskey = accesskey;
    }

    public void setBucket(String bucket) {
        this.bucket = bucket;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public void setSecretkey(String secretkey) {
        this.secretkey = secretkey;
    }
}
