package com.flight.flight_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

// import springfox.documentation.swagger2.annotations.EnableSwagger2;

@EnableAsync
@SpringBootApplication
// @EnableSwagger2
public class FlightBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(FlightBackendApplication.class, args);
	}

}
