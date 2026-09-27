package org.options.platform.catalog.api;

import java.math.BigDecimal;
import java.util.List;

/** Closed P05 public DTOs. Regenerate with scripts/generate-public-dtos.py, then format. */
public final class PublicDtos {
  private PublicDtos() {}

  @io.swagger.v3.oas.annotations.media.Schema(
      additionalProperties =
          io.swagger.v3.oas.annotations.media.Schema.AdditionalPropertiesValue.FALSE)
  public record RuleNotice(
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String ruleId,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String status,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String reviewDueAt,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Boolean currentOperationalEligible) {}

  @io.swagger.v3.oas.annotations.media.Schema(
      additionalProperties =
          io.swagger.v3.oas.annotations.media.Schema.AdditionalPropertiesValue.FALSE)
  public record ContentVersion(
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String publicationId,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String generation,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String asOf,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String schemaVersion) {}

  @io.swagger.v3.oas.annotations.media.Schema(
      additionalProperties =
          io.swagger.v3.oas.annotations.media.Schema.AdditionalPropertiesValue.FALSE)
  public record Hours(
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          BigDecimal min,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          BigDecimal max,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String basis) {}

  @io.swagger.v3.oas.annotations.media.Schema(
      additionalProperties =
          io.swagger.v3.oas.annotations.media.Schema.AdditionalPropertiesValue.FALSE)
  public record Reference(
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String id,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String kind,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String title,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String revision,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String availability,
      @com.fasterxml.jackson.annotation.JsonInclude(
              com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL)
          Integer ordinal,
      String reason) {}

  @io.swagger.v3.oas.annotations.media.Schema(
      additionalProperties =
          io.swagger.v3.oas.annotations.media.Schema.AdditionalPropertiesValue.FALSE)
  public record Prerequisite(
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Reference target,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String strength,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String rationale) {}

  @io.swagger.v3.oas.annotations.media.Schema(
      additionalProperties =
          io.swagger.v3.oas.annotations.media.Schema.AdditionalPropertiesValue.FALSE)
  public record Assignment(
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String id,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Reference resource,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<String> topicIds,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<String> competencyIds,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String scope,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String purpose,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String status,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String verificationScope) {}

  @io.swagger.v3.oas.annotations.media.Schema(
      additionalProperties =
          io.swagger.v3.oas.annotations.media.Schema.AdditionalPropertiesValue.FALSE)
  public record Freshness(
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String linkCheckedAt,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String linkStatus,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String substantiveVerifiedOn,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String verificationScope,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String reviewDueAt,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String status,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Boolean currentOperationalEligible) {}

  @io.swagger.v3.oas.annotations.media.Schema(
      additionalProperties =
          io.swagger.v3.oas.annotations.media.Schema.AdditionalPropertiesValue.FALSE)
  public record Card(
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String id,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String kind,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String revision,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String title,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String canonicalPath,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String visibility,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String readiness,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String summary,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String difficulty,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String priority,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<String> tags,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Hours hours,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          ContentVersion contentVersion,
      List<RuleNotice> ruleNotices) {}

  @io.swagger.v3.oas.annotations.media.Schema(
      additionalProperties =
          io.swagger.v3.oas.annotations.media.Schema.AdditionalPropertiesValue.FALSE)
  public record CatalogPage(
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<Card> items,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Integer limit,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          ContentVersion contentVersion,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String nextCursor) {}

  @io.swagger.v3.oas.annotations.media.Schema(
      additionalProperties =
          io.swagger.v3.oas.annotations.media.Schema.AdditionalPropertiesValue.FALSE)
  public record Program(
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String id,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String kind,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String revision,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String title,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String canonicalPath,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String visibility,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String readiness,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String summary,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String difficulty,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String priority,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<String> tags,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Hours hours,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          ContentVersion contentVersion,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<Reference> phases,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String qualification,
      List<RuleNotice> ruleNotices) {}

  @io.swagger.v3.oas.annotations.media.Schema(
      additionalProperties =
          io.swagger.v3.oas.annotations.media.Schema.AdditionalPropertiesValue.FALSE)
  public record Phase(
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String id,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String kind,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String revision,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String title,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String canonicalPath,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String visibility,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String readiness,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String summary,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String difficulty,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String priority,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<String> tags,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Hours hours,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          ContentVersion contentVersion,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Reference program,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<Reference> modules,
      List<RuleNotice> ruleNotices) {}

