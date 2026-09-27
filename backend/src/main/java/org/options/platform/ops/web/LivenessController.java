package org.options.platform.ops.web;

import java.util.Map;
import org.springframework.boot.availability.ApplicationAvailability;
import org.springframework.boot.availability.LivenessState;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LivenessController {
  private final ApplicationAvailability availability;

  public LivenessController(ApplicationAvailability availability) {
    this.availability = availability;
  }

  @GetMapping("/api/health")
  public ResponseEntity<Map<String, String>> health() {
    boolean up = availability.getLivenessState() == LivenessState.CORRECT;
    return ResponseEntity.status(up ? 200 : 503).body(Map.of("status", up ? "UP" : "DOWN"));
  }
}
