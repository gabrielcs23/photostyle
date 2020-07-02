package br.com.photostyle.api.infra.amazon;

import com.amazonaws.ClientConfiguration;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AmazonConfiguration {

    @Autowired
    private AmazonConstants constants;

    @Bean
    public BasicAWSCredentials basicAWSCredentials() {
        return new BasicAWSCredentials(constants.getAccesskey(), constants.getSecretkey());
    }

    @Bean
    public AmazonS3 amazonClient() {
        return AmazonS3ClientBuilder.standard().withRegion(constants.getRegion())
                .withClientConfiguration(new ClientConfiguration().withMaxErrorRetry(3))
                .withCredentials(new AWSStaticCredentialsProvider(basicAWSCredentials()))
                .build();
    }

}
