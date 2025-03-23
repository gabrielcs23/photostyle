package br.com.photostyle.api;

import br.com.photostyle.api.email.config.EmailConfigurationProperties;
import br.com.photostyle.api.infra.amazon.AmazonConstants;
import br.com.photostyle.api.security.util.JwtConfigurationProperties;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
@EnableConfigurationProperties(
		{AmazonConstants.class, JwtConfigurationProperties.class, EmailConfigurationProperties.class})
public class ApiApplication {

	@Value("${jwt.maxage}")
	private int MAX_AGE_MILLI;

	public static void main(String[] args) {
		SpringApplication.run(ApiApplication.class, args);
	}

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**")
						.allowedOrigins("*")
						.allowedMethods("GET", "POST", "PATCH", "DELETE")
						.allowedHeaders("*")
						.allowCredentials(true)
						.maxAge(MAX_AGE_MILLI/1000);
			}
		};
	}

}