  @io.swagger.v3.oas.annotations.media.Schema(
      additionalProperties =
          io.swagger.v3.oas.annotations.media.Schema.AdditionalPropertiesValue.FALSE)
  public record Module(
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String id,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String kind,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String revision,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String title,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String canonicalPath,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String visibility,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String readiness,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String summary,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String difficulty,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String priority,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<String> tags,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Hours hours,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          ContentVersion contentVersion,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<String> objectives,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<Prerequisite> prerequisites,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<Reference> competencies,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<Reference> topics,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<Assignment> assignments,
      List<RuleNotice> ruleNotices) {}

  @io.swagger.v3.oas.annotations.media.Schema(
      additionalProperties =
          io.swagger.v3.oas.annotations.media.Schema.AdditionalPropertiesValue.FALSE)
  public record Topic(
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String id,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String kind,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String revision,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String title,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String canonicalPath,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String visibility,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String readiness,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String summary,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String difficulty,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String priority,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<String> tags,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Hours hours,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          ContentVersion contentVersion,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String scopeOutline,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String lessonMarkdown,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String formatVersion,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<Reference> subtopics,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<Reference> exercises,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<Assignment> assignments,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<Prerequisite> prerequisites,
      List<RuleNotice> ruleNotices) {}

  @io.swagger.v3.oas.annotations.media.Schema(
      additionalProperties =
          io.swagger.v3.oas.annotations.media.Schema.AdditionalPropertiesValue.FALSE)
  public record Subtopic(
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String id,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String kind,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String revision,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String title,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String canonicalPath,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String visibility,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String readiness,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String summary,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String difficulty,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String priority,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<String> tags,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Hours hours,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          ContentVersion contentVersion,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Reference topic,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String scopeOutline,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String lessonMarkdown,
      List<RuleNotice> ruleNotices) {}

  @io.swagger.v3.oas.annotations.media.Schema(
      additionalProperties =
          io.swagger.v3.oas.annotations.media.Schema.AdditionalPropertiesValue.FALSE)
  public record Resource(
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String id,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String kind,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String revision,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String title,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String canonicalPath,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String visibility,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String readiness,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String summary,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String difficulty,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String priority,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<String> tags,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Hours hours,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          ContentVersion contentVersion,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String authorOrganization,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String url,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String resourceType,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String cost,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String accessLimitations,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String rationale,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String geography,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String publicationDate,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String datePrecision,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String rights,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Freshness freshness,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<Assignment> assignments,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<String> alternativeIds,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String verificationStatus,
      List<RuleNotice> ruleNotices) {}

  @io.swagger.v3.oas.annotations.media.Schema(
      additionalProperties =
          io.swagger.v3.oas.annotations.media.Schema.AdditionalPropertiesValue.FALSE)
  public record Path(
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String id,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String kind,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String revision,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String title,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String canonicalPath,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String visibility,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String readiness,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String summary,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String difficulty,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String priority,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<String> tags,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Hours hours,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          ContentVersion contentVersion,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String audience,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String entryCriteria,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<Reference> modules,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<Reference> topics,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<Reference> gates,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<Reference> projects,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<Reference> exitCompetencies,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Boolean enrollmentAvailable,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String unavailableReason,
      List<RuleNotice> ruleNotices) {}

  @io.swagger.v3.oas.annotations.media.Schema(
      additionalProperties =
          io.swagger.v3.oas.annotations.media.Schema.AdditionalPropertiesValue.FALSE)
  public record Project(
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String id,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String kind,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String revision,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String title,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String canonicalPath,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String visibility,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String readiness,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String summary,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String difficulty,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String priority,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<String> tags,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Hours hours,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          ContentVersion contentVersion,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String objective,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<Prerequisite> prerequisites,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String dataPlan,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String deliverables,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<String> assessmentCriteria,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Boolean selfReviewAvailable,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<ProjectField> fields,
      List<RuleNotice> ruleNotices) {}

