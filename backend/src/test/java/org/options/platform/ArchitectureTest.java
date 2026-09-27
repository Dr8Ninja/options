package org.options.platform;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;
import static com.tngtech.archunit.library.dependencies.SlicesRuleDefinition.slices;

import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

class ArchitectureTest {
  @Test
  void enforceDomainDirections() {
    var classes =
        new ClassFileImporter()
            .withImportOption(new ImportOption.DoNotIncludeTests())
            .importPackages("org.options.platform");
    slices().matching("org.options.platform.(*)..").should().beFreeOfCycles().check(classes);
    noClasses()
        .that()
        .resideInAPackage("..ops..")
        .should()
        .dependOnClassesThat()
        .resideInAnyPackage(
            "..identity..",
            "..catalog..",
            "..discovery..",
            "..learning..",
            "..assessment..",
            "..administration..",
            "..flow..")
        .check(classes);
    String[][] allowed = {
      {"catalog", "ops"},
      {"discovery", "catalog", "ops"},
      {"identity", "ops"},
      {"learning", "catalog", "identity", "assessment", "ops"},
      {"assessment", "catalog", "identity", "ops"},
      {"administration", "catalog", "identity", "assessment", "learning", "ops"},
      {"flow", "catalog", "identity", "assessment", "learning", "ops"}
    };
    String[] domains = {
      "catalog", "discovery", "identity", "learning", "assessment", "administration", "flow", "ops"
    };
    for (var rule : allowed)
      for (var target : domains)
        if (!java.util.Arrays.asList(rule).contains(target))
          noClasses()
              .that()
              .resideInAPackage(".." + rule[0] + "..")
              .should()
              .dependOnClassesThat()
              .resideInAPackage(".." + target + "..")
              .allowEmptyShould(true)
              .check(classes);
    noClasses()
        .that()
        .resideInAPackage("..web..")
        .should()
        .dependOnClassesThat()
        .resideInAPackage("..repository..")
        .allowEmptyShould(true)
        .check(classes);
    noClasses()
        .that()
        .resideInAPackage("..flow..")
        .should()
        .dependOnClassesThat()
        .resideInAPackage("..repository..")
        .allowEmptyShould(true)
        .check(classes);
  }
}
