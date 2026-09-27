FROM library/eclipse-temurin:26.0.2_10-jre@sha256:3c3133e536beae571d43cc3611a9e9aaeb5e8d035f6da83557817ccc77cc5ab8
WORKDIR /app
COPY target/learning-platform-0.1.0-SNAPSHOT.jar app.jar
USER 10001:10001
ENV SERVER_ADDRESS=0.0.0.0
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=50", "-jar", "/app/app.jar"]