  @io.swagger.v3.oas.annotations.media.Schema(
      additionalProperties =
          io.swagger.v3.oas.annotations.media.Schema.AdditionalPropertiesValue.FALSE)
  public record ProjectField(
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String key,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String type,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String label,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Boolean required,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String unit,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          BigDecimal maxScore) {}

  @io.swagger.v3.oas.annotations.media.Schema(
      additionalProperties =
          io.swagger.v3.oas.annotations.media.Schema.AdditionalPropertiesValue.FALSE)
  public record Capstone(
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String id,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String kind,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String revision,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String title,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String canonicalPath,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String visibility,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String readiness,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String summary,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String difficulty,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String priority,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<String> tags,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Hours hours,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          ContentVersion contentVersion,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<Prerequisite> prerequisites,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String brief,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<String> projectIds,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String assessmentPolicyId,
      List<RuleNotice> ruleNotices) {}

  @io.swagger.v3.oas.annotations.media.Schema(
      additionalProperties =
          io.swagger.v3.oas.annotations.media.Schema.AdditionalPropertiesValue.FALSE)
  public record Exercise(
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String id,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String kind,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String revision,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String title,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String canonicalPath,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String visibility,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String readiness,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String summary,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String difficulty,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String priority,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<String> tags,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Hours hours,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          ContentVersion contentVersion,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String prompt,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String exerciseType,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<String> topicIds,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String responseUnit,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String roundingInstructions,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Boolean practiceAvailable,
      List<RuleNotice> ruleNotices) {}

  @io.swagger.v3.oas.annotations.media.Schema(
      additionalProperties =
          io.swagger.v3.oas.annotations.media.Schema.AdditionalPropertiesValue.FALSE)
  public record Quiz(
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String id,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String kind,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String revision,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String title,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String canonicalPath,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String visibility,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String readiness,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String summary,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String difficulty,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String priority,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<String> tags,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Hours hours,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          ContentVersion contentVersion,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String purpose,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Integer itemCount,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          BigDecimal passScore,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Boolean criticalChecksRequired,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Integer freshForms,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Boolean attemptAvailable,
      List<RuleNotice> ruleNotices) {}

  @io.swagger.v3.oas.annotations.media.Schema(
      additionalProperties =
          io.swagger.v3.oas.annotations.media.Schema.AdditionalPropertiesValue.FALSE)
  public record SearchHit(
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String id,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String kind,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String revision,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String title,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String canonicalPath,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String visibility,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String readiness,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String summary,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String difficulty,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String priority,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<String> tags,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Hours hours,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          ContentVersion contentVersion,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String snippet,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String match,
      List<RuleNotice> ruleNotices) {}

  @io.swagger.v3.oas.annotations.media.Schema(
      additionalProperties =
          io.swagger.v3.oas.annotations.media.Schema.AdditionalPropertiesValue.FALSE)
  public record SearchPage(
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<SearchHit> items,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Integer limit,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          ContentVersion contentVersion,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Integer page,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Integer total,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Boolean hasMore) {}

  @io.swagger.v3.oas.annotations.media.Schema(
      additionalProperties =
          io.swagger.v3.oas.annotations.media.Schema.AdditionalPropertiesValue.FALSE)
  public record Facet(
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String value,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String label,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          Integer count) {}

  @io.swagger.v3.oas.annotations.media.Schema(
      additionalProperties =
          io.swagger.v3.oas.annotations.media.Schema.AdditionalPropertiesValue.FALSE)
  public record DiscoveryFacets(
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<Facet> difficulty,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<Facet> resourceType,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<Facet> cost,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<Facet> priority,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<Facet> tag,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<Facet> source,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          ContentVersion contentVersion,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<Facet> geography,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<Facet> verificationStatus,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<Facet> readiness,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<Facet> visibility,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<Facet> module) {}

  @io.swagger.v3.oas.annotations.media.Schema(
      additionalProperties =
          io.swagger.v3.oas.annotations.media.Schema.AdditionalPropertiesValue.FALSE)
  public record RouteResolution(
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String id,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String canonicalPath,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          String status,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          List<String> successorIds,
      @io.swagger.v3.oas.annotations.media.Schema(
              requiredMode = io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED)
          ContentVersion contentVersion) {}
}
