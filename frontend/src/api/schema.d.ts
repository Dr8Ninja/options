// Generated from OpenAPI 1.0.2; SHA-256 6e104fbbc5e6befb23985a244ba605f03426cdb009294647062f05ffc483048b
export interface paths {
    "/content-version": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getContentVersion
         * @description See API.md and the operation authorization policy. Implemented in P10 against approved PostgreSQL publication snapshots; before initial publication returns 503. Persistent P09 imports remain drafts.
         */
        get: operations["getContentVersion"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/programs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * listPrograms
         * @description See API.md and the operation authorization policy. Implemented in P10 against approved PostgreSQL publication snapshots; before initial publication returns 503. Persistent P09 imports remain drafts.
         */
        get: operations["listPrograms"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/programs/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getProgram
         * @description See API.md and the operation authorization policy. Implemented in P10 against approved PostgreSQL publication snapshots; before initial publication returns 503. Persistent P09 imports remain drafts.
         */
        get: operations["getProgram"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/phases": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * listPhases
         * @description See API.md and the operation authorization policy. Implemented in P10 against approved PostgreSQL publication snapshots; before initial publication returns 503. Persistent P09 imports remain drafts.
         */
        get: operations["listPhases"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/phases/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getPhase
         * @description See API.md and the operation authorization policy. Implemented in P10 against approved PostgreSQL publication snapshots; before initial publication returns 503. Persistent P09 imports remain drafts.
         */
        get: operations["getPhase"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/modules": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * listModules
         * @description See API.md and the operation authorization policy. Implemented in P10 against approved PostgreSQL publication snapshots; before initial publication returns 503. Persistent P09 imports remain drafts.
         */
        get: operations["listModules"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/modules/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getModule
         * @description See API.md and the operation authorization policy. Implemented in P10 against approved PostgreSQL publication snapshots; before initial publication returns 503. Persistent P09 imports remain drafts.
         */
        get: operations["getModule"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/topics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * listTopics
         * @description See API.md and the operation authorization policy. Implemented in P10 against approved PostgreSQL publication snapshots; before initial publication returns 503. Persistent P09 imports remain drafts.
         */
        get: operations["listTopics"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/topics/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getTopic
         * @description See API.md and the operation authorization policy. Implemented in P10 against approved PostgreSQL publication snapshots; before initial publication returns 503. Persistent P09 imports remain drafts.
         */
        get: operations["getTopic"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/resources": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * listResources
         * @description See API.md and the operation authorization policy. Implemented in P10 against approved PostgreSQL publication snapshots; before initial publication returns 503. Persistent P09 imports remain drafts.
         */
        get: operations["listResources"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/resources/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getResource
         * @description See API.md and the operation authorization policy. Implemented in P10 against approved PostgreSQL publication snapshots; before initial publication returns 503. Persistent P09 imports remain drafts.
         */
        get: operations["getResource"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/paths": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * listPaths
         * @description See API.md and the operation authorization policy. Implemented in P10 against approved PostgreSQL publication snapshots; before initial publication returns 503. Persistent P09 imports remain drafts.
         */
        get: operations["listPaths"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/paths/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getPath
         * @description See API.md and the operation authorization policy. Implemented in P10 against approved PostgreSQL publication snapshots; before initial publication returns 503. Persistent P09 imports remain drafts.
         */
        get: operations["getPath"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/projects": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * listProjects
         * @description See API.md and the operation authorization policy. Implemented in P10 against approved PostgreSQL publication snapshots; before initial publication returns 503. Persistent P09 imports remain drafts.
         */
        get: operations["listProjects"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/projects/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getProject
         * @description See API.md and the operation authorization policy. Implemented in P10 against approved PostgreSQL publication snapshots; before initial publication returns 503. Persistent P09 imports remain drafts.
         */
        get: operations["getProject"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/subtopics/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getSubtopic
         * @description See API.md and the operation authorization policy. Implemented in P10 against approved PostgreSQL publication snapshots; before initial publication returns 503. Persistent P09 imports remain drafts.
         */
        get: operations["getSubtopic"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/exercises/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getExercise
         * @description See API.md and the operation authorization policy. Implemented in P10 against approved PostgreSQL publication snapshots; before initial publication returns 503. Persistent P09 imports remain drafts.
         */
        get: operations["getExercise"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/quizzes/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getQuiz
         * @description See API.md and the operation authorization policy. Implemented in P10 against approved PostgreSQL publication snapshots; before initial publication returns 503. Persistent P09 imports remain drafts.
         */
        get: operations["getQuiz"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/search": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * searchCatalog
         * @description See API.md and the operation authorization policy. Implemented in P10 against approved PostgreSQL publication snapshots; before initial publication returns 503. Persistent P09 imports remain drafts.
         */
        get: operations["searchCatalog"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/discovery-facets": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getDiscoveryFacets
         * @description See API.md and the operation authorization policy. Implemented in P10 against approved PostgreSQL publication snapshots; before initial publication returns 503. Persistent P09 imports remain drafts.
         */
        get: operations["getDiscoveryFacets"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/routes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * resolveRoute
         * @description See API.md and the operation authorization policy. Implemented in P10 against approved PostgreSQL publication snapshots; before initial publication returns 503. Persistent P09 imports remain drafts.
         */
        get: operations["resolveRoute"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/exercises/{id}/evaluate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * evaluateTransientPractice
         * @description Transient public practice; CSRF pre-session required, no learner record; never gate evidence.
         */
        post: operations["evaluateTransientPractice"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/exercises/{id}/solution": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * solutionTransientPractice
         * @description Transient public practice; CSRF pre-session required, no learner record; never gate evidence.
         */
        post: operations["solutionTransientPractice"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/csrf": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getCsrf
         * @description See API.md and the operation authorization policy.
         */
        get: operations["getCsrf"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/session": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getSession
         * @description See API.md and the operation authorization policy.
         */
        get: operations["getSession"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * register
         * @description Generic acknowledgment where applicable; no token is consumed on GET.
         */
        post: operations["register"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/verification-requests": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * requestVerification
         * @description Generic acknowledgment where applicable; no token is consumed on GET.
         */
        post: operations["requestVerification"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/verification-confirmations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * confirmVerification
         * @description Generic acknowledgment where applicable; no token is consumed on GET.
         */
        post: operations["confirmVerification"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/password-reset-requests": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * requestPasswordReset
         * @description Generic acknowledgment where applicable; no token is consumed on GET.
         */
        post: operations["requestPasswordReset"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/password-reset-confirmations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * confirmPasswordReset
         * @description Generic acknowledgment where applicable; no token is consumed on GET.
         */
        post: operations["confirmPasswordReset"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * login
         * @description Generic acknowledgment where applicable; no token is consumed on GET.
         */
        post: operations["login"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/email-change-confirmations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * confirmEmailChange
         * @description Generic acknowledgment where applicable; no token is consumed on GET.
         */
        post: operations["confirmEmailChange"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * logout
         * @description See API.md and the operation authorization policy.
         */
        post: operations["logout"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/logout-all": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * logoutAll
         * @description See API.md and the operation authorization policy.
         */
        post: operations["logoutAll"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/reauthentication": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * reauthenticate
         * @description See API.md and the operation authorization policy.
         */
        post: operations["reauthenticate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/webauthn/assertion-options": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Assertionoptions
         * @description See API.md and the operation authorization policy.
         */
        post: operations["Assertionoptions"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/webauthn/assertions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Assertions
         * @description See API.md and the operation authorization policy.
         */
        post: operations["Assertions"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getProfile
         * @description See API.md and the operation authorization policy.
         */
        get: operations["getProfile"];
        /**
         * replaceProfile
         * @description See API.md and the operation authorization policy.
         */
        put: operations["replaceProfile"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * changePassword
         * @description See API.md and the operation authorization policy.
         */
        post: operations["changePassword"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/email-change": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * requestEmailChange
         * @description See API.md and the operation authorization policy.
         */
        post: operations["requestEmailChange"];
        /**
         * cancelEmailChange
         * @description See API.md and the operation authorization policy.
         */
        delete: operations["cancelEmailChange"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/webauthn/credentials": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * listCredentials
         * @description See API.md and the operation authorization policy.
         */
        get: operations["listCredentials"];
        put?: never;
        /**
         * registerCredential
         * @description See API.md and the operation authorization policy.
         */
        post: operations["registerCredential"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/webauthn/registration-options": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * beginCredentialRegistration
         * @description See API.md and the operation authorization policy.
         */
        post: operations["beginCredentialRegistration"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/webauthn/credentials/{credentialId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * revokeCredential
         * @description See API.md and the operation authorization policy.
         */
        delete: operations["revokeCredential"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/exports": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * requestOwnerExport
         * @description See API.md and the operation authorization policy.
         */
        post: operations["requestOwnerExport"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/exports/{requestId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getOwnerExportStatus
         * @description See API.md and the operation authorization policy.
         */
        get: operations["getOwnerExportStatus"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/exports/{requestId}/download": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * downloadOwnerExport
         * @description See API.md and the operation authorization policy.
         */
        get: operations["downloadOwnerExport"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/deletion": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * deleteAccount
         * @description See API.md and the operation authorization policy.
         */
        post: operations["deleteAccount"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/dashboard": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getDashboard
         * @description See API.md and the operation authorization policy.
         */
        get: operations["getDashboard"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/enrollments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * listEnrollments
         * @description See API.md and the operation authorization policy.
         */
        get: operations["listEnrollments"];
        put?: never;
        /**
         * createEnrollment
         * @description See API.md and the operation authorization policy.
         */
        post: operations["createEnrollment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/progress": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * listProgress
         * @description See API.md and the operation authorization policy.
         */
        get: operations["listProgress"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/bookmarks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * listBookmarks
         * @description See API.md and the operation authorization policy.
         */
        get: operations["listBookmarks"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/notes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * listNotes
         * @description See API.md and the operation authorization policy.
         */
        get: operations["listNotes"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/attempts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * listAttempts
         * @description See API.md and the operation authorization policy.
         */
        get: operations["listAttempts"];
        put?: never;
        /**
         * startOrResumeAttempt
         * @description See API.md and the operation authorization policy.
         */
        post: operations["startOrResumeAttempt"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/issues": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * listOwnIssues
         * @description See API.md and the operation authorization policy.
         */
        get: operations["listOwnIssues"];
        put?: never;
        /**
         * createIssue
         * @description See API.md and the operation authorization policy.
         */
        post: operations["createIssue"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/assessment-requests": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * listOwnAssessmentRequests
         * @description See API.md and the operation authorization policy.
         */
        get: operations["listOwnAssessmentRequests"];
        put?: never;
        /**
         * requestFreshAssessment
         * @description See API.md and the operation authorization policy.
         */
        post: operations["requestFreshAssessment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/project-work": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * listProjectWork
         * @description See API.md and the operation authorization policy.
         */
        get: operations["listProjectWork"];
        put?: never;
        /**
         * startProjectWork
         * @description See API.md and the operation authorization policy.
         */
        post: operations["startProjectWork"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/enrollments/{enrollmentId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getEnrollment
         * @description See API.md and the operation authorization policy.
         */
        get: operations["getEnrollment"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/enrollments/{enrollmentId}/topics/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getEnrolledLesson
         * @description Owner requirement revision only; safe historical lesson from pinned enrollment, live withdrawal overlays apply.
         */
        get: operations["getEnrolledLesson"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/enrollments/{enrollmentId}/migration-preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * previewEnrollmentMigration
         * @description See API.md and the operation authorization policy.
         */
        get: operations["previewEnrollmentMigration"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/enrollments/{enrollmentId}/migrations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * migrateEnrollment
         * @description See API.md and the operation authorization policy.
         */
        post: operations["migrateEnrollment"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/progress/{id}/revisions/{revision}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getProgress
         * @description See API.md and the operation authorization policy.
         */
        get: operations["getProgress"];
        /**
         * saveProgress
         * @description See API.md and the operation authorization policy.
         */
        put: operations["saveProgress"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/notes/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getNote
         * @description See API.md and the operation authorization policy.
         */
        get: operations["getNote"];
        /**
         * saveNote
         * @description See API.md and the operation authorization policy.
         */
        put: operations["saveNote"];
        post?: never;
        /**
         * deleteNote
         * @description See API.md and the operation authorization policy.
         */
        delete: operations["deleteNote"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/bookmarks/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * saveBookmark
         * @description See API.md and the operation authorization policy.
         */
        put: operations["saveBookmark"];
        post?: never;
        /**
         * deleteBookmark
         * @description See API.md and the operation authorization policy.
         */
        delete: operations["deleteBookmark"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/issues/{issueId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getOwnIssue
         * @description See API.md and the operation authorization policy.
         */
        get: operations["getOwnIssue"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/practice/{id}/revisions/{revision}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getPractice
         * @description See API.md and the operation authorization policy.
         */
        get: operations["getPractice"];
        /**
         * savePractice
         * @description See API.md and the operation authorization policy.
         */
        put: operations["savePractice"];
        post?: never;
        /**
         * deletePractice
         * @description See API.md and the operation authorization policy.
         */
        delete: operations["deletePractice"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/practice/{id}/revisions/{revision}/solution": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * viewSavedPracticeSolution
         * @description See API.md and the operation authorization policy.
         */
        post: operations["viewSavedPracticeSolution"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/attempts/{attemptId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getAttempt
         * @description See API.md and the operation authorization policy.
         */
        get: operations["getAttempt"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/attempts/{attemptId}/answers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /**
         * saveAttemptAnswers
         * @description See API.md and the operation authorization policy.
         */
        put: operations["saveAttemptAnswers"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/attempts/{attemptId}/submission": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * submitAttempt
         * @description See API.md and the operation authorization policy.
         */
        post: operations["submitAttempt"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/attempts/{attemptId}/abandonment": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * abandonAttempt
         * @description See API.md and the operation authorization policy.
         */
        post: operations["abandonAttempt"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/attempts/{attemptId}/result": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getAttemptResult
         * @description See API.md and the operation authorization policy.
         */
        get: operations["getAttemptResult"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/attempts/{attemptId}/remediation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * completeRemediation
         * @description See API.md and the operation authorization policy.
         */
        post: operations["completeRemediation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/assessment-requests/{requestId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getOwnAssessmentRequest
         * @description See API.md and the operation authorization policy.
         */
        get: operations["getOwnAssessmentRequest"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/project-work/{workId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getProjectWork
         * @description See API.md and the operation authorization policy.
         */
        get: operations["getProjectWork"];
        /**
         * saveProjectWork
         * @description See API.md and the operation authorization policy.
         */
        put: operations["saveProjectWork"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/project-work/{workId}/self-review": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * selfReviewProject
         * @description See API.md and the operation authorization policy.
         */
        post: operations["selfReviewProject"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/project-work/{workId}/result": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getProjectResult
         * @description See API.md and the operation authorization policy.
         */
        get: operations["getProjectResult"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/me/project-writing/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * deleteProjectWriting
         * @description Erase own writing and self-review evidence across all versions/submissions of this project. Idempotent account-locked erasure; no content deletion.
         */
        delete: operations["deleteProjectWriting"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/drafts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * listDrafts
         * @description See API.md and the operation authorization policy.
         */
        get: operations["listDrafts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/drafts/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getDraft
         * @description See API.md and the operation authorization policy.
         */
        get: operations["getDraft"];
        /**
         * saveDraft
         * @description See API.md and the operation authorization policy.
         */
        put: operations["saveDraft"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/drafts/{id}/diff": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getDraftDiff
         * @description See API.md and the operation authorization policy.
         */
        get: operations["getDraftDiff"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/drafts/{id}/review-requests": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * requestDraftReview
         * @description See API.md and the operation authorization policy.
         */
        post: operations["requestDraftReview"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/drafts/{id}/reviews": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * reviewDraft
         * @description See API.md and the operation authorization policy.
         */
        post: operations["reviewDraft"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/preview/{id}/revisions/{revision}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * previewRevision
         * @description Exact authorized draft revision, protected sections included; no public token preview, noindex/no-store.
         */
        get: operations["previewRevision"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/drafts/{id}/retirement": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * proposeRetirement
         * @description See API.md and the operation authorization policy.
         */
        post: operations["proposeRetirement"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/publications": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * stagePublication
         * @description See API.md and the operation authorization policy.
         */
        post: operations["stagePublication"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/publications/{publicationId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getPublication
         * @description See API.md and the operation authorization policy.
         */
        get: operations["getPublication"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/publications/{publicationId}/activation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * activatePublication
         * @description Revalidate candidate expected active generation and all approvals; atomic search/publication switch.
         */
        post: operations["activatePublication"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/publications/rollback": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * rollbackPublication
         * @description If-Match is current content-version ETag; create new event; preserve withdrawals and live exclusions.
         */
        post: operations["rollbackPublication"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/withdrawals": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * withdrawContent
         * @description See API.md and the operation authorization policy.
         */
        post: operations["withdrawContent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/withdrawals/{withdrawalId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getWithdrawal
         * @description See API.md and the operation authorization policy.
         */
        get: operations["getWithdrawal"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/withdrawals/{withdrawalId}/reinstatement": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * reinstateContent
         * @description See API.md and the operation authorization policy.
         */
        post: operations["reinstateContent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/imports": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * validateAndStageImport
         * @description 100 MiB zip package, allowlisted paths; canonical manifest/base hashes; drafts only.
         */
        post: operations["validateAndStageImport"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/imports/{runId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getImportRun
         * @description See API.md and the operation authorization policy.
         */
        get: operations["getImportRun"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/imports/{runId}/report": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getImportReport
         * @description See API.md and the operation authorization policy.
         */
        get: operations["getImportReport"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/imports/{runId}/revalidation": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * revalidateImport
         * @description See API.md and the operation authorization policy.
         */
        post: operations["revalidateImport"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/imports/{runId}/application": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * applyImport
         * @description See API.md and the operation authorization policy.
         */
        post: operations["applyImport"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/exports": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * requestEditorialExport
         * @description See API.md and the operation authorization policy.
         */
        post: operations["requestEditorialExport"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/exports/{jobId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getEditorialExport
         * @description See API.md and the operation authorization policy.
         */
        get: operations["getEditorialExport"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/exports/{jobId}/download": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * downloadEditorialExport
         * @description See API.md and the operation authorization policy.
         */
        get: operations["downloadEditorialExport"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/maintenance": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * listMaintenance
         * @description See API.md and the operation authorization policy.
         */
        get: operations["listMaintenance"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/issues/{issueId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getVolunteeredIssue
         * @description See API.md and the operation authorization policy.
         */
        get: operations["getVolunteeredIssue"];
        /**
         * triageIssue
         * @description See API.md and the operation authorization policy.
         */
        put: operations["triageIssue"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/assessment-requests/{requestId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getAssessmentMaintenanceRequest
         * @description See API.md and the operation authorization policy.
         */
        get: operations["getAssessmentMaintenanceRequest"];
        /**
         * resolveAssessmentMaintenanceRequest
         * @description See API.md and the operation authorization policy.
         */
        put: operations["resolveAssessmentMaintenanceRequest"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/rules/{id}/verifications": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * certifyRule
         * @description See API.md and the operation authorization policy.
         */
        post: operations["certifyRule"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/accounts/{accountId}/roles": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getAccountRoles
         * @description See API.md and the operation authorization policy.
         */
        get: operations["getAccountRoles"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/accounts/{accountId}/role-grants": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * grantRole
         * @description See API.md and the operation authorization policy.
         */
        post: operations["grantRole"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/accounts/{accountId}/roles/{role}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * revokeRole
         * @description See API.md and the operation authorization policy.
         */
        delete: operations["revokeRole"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/audit": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * listEditorialAudit
         * @description See API.md and the operation authorization policy.
         */
        get: operations["listEditorialAudit"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/admin/accounts/{accountId}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getAccountStatus
         * @description See API.md and the operation authorization policy.
         */
        get: operations["getAccountStatus"];
        /**
         * setAccountStatus
         * @description Suspend or restore an existing verified account under account lock and version check; revoke sessions/generation; never reopen DELETING, verify UNVERIFIED or bootstrap roles. No learner records returned.
         */
        put: operations["setAccountStatus"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/capstones": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * listCapstones
         * @description See API.md and the operation authorization policy. Implemented in P10 against approved PostgreSQL publication snapshots; before initial publication returns 503. Persistent P09 imports remain drafts.
         */
        get: operations["listCapstones"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/capstones/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * getCapstone
         * @description See API.md and the operation authorization policy. Implemented in P10 against approved PostgreSQL publication snapshots; before initial publication returns 503. Persistent P09 imports remain drafts.
         */
        get: operations["getCapstone"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        ContentVersion: {
            publicationId: string;
            generation: string;
            /**
             * Format: date-time
             * @description Stable commit instant of this publication generation, not request wall-clock time.
             */
            asOf: string;
            /** @constant */
            schemaVersion: "1.0.0";
        };
        FieldError: {
            field: string;
            code: string;
            message: string;
        };
        Problem: {
            type: string;
            title: string;
            status: number;
            code: string;
            message: string;
            fieldErrors: components["schemas"]["FieldError"][];
            /** Format: date-time */
            timestamp: string;
            /** Format: uuid */
            requestId: string;
            currentVersion?: string;
            retryAfterSeconds?: number;
        };
        Acknowledgment: {
            message: string;
        };
        Reference: {
            id: string;
            kind: string;
            title: string;
            revision: string | null;
            /** @enum {string} */
            availability: "MAP" | "LESSON" | "UNAVAILABLE" | "RETIRED";
            ordinal?: number;
            reason?: string | null;
        };
        Hours: {
            min: number | null;
            max: number | null;
            basis: string;
        };
        Prerequisite: {
            target: components["schemas"]["Reference"];
            /** @enum {string} */
            strength: "HARD" | "RECOMMENDED" | "OPTIONAL";
            rationale: string;
        };
        Assignment: {
            id: string;
            resource: components["schemas"]["Reference"];
            topicIds: string[];
            competencyIds: string[];
            scope: string;
            purpose: string;
            /** @enum {string} */
            status: "CANDIDATE" | "REVIEWED";
            verificationScope: string | null;
        };
        Freshness: {
            linkCheckedAt: string | null;
            /** @enum {string} */
            linkStatus: "UNKNOWN" | "REACHABLE" | "FAILED";
            substantiveVerifiedOn: string | null;
            verificationScope: string;
            reviewDueAt: string | null;
            /** @enum {string} */
            status: "UNKNOWN" | "WITHIN_REVIEW_WINDOW" | "DUE" | "CONFLICT" | "SUPERSEDED";
            currentOperationalEligible: boolean;
        };
        ProjectField: {
            key: string;
            /** @enum {string} */
            type: "TEXT" | "NUMERIC" | "SELF_RUBRIC";
            label: string;
            required: boolean;
            unit: string | null;
            maxScore: number | null;
        };
        Program: {
            id: string;
            /** @constant */
            kind: "PROGRAM";
            revision: string;
            title: string;
            canonicalPath: string;
            /** @enum {string} */
            visibility: "MAP" | "LESSON";
            /** @enum {string} */
            readiness: "scope_outline" | "teaching_brief" | "learning_design" | "project_specification" | "reviewed_lesson";
            summary: string;
            difficulty: string | null;
            priority: string | null;
            tags: string[];
            hours: components["schemas"]["Hours"];
            contentVersion: components["schemas"]["ContentVersion"];
            phases: components["schemas"]["Reference"][];
            qualification: string;
            /** @description Approved rule dependencies; operational currency is never inferred from imported metadata. */
            ruleNotices?: components["schemas"]["RuleNotice"][];
        };
        Phase: {
            id: string;
            /** @constant */
            kind: "PHASE";
            revision: string;
            title: string;
            canonicalPath: string;
            /** @enum {string} */
            visibility: "MAP" | "LESSON";
            /** @enum {string} */
            readiness: "scope_outline" | "teaching_brief" | "learning_design" | "project_specification" | "reviewed_lesson";
            summary: string;
            difficulty: string | null;
            priority: string | null;
            tags: string[];
            hours: components["schemas"]["Hours"];
            contentVersion: components["schemas"]["ContentVersion"];
            program: components["schemas"]["Reference"];
            modules: components["schemas"]["Reference"][];
            /** @description Approved rule dependencies; operational currency is never inferred from imported metadata. */
            ruleNotices?: components["schemas"]["RuleNotice"][];
        };
        Module: {
            id: string;
            /** @constant */
            kind: "MODULE";
            revision: string;
            title: string;
            canonicalPath: string;
            /** @enum {string} */
            visibility: "MAP" | "LESSON";
            /** @enum {string} */
            readiness: "scope_outline" | "teaching_brief" | "learning_design" | "project_specification" | "reviewed_lesson";
            summary: string;
            difficulty: string | null;
            priority: string | null;
            tags: string[];
            hours: components["schemas"]["Hours"];
            contentVersion: components["schemas"]["ContentVersion"];
            objectives: string[];
            prerequisites: components["schemas"]["Prerequisite"][];
            competencies: components["schemas"]["Reference"][];
            topics: components["schemas"]["Reference"][];
            assignments: components["schemas"]["Assignment"][];
            /** @description Approved rule dependencies; operational currency is never inferred from imported metadata. */
            ruleNotices?: components["schemas"]["RuleNotice"][];
        };
        Topic: {
            id: string;
            /** @constant */
            kind: "TOPIC";
            revision: string;
            title: string;
            canonicalPath: string;
            /** @enum {string} */
            visibility: "MAP" | "LESSON";
            /** @enum {string} */
            readiness: "scope_outline" | "teaching_brief" | "learning_design" | "project_specification" | "reviewed_lesson";
            summary: string;
            difficulty: string | null;
            priority: string | null;
            tags: string[];
            hours: components["schemas"]["Hours"];
            contentVersion: components["schemas"]["ContentVersion"];
            scopeOutline: string;
            lessonMarkdown: string | null;
            formatVersion: string;
            subtopics: components["schemas"]["Reference"][];
            exercises: components["schemas"]["Reference"][];
            assignments: components["schemas"]["Assignment"][];
            prerequisites: components["schemas"]["Prerequisite"][];
            /** @description Approved rule dependencies; operational currency is never inferred from imported metadata. */
            ruleNotices?: components["schemas"]["RuleNotice"][];
        } & unknown;
        Subtopic: {
            id: string;
            /** @constant */
            kind: "SUBTOPIC";
            revision: string;
            title: string;
            canonicalPath: string;
            /** @enum {string} */
            visibility: "MAP" | "LESSON";
            /** @enum {string} */
            readiness: "scope_outline" | "teaching_brief" | "learning_design" | "project_specification" | "reviewed_lesson";
            summary: string;
            difficulty: string | null;
            priority: string | null;
            tags: string[];
            hours: components["schemas"]["Hours"];
            contentVersion: components["schemas"]["ContentVersion"];
            topic: components["schemas"]["Reference"];
            scopeOutline: string;
            lessonMarkdown: string | null;
            /** @description Approved rule dependencies; operational currency is never inferred from imported metadata. */
            ruleNotices?: components["schemas"]["RuleNotice"][];
        } & unknown;
        Resource: {
            id: string;
            /** @constant */
            kind: "RESOURCE";
            revision: string;
            title: string;
            canonicalPath: string;
            /** @enum {string} */
            visibility: "MAP" | "LESSON";
            /** @enum {string} */
            readiness: "scope_outline" | "teaching_brief" | "learning_design" | "project_specification" | "reviewed_lesson";
            summary: string;
            difficulty: string | null;
            priority: string | null;
            tags: string[];
            hours: components["schemas"]["Hours"];
            contentVersion: components["schemas"]["ContentVersion"];
            authorOrganization: string;
            url: string | null;
            resourceType: string;
            /** @enum {string} */
            cost: "free" | "mixed" | "paid" | "unknown";
            accessLimitations: string;
            rationale: string;
            geography: string;
            publicationDate: string | null;
            /** @enum {string} */
            datePrecision: "YEAR" | "MONTH" | "DAY" | "UNKNOWN";
            rights: string;
            freshness: components["schemas"]["Freshness"];
            assignments: components["schemas"]["Assignment"][];
            alternativeIds: string[];
            /** @enum {string} */
            verificationStatus: "access_or_inherited_metadata_only" | "limited_review" | "selected_sections_reviewed";
            /** @description Approved rule dependencies; operational currency is never inferred from imported metadata. */
            ruleNotices?: components["schemas"]["RuleNotice"][];
        };
        Path: {
            id: string;
            /** @constant */
            kind: "PATH";
            revision: string;
            title: string;
            canonicalPath: string;
            /** @enum {string} */
            visibility: "MAP" | "LESSON";
            /** @enum {string} */
            readiness: "scope_outline" | "teaching_brief" | "learning_design" | "project_specification" | "reviewed_lesson";
            summary: string;
            difficulty: string | null;
            priority: string | null;
            tags: string[];
            hours: components["schemas"]["Hours"];
            contentVersion: components["schemas"]["ContentVersion"];
            audience: string;
            entryCriteria: string;
            modules: components["schemas"]["Reference"][];
            topics: components["schemas"]["Reference"][];
            gates: components["schemas"]["Reference"][];
            projects: components["schemas"]["Reference"][];
            exitCompetencies: components["schemas"]["Reference"][];
            enrollmentAvailable: boolean;
            unavailableReason: string | null;
            /** @description Approved rule dependencies; operational currency is never inferred from imported metadata. */
            ruleNotices?: components["schemas"]["RuleNotice"][];
        };
        Project: {
            id: string;
            /** @constant */
            kind: "PROJECT";
            revision: string;
            title: string;
            canonicalPath: string;
            /** @enum {string} */
            visibility: "MAP" | "LESSON";
            /** @enum {string} */
            readiness: "scope_outline" | "teaching_brief" | "learning_design" | "project_specification" | "reviewed_lesson";
            summary: string;
            difficulty: string | null;
            priority: string | null;
            tags: string[];
            hours: components["schemas"]["Hours"];
            contentVersion: components["schemas"]["ContentVersion"];
            objective: string;
            prerequisites: components["schemas"]["Prerequisite"][];
            dataPlan: string;
            deliverables: string;
            assessmentCriteria: string[];
            selfReviewAvailable: boolean;
            fields: components["schemas"]["ProjectField"][];
            /** @description Approved rule dependencies; operational currency is never inferred from imported metadata. */
            ruleNotices?: components["schemas"]["RuleNotice"][];
        };
        Exercise: {
            id: string;
            /** @constant */
            kind: "EXERCISE";
            revision: string;
            title: string;
            canonicalPath: string;
            /** @enum {string} */
            visibility: "MAP" | "LESSON";
            /** @enum {string} */
            readiness: "scope_outline" | "teaching_brief" | "learning_design" | "project_specification" | "reviewed_lesson";
            summary: string;
            difficulty: string | null;
            priority: string | null;
            tags: string[];
            hours: components["schemas"]["Hours"];
            contentVersion: components["schemas"]["ContentVersion"];
            prompt: string | null;
            /** @enum {string} */
            exerciseType: "conceptual" | "numerical" | "practical";
            topicIds: string[];
            responseUnit: string | null;
            roundingInstructions: string | null;
            practiceAvailable: boolean;
            /** @description Approved rule dependencies; operational currency is never inferred from imported metadata. */
            ruleNotices?: components["schemas"]["RuleNotice"][];
        };
        Quiz: {
            id: string;
            /** @constant */
            kind: "QUIZ";
            revision: string;
            title: string;
            canonicalPath: string;
            /** @enum {string} */
            visibility: "MAP" | "LESSON";
            /** @enum {string} */
            readiness: "scope_outline" | "teaching_brief" | "learning_design" | "project_specification" | "reviewed_lesson";
            summary: string;
            difficulty: string | null;
            priority: string | null;
            tags: string[];
            hours: components["schemas"]["Hours"];
            contentVersion: components["schemas"]["ContentVersion"];
            /** @enum {string} */
            purpose: "GATE" | "DIAGNOSTIC";
            itemCount: number;
            passScore: number;
            criticalChecksRequired: boolean;
            freshForms: number;
            attemptAvailable: boolean;
            /** @description Approved rule dependencies; operational currency is never inferred from imported metadata. */
            ruleNotices?: components["schemas"]["RuleNotice"][];
        };
        Card: {
            id: string;
            kind: string;
            revision: string;
            title: string;
            canonicalPath: string;
            /** @enum {string} */
            visibility: "MAP" | "LESSON";
            /** @enum {string} */
            readiness: "scope_outline" | "teaching_brief" | "learning_design" | "project_specification" | "reviewed_lesson";
            summary: string;
            difficulty: string | null;
            priority: string | null;
            tags: string[];
            hours: components["schemas"]["Hours"];
            contentVersion: components["schemas"]["ContentVersion"];
            /** @description Approved rule dependencies; operational currency is never inferred from imported metadata. */
            ruleNotices?: components["schemas"]["RuleNotice"][];
        };
        SearchHit: {
            id: string;
            kind: string;
            revision: string;
            title: string;
            canonicalPath: string;
            /** @enum {string} */
            visibility: "MAP" | "LESSON";
            /** @enum {string} */
            readiness: "scope_outline" | "teaching_brief" | "learning_design" | "project_specification" | "reviewed_lesson";
            summary: string;
            difficulty: string | null;
            priority: string | null;
            tags: string[];
            hours: components["schemas"]["Hours"];
            contentVersion: components["schemas"]["ContentVersion"];
            snippet: string;
            /** @enum {string} */
            match: "EXACT_ID" | "EXACT_TITLE" | "TEXT";
            /** @description Approved rule dependencies; operational currency is never inferred from imported metadata. */
            ruleNotices?: components["schemas"]["RuleNotice"][];
        };
        CatalogPage: {
            items: components["schemas"]["Card"][];
            limit: number;
            contentVersion: components["schemas"]["ContentVersion"];
            nextCursor: string | null;
        };
        SearchPage: {
            items: components["schemas"]["SearchHit"][];
            limit: number;
            contentVersion: components["schemas"]["ContentVersion"];
            page: number;
            total: number;
            hasMore: boolean;
        };
        RouteResolution: {
            id: string;
            canonicalPath: string;
            /** @enum {string} */
            status: "CURRENT" | "RENAMED" | "RETIRED";
            successorIds: string[];
            contentVersion: components["schemas"]["ContentVersion"];
        };
        Facet: {
            value: string;
            label: string;
            count: number;
        };
        DiscoveryFacets: {
            difficulty: components["schemas"]["Facet"][];
            resourceType: components["schemas"]["Facet"][];
            cost: components["schemas"]["Facet"][];
            priority: components["schemas"]["Facet"][];
            tag: components["schemas"]["Facet"][];
            source: components["schemas"]["Facet"][];
            contentVersion: components["schemas"]["ContentVersion"];
            geography: components["schemas"]["Facet"][];
            verificationStatus: components["schemas"]["Facet"][];
            readiness: components["schemas"]["Facet"][];
            visibility: components["schemas"]["Facet"][];
            module: components["schemas"]["Facet"][];
        };
        RegisterInput: {
            /** Format: email */
            email: string;
            password: string;
            displayName?: string | null;
            /** @constant */
            eligibilityAttested: true;
        };
        EmailInput: {
            /** Format: email */
            email: string;
        };
        LoginInput: {
            /** Format: email */
            email: string;
            password: string;
        };
        PasswordInput: {
            password: string;
        };
        TokenInput: {
            token: string;
        };
        ResetInput: {
            token: string;
            newPassword: string;
        };
        ChangePasswordInput: {
            newPassword: string;
        };
        Csrf: {
            /** @constant */
            headerName: "X-CSRF-TOKEN";
            token: string;
        };
        Session: {
            authenticated: boolean;
            accountId: string | null;
            /** @enum {string} */
            state: "ANONYMOUS" | "UNVERIFIED" | "ACTIVE" | "MFA_REQUIRED";
            roles: ("LEARNER" | "EDITOR" | "REVIEWER_PUBLISHER" | "ADMIN")[];
            passwordAuthenticatedAt: string | null;
            webauthnAuthenticatedAt: string | null;
            idleExpiresAt: string | null;
            absoluteExpiresAt: string | null;
        };
        Profile: {
            /** Format: uuid */
            accountId: string;
            /** Format: email */
            email: string;
            displayName: string | null;
            /** @enum {string} */
            theme: "system" | "light" | "dark";
            interestPathId: string | null;
            verified: boolean;
            version: string;
        };
        ProfileInput: {
            displayName: string | null;
            /** @enum {string} */
            theme: "system" | "light" | "dark";
            interestPathId: string | null;
        };
        CredentialDescriptor: {
            /** @constant */
            type: "public-key";
            id: string;
            transports: ("usb" | "nfc" | "ble" | "internal" | "hybrid")[];
        };
        AssertionOptions: {
            challenge: string;
            /** @constant */
            timeout: 300000;
            rpId: string;
            allowCredentials: components["schemas"]["CredentialDescriptor"][];
            /** @constant */
            userVerification: "required";
        };
        RegistrationOptions: {
            challenge: string;
            rp: {
                id: string;
                name: string;
            };
            user: {
                id: string;
                name: string;
                displayName: string;
            };
            pubKeyCredParams: {
                /** @constant */
                type: "public-key";
                alg: number;
            }[];
            /** @constant */
            timeout: 300000;
            excludeCredentials: components["schemas"]["CredentialDescriptor"][];
            authenticatorSelection: {
                /** @enum {string} */
                residentKey: "preferred";
                /** @constant */
                userVerification: "required";
            };
            /** @constant */
            attestation: "none";
        };
        AssertionInput: {
            id: string;
            rawId: string;
            /** @constant */
            type: "public-key";
            response: {
                clientDataJSON: string;
                authenticatorData: string;
                signature: string;
                userHandle: string | null;
            };
            clientExtensionResults: Record<string, never>;
        };
        RegistrationInput: {
            id: string;
            rawId: string;
            /** @constant */
            type: "public-key";
            label: string;
            response: {
                clientDataJSON: string;
                attestationObject: string;
                transports: ("usb" | "nfc" | "ble" | "internal" | "hybrid")[];
            };
            clientExtensionResults: Record<string, never>;
        };
        Credential: {
            /** Format: uuid */
            credentialId: string;
            label: string;
            /** Format: date-time */
            createdAt: string;
            backupEligible: boolean;
        };
        Credentials: {
            items: components["schemas"]["Credential"][];
        };
        EnrollmentInput: {
            pathId: string;
            pathRevision: string;
        };
        Requirement: {
            target: components["schemas"]["Reference"];
            required: boolean;
            /** @enum {string} */
            state: "MISSING" | "SELF_COMPLETED" | "PASSED" | "SELF_REVIEWED" | "BLOCKED" | "NEEDS_RECHECK";
        };
        Enrollment: {
            /** Format: uuid */
            id: string;
            pathId: string;
            pathRevision: string;
            publicationId: string;
            /** @enum {string} */
            state: "CURRENT" | "COMPLETED" | "SUPERSEDED" | "BLOCKED";
            requirements: components["schemas"]["Requirement"][];
            version: string;
        };
        MigrationInput: {
            targetPathRevision: string;
        };
        MigrationPreview: {
            from: string;
            to: string;
            addedIds: string[];
            removedIds: string[];
            equivalentIds: string[];
            recheckIds: string[];
            eligible: boolean;
        };
        NextStep: {
            /** @enum {string} */
            reason: "CRITICAL_REMEDIATION" | "MISSING_PREREQUISITE" | "NEXT_LESSON" | "ELIGIBLE_ASSESSMENT" | "COURSE_COMPLETE" | "NO_ENROLLMENT" | "BLOCKED";
            target: components["schemas"]["Reference"] | null;
            explanation: string;
        };
        Dashboard: {
            enrollments: components["schemas"]["Enrollment"][];
            selfCompletedTopics: number;
            requiredTopics: number;
            passedGates: number;
            requiredGates: number;
            projectSelfReviewed: boolean;
            needsRecheck: boolean;
            nextStep: components["schemas"]["NextStep"];
            algorithmVersion: string;
            contentVersion: components["schemas"]["ContentVersion"];
        };
        ProgressInput: {
            /** @enum {string} */
            state: "STARTED" | "SELF_COMPLETED" | "REOPENED";
        };
        Progress: {
            topicId: string;
            topicRevision: string;
            /** @enum {string} */
            state: "STARTED" | "SELF_COMPLETED" | "REOPENED";
            /** Format: date-time */
            confirmedAt: string;
            version: string;
        };
        Bookmark: {
            target: components["schemas"]["Reference"];
            /** Format: date-time */
            savedAt: string;
        };
        NoteInput: {
            text: string;
        };
        Note: {
            /** Format: uuid */
            id: string;
            objectId: string;
            text: string;
            /** Format: date-time */
            updatedAt: string;
            version: string;
        };
        IssueInput: {
            objectId: string;
            revision: string;
            message: string;
        };
        Issue: {
            /** Format: uuid */
            id: string;
            objectId: string;
            revision: string;
            message: string;
            /** @enum {string} */
            status: "OPEN" | "TRIAGED" | "RESOLVED";
            /** Format: date-time */
            createdAt: string;
            version: string;
        };
        PrivacyRequest: {
            /** Format: uuid */
            id: string;
            /** @enum {string} */
            kind: "EXPORT" | "DELETE";
            /** @enum {string} */
            state: "REQUESTED" | "RUNNING" | "READY" | "COMPLETED" | "FAILED" | "EXPIRED";
            /** Format: date-time */
            requestedAt: string;
            expiresAt: string | null;
            receiptCode: string | null;
        };
        DeleteAccountInput: {
            /** @constant */
            confirm: "DELETE_MY_ACCOUNT";
        };
        PracticeInput: {
            revision: string;
            responseText: string;
        };
        SolutionInput: {
            revision: string;
        };
        PracticeFeedback: {
            revision: string;
            /** @enum {string} */
            outcome: "CORRECT" | "INCORRECT" | "SELF_REVIEW" | "SOLUTION_VIEWED";
            feedback: string;
            solution: string | null;
            /** @constant */
            freshAssessmentEvidence: false;
        };
        PracticeRecord: {
            exerciseId: string;
            revision: string;
            responseText: string;
            solutionViewed: boolean;
            version: string;
            feedback: components["schemas"]["PracticeFeedback"] | null;
        };
        AttemptInput: {
            /** Format: uuid */
            enrollmentId: string;
            quizId: string;
            quizRevision: string;
            /** @enum {string} */
            mode: "FRESH" | "PRACTICE" | "DIAGNOSTIC";
        };
        Choice: {
            key: string;
            text: string;
        };
        Question: {
            ordinal: number;
            /** @enum {string} */
            type: "SINGLE" | "MULTI" | "NUMERIC";
            prompt: string;
            choices: components["schemas"]["Choice"][];
            unit: string | null;
            roundingInstructions: string | null;
            critical: boolean;
        };
        ChoiceAnswer: {
            ordinal: number;
            /** @constant */
            type: "CHOICE";
            choiceKeys: string[];
        };
        NumericAnswer: {
            ordinal: number;
            /** @constant */
            type: "NUMERIC";
            value: string;
            unit: string | null;
        };
        SkippedAnswer: {
            ordinal: number;
            /** @constant */
            type: "SKIPPED";
        };
        Answer: components["schemas"]["ChoiceAnswer"] | components["schemas"]["NumericAnswer"] | components["schemas"]["SkippedAnswer"];
        AnswersInput: {
            answers: components["schemas"]["Answer"][];
            confirmUnanswered: boolean;
        };
        Attempt: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            enrollmentId: string;
            quizId: string;
            quizRevision: string;
            /** @enum {string} */
            state: "STARTED" | "SUBMITTED" | "ABANDONED";
            /** @enum {string} */
            purpose: "FRESH" | "PRACTICE" | "DIAGNOSTIC";
            frozen: boolean;
            freezeReason: string | null;
            questions: components["schemas"]["Question"][];
            savedAnswers: components["schemas"]["Answer"][];
            version: string;
        };
        ItemFeedback: {
            ordinal: number;
            correct: boolean;
            criticalError: boolean;
            explanation: string;
            expectedAnswer: string;
        };
        AttemptResult: {
            /** Format: uuid */
            attemptId: string;
            quizRevision: string;
            score: number;
            passed: boolean;
            freshEvidence: boolean;
            criticalFailures: number;
            scoringVersion: string;
            needsRecheck: boolean;
            feedback: components["schemas"]["ItemFeedback"][];
            remediationTopicIds: string[];
            /** Format: date-time */
            finalizedAt: string;
            remediation: components["schemas"]["RemediationRequirement"][];
        };
        RemediationInput: {
            topicRevision: string;
            selfExplanation: string;
            transferExerciseId: string;
            transferExerciseRevision: string;
        };
        Remediation: {
            /** Format: uuid */
            failedAttemptId: string;
            topicRevision: string;
            /** Format: date-time */
            completedAt: string;
            nextFreshAttemptEligible: boolean;
        };
        AssessmentRequestInput: {
            /** Format: uuid */
            enrollmentId: string;
            quizId: string;
            quizRevision: string;
        };
        AssessmentRequest: {
            /** Format: uuid */
            id: string;
            quizId: string;
            /** @enum {string} */
            state: "OPEN" | "TRIAGED" | "RESOLVED" | "CANCELLED";
            replacementRevision: string | null;
            /** Format: date-time */
            createdAt: string;
            version: string;
        };
        ProjectResponse: {
            fieldKey: string;
            text: string | null;
            numericValue: string | null;
        };
        ProjectWorkInput: {
            projectId: string;
            projectRevision: string;
        };
        ProjectResponsesInput: {
            responses: components["schemas"]["ProjectResponse"][];
        };
        ProjectWork: {
            /** Format: uuid */
            id: string;
            projectId: string;
            projectRevision: string;
            /** @enum {string} */
            state: "DRAFT" | "SELF_REVIEWED";
            responses: components["schemas"]["ProjectResponse"][];
            version: string;
        };
        SelfReviewInput: {
            /** @constant */
            noCriticalErrorsAcknowledged: true;
        };
        ProjectResult: {
            /** Format: uuid */
            workId: string;
            score: number;
            /** @constant */
            evidenceType: "SELF_REVIEW";
            referenceSolution: string;
            feedback: string;
            /** Format: date-time */
            submittedAt: string;
        };
        EnrollmentPage: {
            items: components["schemas"]["Enrollment"][];
            nextCursor: string | null;
            limit: number;
        };
        ProgressPage: {
            items: components["schemas"]["Progress"][];
            nextCursor: string | null;
            limit: number;
        };
        BookmarkPage: {
            items: components["schemas"]["Bookmark"][];
            nextCursor: string | null;
            limit: number;
        };
        NotePage: {
            items: components["schemas"]["Note"][];
            nextCursor: string | null;
            limit: number;
        };
        AttemptPage: {
            items: components["schemas"]["Attempt"][];
            nextCursor: string | null;
            limit: number;
        };
        IssuePage: {
            items: components["schemas"]["Issue"][];
            nextCursor: string | null;
            limit: number;
        };
        AssessmentRequestPage: {
            items: components["schemas"]["AssessmentRequest"][];
            nextCursor: string | null;
            limit: number;
        };
        ProjectWorkPage: {
            items: components["schemas"]["ProjectWork"][];
            nextCursor: string | null;
            limit: number;
        };
        CanonicalArchivalStructures: {
            disposition?: string;
            id: string;
            kind: string;
            line?: number;
            markdown?: string;
            original?: {
                stage: number;
                title: string;
                modules: string[];
                gate: string;
                hours: string;
            };
            source?: string;
        };
        CanonicalAssessmentPolicies: {
            id: string;
            version: number;
            threshold: number;
            critical_errors: string[];
            states: string[];
            evidence: string;
            retry: string;
            calibration: string;
        };
        CanonicalAssociations: {
            competency_id: string;
            evidence_claim_ids: (unknown | string)[];
            id: string;
            purpose: string;
            reading_scope: string;
            resource_id: string;
            status: string;
            topic_ids: (unknown | string)[];
        };
        CanonicalAuthoringQueue: {
            id: string;
            topic_id: string;
            owner_stage: string;
            status: string;
            remaining_work: string[];
            author_review_hours: number[];
            estimate_basis: string;
        };
        CanonicalCapstones: {
            id: string;
            title: string;
            original_brief: string;
            project_ids: string[];
            assessment_policy: string;
            source: string;
            line: number;
            status: string;
        };
        CanonicalCompetencies: {
            assessment_ids: string[];
            dependency_reason: string;
            diagnostic: {
                prompt: string;
                bridge: string;
                pass: string;
            };
            hard_edge_justifications: (unknown | {
                requires: string;
                supplied_skill: string;
                consumed_by: string;
            })[];
            hard_prerequisites: (unknown | string)[];
            id: string;
            module_id: string;
            optional_enrichment: (unknown | string)[];
            outcome: string;
            recommended_preparation: (unknown | string)[];
        };
        CanonicalDecisionCards: {
            id: string;
            question: string;
            source: string;
            line: number;
            required_in_capstones: string[];
        };
        CanonicalDomains: {
            id: string;
            title: string;
        };
        CanonicalExercises: {
            id: string;
            module_id: string;
            competency_ids: string[];
            type: string;
            prompt: string;
            reference_behavior: string;
            data: string;
            deliverable: string;
            rubric: {
                correctness: number;
                units_and_assumptions: number;
                failure_analysis: number;
                communication: number;
            };
            pass_score: number;
            critical_errors: string[];
            tolerance: string;
            fresh_variant: string;
            status: string;
            noncoding_route: string;
        };
        CanonicalLearningPaths: {
            id: string;
            title: string;
            audience: string;
            entry_criteria: string;
            diagnostic_ids: string[];
            module_sequence: string[];
            target_modules: string[];
            branches: {
                module_id: string;
                rule: string;
            }[];
            exit_competencies: string[];
            exit_competency_ids: string[];
            study_hours: number[];
            estimate_basis: string;
            assessment_gates: string[];
            milestone_gates: string[];
        };
        CanonicalMarketRules: {
            circular_identifier: string;
            current_operational_publication_eligible: boolean;
            effective_from: string | null;
            effective_to: null | string;
            id: string;
            instrument: string;
            jurisdiction: string;
            publication_date: string | null;
            publication_eligible: boolean;
            publication_eligible_scope: string;
            review_interval_days: number;
            review_owner: string;
            review_status: string;
            rule_type: string;
            scope: string;
            source_url: string;
            superseded_by: unknown[];
            supersedes: (string | unknown)[];
            uncertainty: string;
            unit: string;
            unknown_date_reason: string;
            value: string | number | {
                sale_rate: number;
                exercise_rate: number;
            } | null;
            verification_date: string;
        };
        CanonicalModules: {
            checkpoint_questions: string[];
            common_mistakes: string[];
            competency_ids: string[];
            domain_id: string;
            estimate_basis: string;
            exercise_ids: string[];
            id: string;
            lesson_authoring_owner: string;
            level: string;
            mastery_criteria: string[];
            objectives: string[];
            original_provenance: {
                json_pointer?: string;
                master_line?: number;
                origin?: string;
            };
            phase_id: string;
            practical_assignment: string;
            prerequisites: {
                hard: (unknown | string)[];
                optional: (unknown | string)[];
                recommended: (unknown | string)[];
            };
            program_id: string;
            quiz_id: string;
            /** @enum {string} */
            readiness: "learning_design";
            reading_assignments: string;
            remediation: string;
            required_math: string[];
            required_programming: string;
            slug: string;
            study_hours: number[];
            tags: string[];
            title: string;
            topic_ids: string[];
            why_it_matters: string;
        };
        CanonicalPhases: {
            id: string;
            title: string;
            module_ids: string[];
        };
        CanonicalPrograms: {
            id: string;
            title: string;
            phase_ids: string[];
            qualification: string;
        };
        CanonicalProjects: {
            id: string;
            title: string;
            prerequisites: string[];
            learning_objective: string;
            data_plan: string;
            steps: string[];
            deliverables: string;
            reference_behavior: string;
            rubric: {
                cash_and_numerical_correctness: number;
                assumptions_and_data_lineage: number;
                validation_and_failure_cases: number;
                decision_and_limitations: number;
                reproducibility_accessibility: number;
            };
            pass_score: number;
            critical_failure: string;
            failure_cases: string[];
            limitations: string;
            study_hours: number[];
            estimate_basis: string;
            status: string;
            real_money_required: boolean;
            noncoding_route: string;
        };
        CanonicalQuizBlueprints: {
            id: string;
            module_id: string;
            competency_ids: string[];
            items: {
                exercise_id?: string;
                kind: string;
                question?: string;
                weight: number;
            }[];
            pass_score: number;
            critical_error_policy: string;
            retries: string;
            status: string;
        };
        CanonicalResources: {
            access_limitations: string;
            alternative_limit: string;
            author_organization: string;
            canonical_url: string;
            /** @enum {string} */
            cost: "free" | "paid" | "mixed" | "unknown";
            difficulty: string;
            doi: null | string;
            edition: null | string;
            entitlement_status: string;
            free_alternative_ids: (unknown | string)[];
            geography: string;
            id: string;
            last_verification_date: string;
            original_provenance: {
                json_pointer?: string;
                master_line?: number;
                origin?: string;
            };
            prerequisites: string;
            /** @enum {string} */
            priority: "Essential" | "Recommended" | "Advanced" | "Optional" | "Reference";
            publication_date: string | null;
            publication_status: string;
            rationale: string;
            recommended_audience: string;
            replacement_ids: unknown[];
            resource_type: string;
            rights: string;
            /** @enum {string} */
            role: "foundational" | "optional";
            /** @enum {string} */
            status: "access_or_inherited_metadata_only" | "limited_review" | "selected_sections_reviewed";
            study_hours: number[];
            supersedes_ids: unknown[];
            time_basis: string;
            title: string;
            topics_competencies: string[];
            unknowns: {
                doi?: string;
                edition?: string;
                publication_date?: string;
                updated_date?: string;
            };
            updated_date: null | string;
            verification_scope: string;
            video_timestamp_reason: string;
            video_timestamps: null;
        };
        CanonicalSourceItems: {
            disposition: string;
            id: string;
            kind: string;
            original_record: {
                access?: string;
                advanced_extension?: string;
                assessment?: {
                    exercise: string;
                    mastery: string;
                };
                category?: string;
                difficulty?: string;
                domain?: string;
                evidence?: string;
                gate?: string;
                hours?: string;
                id?: string;
                importance?: string;
                kind?: string;
                level?: string;
                module_id?: string;
                modules?: string[];
                prerequisites?: (unknown | string)[];
                provenance?: {
                    json_pointer: string;
                    master_line: number;
                };
                research_date?: string;
                scope_note?: string;
                sources?: string[];
                stage?: number;
                subtopics?: string;
                tags?: string;
                title: string;
                topic_count?: number;
                url?: string;
                used_in_modules?: string[];
                verification_status?: string;
                version?: string;
                why?: string;
            };
            pointer: string;
            source: string;
        };
        CanonicalSourceMappings: {
            canonical_ids: string[];
            disposition: string;
            id: string;
            kind: string;
            note: string;
            original_id: string;
            provenance: {
                json_pointer?: string;
                line?: number;
                master_line?: number;
                master_source?: string;
                selector?: string;
                source: string;
            };
        };
        CanonicalSpecializations: {
            id: string;
            title: string;
            original_module_scope: string;
            depth: string;
            source: string;
            line: number;
            status: string;
        };
        CanonicalSubtopics: {
            id: string;
            topic_id: string;
            title: string;
            scope: string;
            competency_ids: string[];
            readiness: string;
            granularity_note: string;
        };
        CanonicalTopics: {
            classification_code_original: string | null;
            difficulty: string;
            evidence_class_original: string;
            id: string;
            module_id: string;
            original_provenance: {
                json_pointer?: string;
                master_line?: number;
                origin?: string;
            };
            priority: string;
            /** @enum {string} */
            readiness: "scope_outline" | "teaching_brief" | "publication_ready";
            reviewed_lesson: null;
            scope_outline: string;
            subtopic_ids: string[];
            tags: string[];
            teaching_brief: null | string;
            teaching_brief_unknown_reason: string | null;
            title: string;
        };
        CanonicalRecord: components["schemas"]["CanonicalArchivalStructures"] | components["schemas"]["CanonicalAssessmentPolicies"] | components["schemas"]["CanonicalAssociations"] | components["schemas"]["CanonicalAuthoringQueue"] | components["schemas"]["CanonicalCapstones"] | components["schemas"]["CanonicalCompetencies"] | components["schemas"]["CanonicalDecisionCards"] | components["schemas"]["CanonicalDomains"] | components["schemas"]["CanonicalExercises"] | components["schemas"]["CanonicalLearningPaths"] | components["schemas"]["CanonicalMarketRules"] | components["schemas"]["CanonicalModules"] | components["schemas"]["CanonicalPhases"] | components["schemas"]["CanonicalPrograms"] | components["schemas"]["CanonicalProjects"] | components["schemas"]["CanonicalQuizBlueprints"] | components["schemas"]["CanonicalResources"] | components["schemas"]["CanonicalSourceItems"] | components["schemas"]["CanonicalSourceMappings"] | components["schemas"]["CanonicalSpecializations"] | components["schemas"]["CanonicalSubtopics"] | components["schemas"]["CanonicalTopics"];
        EditorialSection: {
            key: string;
            markdown: string;
            /** @enum {string} */
            visibility: "PUBLIC" | "PROTECTED" | "ARCHIVE";
        };
        EditorialLink: {
            relation: string;
            targetId: string;
            ordinal: number;
            rationale: string | null;
        };
        ProtectedQuestion: {
            id: string;
            /** @enum {string} */
            type: "SINGLE" | "MULTI" | "NUMERIC";
            prompt: string;
            explanation: string;
            critical: boolean;
            choices: {
                key: string;
                text: string;
                correct: boolean;
                feedback: string;
            }[];
            expectedNumeric: string | null;
            absoluteTolerance: string | null;
            relativeTolerance: string | null;
            unit: string | null;
        };
        ProtectedForm: {
            code: string;
            /** Format: uuid */
            exposureGroup: string;
            questionIds: string[];
            weights: number[];
        };
        AuthoredAssessment: {
            /** @enum {string} */
            purpose: "GATE" | "DIAGNOSTIC";
            passScore: number;
            scoringVersion: string;
            questions: components["schemas"]["ProtectedQuestion"][];
            forms: components["schemas"]["ProtectedForm"][];
        };
        /** @description Exactly the compatible canonical record and/or authored typed details for this kind; semantic id/kind matching and section/link allowlists required. No account or learner mutation. */
        EditorialBody: {
            id: string;
            /** @enum {string} */
            kind: "PROGRAM" | "PHASE" | "DOMAIN" | "MODULE" | "TOPIC" | "SUBTOPIC" | "COMPETENCY" | "RESOURCE" | "ASSIGNMENT" | "EXERCISE" | "BLUEPRINT" | "PROJECT" | "PATH" | "CAPSTONE" | "SPECIALIZATION" | "DECISION" | "POLICY" | "RULE" | "ARCHIVE" | "QUIZ" | "QUESTION";
            title: string;
            /** @enum {string} */
            readiness: "scope_outline" | "teaching_brief" | "learning_design" | "project_specification" | "reviewed_lesson";
            canonicalRecord: components["schemas"]["CanonicalRecord"] | null;
            sections: components["schemas"]["EditorialSection"][];
            links: components["schemas"]["EditorialLink"][];
            assessment: components["schemas"]["AuthoredAssessment"] | null;
            canonicalPath: string | null;
            /** @constant */
            formatVersion: "markdown-v1";
            exercise?: components["schemas"]["AuthoredExercise"] | null;
            project?: components["schemas"]["AuthoredProject"] | null;
            course?: components["schemas"]["AuthoredCourse"] | null;
            retirement?: {
                successorIds: string[];
                reason: string;
            } | null;
        };
        DraftInput: {
            baseRevision: string | null;
            body: components["schemas"]["EditorialBody"];
            reason: string;
        };
        Draft: {
            objectId: string;
            revision: string;
            version: string;
            /** @enum {string} */
            workflow: "DRAFT" | "IN_REVIEW" | "APPROVED";
            body: components["schemas"]["EditorialBody"];
        };
        Diff: {
            base: components["schemas"]["Draft"] | null;
            current: components["schemas"]["Draft"];
            proposed: components["schemas"]["Draft"] | null;
        };
        ReviewInput: {
            revision: string;
            /** @enum {string} */
            reviewType: "technical" | "pedagogy" | "assessment" | "accessibility" | "rights";
            /** @enum {string} */
            outcome: "APPROVE" | "REJECT";
            reviewedHash: string;
            findings: string;
        };
        Review: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            actorRef: string;
            sameAuthor: boolean;
            revision: string;
            /** @enum {string} */
            outcome: "APPROVE" | "REJECT";
            /** Format: date-time */
            createdAt: string;
        };
        PublicationInput: {
            expectedPublicationId: string | null;
            expectedGeneration: string;
            entries: {
                id: string;
                revision: string;
                /** @enum {string} */
                visibility: "MAP" | "LESSON" | "PROTECTED" | "ARCHIVE";
                indexable: boolean;
            }[];
            reason: string;
        };
        Publication: {
            id: string;
            /** @enum {string} */
            state: "BUILDING" | "SEALED";
            /** @description Candidate publication ID with expected generation while BUILDING; active committed version when SEALED. A staged candidate is never publicly selected. */
            contentVersion: components["schemas"]["ContentVersion"];
            version: string;
            expectedPublicationId: string | null;
            expectedGeneration: string;
            entries: {
                id: string;
                revision: string;
                /** @enum {string} */
                visibility: "MAP" | "LESSON" | "PROTECTED" | "ARCHIVE";
                indexable: boolean;
            }[];
        };
        RollbackInput: {
            targetPublicationId: string;
            reason: string;
        };
        WithdrawalInput: {
            objectId: string;
            revision: string | null;
            reasonCode: string;
            publicMessage: string;
        };
        Withdrawal: {
            /** Format: uuid */
            id: string;
            objectId: string;
            revision: string | null;
            active: boolean;
            version: string;
            contentVersion: components["schemas"]["ContentVersion"];
            /** @description Approved rule dependencies; operational currency is never inferred from imported metadata. */
            ruleNotices?: components["schemas"]["RuleNotice"][];
        };
        ReinstatementInput: {
            /** Format: uuid */
            reviewId: string;
            reason: string;
        };
        RetirementInput: {
            baseRevision: string;
            successorIds: string[];
            reason: string;
        };
        ImportRun: {
            /** Format: uuid */
            id: string;
            packageId: string;
            manifestSha256: string;
            /** @enum {string} */
            state: "VALIDATING" | "REJECTED" | "CONFLICTED" | "STAGED" | "APPLIED";
            reportVersion: string;
            counts: {
                added: number;
                changed: number;
                unchanged: number;
                conflicts: number;
                retirements: number;
            };
            version: string;
        };
        ImportDiagnostic: {
            code: string;
            sourcePointer: string;
            objectId: string | null;
            message: string;
            baseRevision: string | null;
            currentRevision: string | null;
        };
        ImportReport: {
            run: components["schemas"]["ImportRun"];
            diagnostics: components["schemas"]["ImportDiagnostic"][];
            nextCursor: string | null;
        };
        EditorialExportInput: {
            publicationId: string;
            /** @enum {string} */
            scope: "PUBLIC" | "RESTRICTED";
        };
        Job: {
            /** Format: uuid */
            id: string;
            /** @enum {string} */
            state: "READY" | "RUNNING" | "DONE" | "FAILED";
            errorCode: string | null;
            expiresAt: string | null;
        };
        IssueTriageInput: {
            /** @enum {string} */
            status: "TRIAGED" | "RESOLVED";
            reason: string;
        };
        AssessmentResolutionInput: {
            /** @enum {string} */
            state: "TRIAGED" | "RESOLVED";
            replacementRevision: string | null;
            reason: string;
        };
        RoleInput: {
            /** @enum {string} */
            role: "EDITOR" | "REVIEWER_PUBLISHER" | "ADMIN";
            reason: string;
        };
        RoleState: {
            /** Format: uuid */
            accountId: string;
            roles: ("LEARNER" | "EDITOR" | "REVIEWER_PUBLISHER" | "ADMIN")[];
            pendingEnrollment: boolean;
            version: string;
        };
        RuleVerificationInput: {
            baseRevision: string;
            sourceNoticeIds: string[];
            verificationScope: string;
            /** Format: date-time */
            verifiedAt: string;
            /** Format: date-time */
            reviewDueAt: string;
            /** Format: date-time */
            effectiveFrom: string;
            /** Format: date-time */
            effectiveUntil: string;
            marketZone: string;
            reason: string;
        };
        QueueItem: {
            /** Format: uuid */
            id: string;
            /** @enum {string} */
            kind: "RESOURCE_DUE" | "RULE_DUE" | "LINK_FAILED" | "CONTENT_ISSUE" | "ASSESSMENT_EXHAUSTED";
            objectId: string | null;
            dueAt: string | null;
            status: string;
        };
        QueuePage: {
            items: components["schemas"]["QueueItem"][];
            nextCursor: string | null;
            limit: number;
        };
        AuditEvent: {
            /** Format: uuid */
            id: string;
            /** Format: uuid */
            actorRef: string;
            eventType: string;
            objectId: string | null;
            revision: string | null;
            /** Format: uuid */
            requestId: string;
            /** Format: date-time */
            occurredAt: string;
        };
        AuditPage: {
            items: components["schemas"]["AuditEvent"][];
            nextCursor: string | null;
            limit: number;
        };
        AuthoredExercise: {
            /** @enum {string} */
            type: "conceptual" | "numerical" | "practical";
            prompt: string;
            referenceSolution: string;
            feedback: string;
            expectedNumeric: string | null;
            absoluteTolerance: string | null;
            relativeTolerance: string | null;
            unit: string | null;
            roundingInstructions: string | null;
            transferOfId: string | null;
        };
        AuthoredProjectField: {
            key: string;
            /** @enum {string} */
            type: "TEXT" | "NUMERIC" | "SELF_RUBRIC";
            label: string;
            required: boolean;
            unit: string | null;
            expectedNumeric: string | null;
            tolerance: string | null;
            weight: number;
            critical: boolean;
        };
        AuthoredProject: {
            fields: components["schemas"]["AuthoredProjectField"][];
            referenceSolution: string;
            /** @constant */
            passScore: 85;
            /** @constant */
            selfReviewOnly: true;
        };
        /** @description PATH only. Exact course membership/prerequisites; manifest supplies target revisions. No enrollmentEnabled=true without all release gates. */
        AuthoredCourse: {
            topics: {
                id: string;
                ordinal: number;
                required: boolean;
                hardPrerequisiteIds: string[];
            }[];
            gates: {
                quizId: string;
                ordinal: number;
                afterTopicId: string;
            }[];
            projectIds: string[];
            enrollmentEnabled: boolean;
            diagnosticQuizIds?: string[];
        };
        DraftSummary: {
            objectId: string;
            revision: string;
            title: string;
            kind: string;
            /** @enum {string} */
            workflow: "DRAFT" | "IN_REVIEW" | "APPROVED";
            version: string;
        };
        DraftPage: {
            items: components["schemas"]["DraftSummary"][];
            nextCursor: string | null;
            limit: number;
        };
        RemediationRequirement: {
            topicId: string;
            topicRevision: string;
            transferExerciseId: string;
            transferExerciseRevision: string;
        };
        AccountStatus: {
            /** Format: uuid */
            accountId: string;
            /** @enum {string} */
            status: "UNVERIFIED" | "ACTIVE" | "SUSPENDED" | "DELETING";
            version: string;
        };
        AccountStatusInput: {
            /** @enum {string} */
            status: "ACTIVE" | "SUSPENDED";
            reason: string;
        };
        Capstone: {
            id: string;
            /** @constant */
            kind: "CAPSTONE";
            revision: string;
            title: string;
            canonicalPath: string;
            /** @enum {string} */
            visibility: "MAP" | "LESSON";
            /** @enum {string} */
            readiness: "scope_outline" | "teaching_brief" | "learning_design" | "project_specification" | "reviewed_lesson";
            summary: string;
            difficulty: string | null;
            priority: string | null;
            tags: string[];
            hours: components["schemas"]["Hours"];
            contentVersion: components["schemas"]["ContentVersion"];
            prerequisites: components["schemas"]["Prerequisite"][];
            brief: string;
            projectIds: string[];
            assessmentPolicyId: string;
            /** @description Approved rule dependencies; operational currency is never inferred from imported metadata. */
            ruleNotices?: components["schemas"]["RuleNotice"][];
        };
        RuleNotice: {
            ruleId: string;
            /** @enum {string} */
            status: "UNKNOWN" | "DUE" | "SUPERSEDED" | "WITHIN_REVIEW_WINDOW" | "UNAVAILABLE";
            reviewDueAt: string | null;
            currentOperationalEligible: boolean;
        };
    };
    responses: {
        /** @description 400 problem; codes and precedence in API.md. */
        Problem400: {
            headers: {
                /** @description Server-generated UUID; never echo untrusted correlation input. */
                "X-Request-ID"?: string;
                /** @description R1 all dynamic API responses, including errors. */
                "Cache-Control"?: "no-store";
                Vary?: "Cookie";
                "X-Robots-Tag"?: "noindex, nofollow";
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["Problem"];
            };
        };
        /** @description 401 problem; codes and precedence in API.md. */
        Problem401: {
            headers: {
                /** @description Server-generated UUID; never echo untrusted correlation input. */
                "X-Request-ID"?: string;
                /** @description R1 all dynamic API responses, including errors. */
                "Cache-Control"?: "no-store";
                Vary?: "Cookie";
                "X-Robots-Tag"?: "noindex, nofollow";
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["Problem"];
            };
        };
        /** @description 403 problem; codes and precedence in API.md. */
        Problem403: {
            headers: {
                /** @description Server-generated UUID; never echo untrusted correlation input. */
                "X-Request-ID"?: string;
                /** @description R1 all dynamic API responses, including errors. */
                "Cache-Control"?: "no-store";
                Vary?: "Cookie";
                "X-Robots-Tag"?: "noindex, nofollow";
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["Problem"];
            };
        };
        /** @description 404 problem; codes and precedence in API.md. */
        Problem404: {
            headers: {
                /** @description Server-generated UUID; never echo untrusted correlation input. */
                "X-Request-ID"?: string;
                /** @description R1 all dynamic API responses, including errors. */
                "Cache-Control"?: "no-store";
                Vary?: "Cookie";
                "X-Robots-Tag"?: "noindex, nofollow";
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["Problem"];
            };
        };
        /** @description 405 problem; codes and precedence in API.md. */
        Problem405: {
            headers: {
                /** @description Server-generated UUID; never echo untrusted correlation input. */
                "X-Request-ID"?: string;
                /** @description R1 all dynamic API responses, including errors. */
                "Cache-Control"?: "no-store";
                /** @description Supported methods for matched route. */
                Allow?: string;
                Vary?: "Cookie";
                "X-Robots-Tag"?: "noindex, nofollow";
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["Problem"];
            };
        };
        /** @description 409 problem; codes and precedence in API.md. */
        Problem409: {
            headers: {
                /** @description Server-generated UUID; never echo untrusted correlation input. */
                "X-Request-ID"?: string;
                /** @description R1 all dynamic API responses, including errors. */
                "Cache-Control"?: "no-store";
                Vary?: "Cookie";
                "X-Robots-Tag"?: "noindex, nofollow";
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["Problem"];
            };
        };
        /** @description 412 problem; codes and precedence in API.md. */
        Problem412: {
            headers: {
                /** @description Server-generated UUID; never echo untrusted correlation input. */
                "X-Request-ID"?: string;
                /** @description R1 all dynamic API responses, including errors. */
                "Cache-Control"?: "no-store";
                Vary?: "Cookie";
                "X-Robots-Tag"?: "noindex, nofollow";
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["Problem"];
            };
        };
        /** @description 413 problem; codes and precedence in API.md. */
        Problem413: {
            headers: {
                /** @description Server-generated UUID; never echo untrusted correlation input. */
                "X-Request-ID"?: string;
                /** @description R1 all dynamic API responses, including errors. */
                "Cache-Control"?: "no-store";
                Vary?: "Cookie";
                "X-Robots-Tag"?: "noindex, nofollow";
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["Problem"];
            };
        };
        /** @description 415 problem; codes and precedence in API.md. */
        Problem415: {
            headers: {
                /** @description Server-generated UUID; never echo untrusted correlation input. */
                "X-Request-ID"?: string;
                /** @description R1 all dynamic API responses, including errors. */
                "Cache-Control"?: "no-store";
                Vary?: "Cookie";
                "X-Robots-Tag"?: "noindex, nofollow";
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["Problem"];
            };
        };
        /** @description 422 problem; codes and precedence in API.md. */
        Problem422: {
            headers: {
                /** @description Server-generated UUID; never echo untrusted correlation input. */
                "X-Request-ID"?: string;
                /** @description R1 all dynamic API responses, including errors. */
                "Cache-Control"?: "no-store";
                Vary?: "Cookie";
                "X-Robots-Tag"?: "noindex, nofollow";
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["Problem"];
            };
        };
        /** @description 428 problem; codes and precedence in API.md. */
        Problem428: {
            headers: {
                /** @description Server-generated UUID; never echo untrusted correlation input. */
                "X-Request-ID"?: string;
                /** @description R1 all dynamic API responses, including errors. */
                "Cache-Control"?: "no-store";
                Vary?: "Cookie";
                "X-Robots-Tag"?: "noindex, nofollow";
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["Problem"];
            };
        };
        /** @description 429 problem; codes and precedence in API.md. */
        Problem429: {
            headers: {
                /** @description Server-generated UUID; never echo untrusted correlation input. */
                "X-Request-ID"?: string;
                /** @description R1 all dynamic API responses, including errors. */
                "Cache-Control"?: "no-store";
                /** @description Seconds until eligible retry, no automatic replay of unsafe calls. */
                "Retry-After"?: number;
                Vary?: "Cookie";
                "X-Robots-Tag"?: "noindex, nofollow";
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["Problem"];
            };
        };
        /** @description 500 problem; codes and precedence in API.md. */
        Problem500: {
            headers: {
                /** @description Server-generated UUID; never echo untrusted correlation input. */
                "X-Request-ID"?: string;
                /** @description R1 all dynamic API responses, including errors. */
                "Cache-Control"?: "no-store";
                Vary?: "Cookie";
                "X-Robots-Tag"?: "noindex, nofollow";
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["Problem"];
            };
        };
        /** @description 503 problem; codes and precedence in API.md. */
        Problem503: {
            headers: {
                /** @description Server-generated UUID; never echo untrusted correlation input. */
                "X-Request-ID"?: string;
                /** @description R1 all dynamic API responses, including errors. */
                "Cache-Control"?: "no-store";
                /** @description Seconds until eligible retry, no automatic replay of unsafe calls. */
                "Retry-After"?: number;
                Vary?: "Cookie";
                "X-Robots-Tag"?: "noindex, nofollow";
                [name: string]: unknown;
            };
            content: {
                "application/problem+json": components["schemas"]["Problem"];
            };
        };
    };
    parameters: {
        limit: number;
        cursor: string;
        /** @description Exact strong ETag from the owned/admin representation; missing 428, stale 412. */
        IfMatch: string;
        /** @description Required for conditional creation; mutually exclusive with If-Match. */
        CreateCondition: "*";
        /** @description Required for replacement; mutually exclusive with If-None-Match: *. */
        OptionalMatch: string;
        IdempotencyKey: string;
        CSRF: string;
        /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
        Origin: string;
    };
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    getContentVersion: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description publicationId:generation matching response contentVersion. */
                    "X-Content-Version"?: string;
                    /** @description Strong current publication/generation token for rollback concurrency. */
                    ETag?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContentVersion"];
                };
            };
            400: components["responses"]["Problem400"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    listPrograms: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                cursor?: components["parameters"]["cursor"];
                sort?: "title" | "-title" | "duration";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description publicationId:generation matching response contentVersion. */
                    "X-Content-Version"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CatalogPage"];
                };
            };
            400: components["responses"]["Problem400"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getProgram: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description publicationId:generation matching response contentVersion. */
                    "X-Content-Version"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Program"];
                };
            };
            400: components["responses"]["Problem400"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    listPhases: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                cursor?: components["parameters"]["cursor"];
                sort?: "title" | "-title" | "duration";
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                program?: string[];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description publicationId:generation matching response contentVersion. */
                    "X-Content-Version"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CatalogPage"];
                };
            };
            400: components["responses"]["Problem400"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getPhase: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description publicationId:generation matching response contentVersion. */
                    "X-Content-Version"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Phase"];
                };
            };
            400: components["responses"]["Problem400"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    listModules: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                cursor?: components["parameters"]["cursor"];
                sort?: "title" | "-title" | "duration";
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                program?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                phase?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                difficulty?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                tag?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                path?: string[];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description publicationId:generation matching response contentVersion. */
                    "X-Content-Version"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CatalogPage"];
                };
            };
            400: components["responses"]["Problem400"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getModule: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description publicationId:generation matching response contentVersion. */
                    "X-Content-Version"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Module"];
                };
            };
            400: components["responses"]["Problem400"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    listTopics: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                cursor?: components["parameters"]["cursor"];
                sort?: "title" | "-title" | "duration";
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                module?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                phase?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                difficulty?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                priority?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                tag?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                path?: string[];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description publicationId:generation matching response contentVersion. */
                    "X-Content-Version"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CatalogPage"];
                };
            };
            400: components["responses"]["Problem400"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getTopic: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description publicationId:generation matching response contentVersion. */
                    "X-Content-Version"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Topic"];
                };
            };
            400: components["responses"]["Problem400"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    listResources: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                cursor?: components["parameters"]["cursor"];
                sort?: "title" | "-title" | "duration" | "priority" | "-verified";
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                resourceType?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                difficulty?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                cost?: ("free" | "mixed" | "paid" | "unknown")[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                priority?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                topic?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                tag?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                phase?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                source?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                path?: string[];
                /** @description Exact canonical values. OR within this name; AND across names. Ready to learn uses visibility=LESSON. */
                geography?: string[];
                /** @description Exact canonical values. OR within this name; AND across names. Ready to learn uses visibility=LESSON. */
                verificationStatus?: ("access_or_inherited_metadata_only" | "limited_review" | "selected_sections_reviewed")[];
                /** @description Exact canonical values. OR within this name; AND across names. Ready to learn uses visibility=LESSON. */
                readiness?: ("scope_outline" | "teaching_brief" | "learning_design" | "project_specification" | "reviewed_lesson")[];
                /** @description Exact canonical values. OR within this name; AND across names. Ready to learn uses visibility=LESSON. */
                visibility?: ("MAP" | "LESSON")[];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description publicationId:generation matching response contentVersion. */
                    "X-Content-Version"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CatalogPage"];
                };
            };
            400: components["responses"]["Problem400"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getResource: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description publicationId:generation matching response contentVersion. */
                    "X-Content-Version"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Resource"];
                };
            };
            400: components["responses"]["Problem400"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    listPaths: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                cursor?: components["parameters"]["cursor"];
                sort?: "title" | "-title" | "duration";
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                difficulty?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                tag?: string[];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description publicationId:generation matching response contentVersion. */
                    "X-Content-Version"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CatalogPage"];
                };
            };
            400: components["responses"]["Problem400"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getPath: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description publicationId:generation matching response contentVersion. */
                    "X-Content-Version"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Path"];
                };
            };
            400: components["responses"]["Problem400"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    listProjects: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                cursor?: components["parameters"]["cursor"];
                sort?: "title" | "-title" | "duration";
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                difficulty?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                topic?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                tag?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                path?: string[];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description publicationId:generation matching response contentVersion. */
                    "X-Content-Version"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CatalogPage"];
                };
            };
            400: components["responses"]["Problem400"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getProject: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description publicationId:generation matching response contentVersion. */
                    "X-Content-Version"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Project"];
                };
            };
            400: components["responses"]["Problem400"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getSubtopic: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description publicationId:generation matching response contentVersion. */
                    "X-Content-Version"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Subtopic"];
                };
            };
            400: components["responses"]["Problem400"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getExercise: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description publicationId:generation matching response contentVersion. */
                    "X-Content-Version"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Exercise"];
                };
            };
            400: components["responses"]["Problem400"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getQuiz: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description publicationId:generation matching response contentVersion. */
                    "X-Content-Version"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Quiz"];
                };
            };
            400: components["responses"]["Problem400"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    searchCatalog: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                page?: number;
                /** @description Required on page > 0; mismatch 409. */
                generation?: string;
                /** @description Trim; English web search syntax; blank browses. */
                q?: string;
                sort?: "relevance" | "title" | "-title" | "duration" | "priority" | "-verified";
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                kind?: ("PROGRAM" | "PHASE" | "MODULE" | "TOPIC" | "SUBTOPIC" | "RESOURCE" | "PATH" | "PROJECT" | "EXERCISE" | "QUIZ" | "CAPSTONE")[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                difficulty?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                resourceType?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                cost?: ("free" | "mixed" | "paid" | "unknown")[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                priority?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                topic?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                tag?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                phase?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                source?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                path?: string[];
                /** @description Exact canonical values. OR within this name; AND across names. Ready to learn uses visibility=LESSON. */
                geography?: string[];
                /** @description Exact canonical values. OR within this name; AND across names. Ready to learn uses visibility=LESSON. */
                verificationStatus?: ("access_or_inherited_metadata_only" | "limited_review" | "selected_sections_reviewed")[];
                /** @description Exact canonical values. OR within this name; AND across names. Ready to learn uses visibility=LESSON. */
                readiness?: ("scope_outline" | "teaching_brief" | "learning_design" | "project_specification" | "reviewed_lesson")[];
                /** @description Exact canonical values. OR within this name; AND across names. Ready to learn uses visibility=LESSON. */
                visibility?: ("MAP" | "LESSON")[];
                /** @description Exact canonical values. OR within this name; AND across names. Ready to learn uses visibility=LESSON. */
                module?: string[];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description publicationId:generation matching response contentVersion. */
                    "X-Content-Version"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SearchPage"];
                };
            };
            400: components["responses"]["Problem400"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getDiscoveryFacets: {
        parameters: {
            query?: {
                entity?: "resources" | "search";
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                kind?: ("PROGRAM" | "PHASE" | "MODULE" | "TOPIC" | "SUBTOPIC" | "RESOURCE" | "PATH" | "PROJECT" | "EXERCISE" | "QUIZ" | "CAPSTONE")[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                difficulty?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                resourceType?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                cost?: ("free" | "mixed" | "paid" | "unknown")[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                priority?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                topic?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                tag?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                phase?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                source?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                path?: string[];
                q?: string;
                /** @description Exact canonical values. OR within this name; AND across names. Ready to learn uses visibility=LESSON. */
                geography?: string[];
                /** @description Exact canonical values. OR within this name; AND across names. Ready to learn uses visibility=LESSON. */
                verificationStatus?: ("access_or_inherited_metadata_only" | "limited_review" | "selected_sections_reviewed")[];
                /** @description Exact canonical values. OR within this name; AND across names. Ready to learn uses visibility=LESSON. */
                readiness?: ("scope_outline" | "teaching_brief" | "learning_design" | "project_specification" | "reviewed_lesson")[];
                /** @description Exact canonical values. OR within this name; AND across names. Ready to learn uses visibility=LESSON. */
                visibility?: ("MAP" | "LESSON")[];
                /** @description Exact canonical values. OR within this name; AND across names. Ready to learn uses visibility=LESSON. */
                module?: string[];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description publicationId:generation matching response contentVersion. */
                    "X-Content-Version"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DiscoveryFacets"];
                };
            };
            400: components["responses"]["Problem400"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    resolveRoute: {
        parameters: {
            query: {
                path: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description publicationId:generation matching response contentVersion. */
                    "X-Content-Version"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RouteResolution"];
                };
            };
            400: components["responses"]["Problem400"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    evaluateTransientPractice: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PracticeInput"];
            };
        };
        responses: {
            /** @description Success. Transient public practice; CSRF pre-session required, no learner record; never gate evidence. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PracticeFeedback"];
                };
            };
            400: components["responses"]["Problem400"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    solutionTransientPractice: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SolutionInput"];
            };
        };
        responses: {
            /** @description Success. Transient public practice; CSRF pre-session required, no learner record; never gate evidence. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PracticeFeedback"];
                };
            };
            400: components["responses"]["Problem400"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getCsrf: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Csrf"];
                };
            };
            400: components["responses"]["Problem400"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getSession: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Session"];
                };
            };
            400: components["responses"]["Problem400"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    register: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RegisterInput"];
            };
        };
        responses: {
            /** @description Success. Generic acknowledgment where applicable; no token is consumed on GET. */
            202: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Acknowledgment"];
                };
            };
            400: components["responses"]["Problem400"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    requestVerification: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EmailInput"];
            };
        };
        responses: {
            /** @description Success. Generic acknowledgment where applicable; no token is consumed on GET. */
            202: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Acknowledgment"];
                };
            };
            400: components["responses"]["Problem400"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    confirmVerification: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TokenInput"];
            };
        };
        responses: {
            /** @description Success. Generic acknowledgment where applicable; no token is consumed on GET. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Acknowledgment"];
                };
            };
            400: components["responses"]["Problem400"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    requestPasswordReset: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EmailInput"];
            };
        };
        responses: {
            /** @description Success. Generic acknowledgment where applicable; no token is consumed on GET. */
            202: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Acknowledgment"];
                };
            };
            400: components["responses"]["Problem400"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    confirmPasswordReset: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ResetInput"];
            };
        };
        responses: {
            /** @description Success. Generic acknowledgment where applicable; no token is consumed on GET. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Acknowledgment"];
                };
            };
            400: components["responses"]["Problem400"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    login: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoginInput"];
            };
        };
        responses: {
            /** @description Success. Generic acknowledgment where applicable; no token is consumed on GET. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Session"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    confirmEmailChange: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TokenInput"];
            };
        };
        responses: {
            /** @description Success. Generic acknowledgment where applicable; no token is consumed on GET. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Acknowledgment"];
                };
            };
            400: components["responses"]["Problem400"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    logout: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            204: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    logoutAll: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            204: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    reauthenticate: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PasswordInput"];
            };
        };
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Session"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    Assertionoptions: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssertionOptions"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    Assertions: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AssertionInput"];
            };
        };
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Session"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getProfile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Profile"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    replaceProfile: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                /** @description Exact strong ETag from the owned/admin representation; missing 428, stale 412. */
                "If-Match": components["parameters"]["IfMatch"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProfileInput"];
            };
        };
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Profile"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    changePassword: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ChangePasswordInput"];
            };
        };
        responses: {
            /** @description Success. */
            202: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Same-origin URI of created resource/job when an ID is returned. */
                    Location?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Acknowledgment"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    requestEmailChange: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EmailInput"];
            };
        };
        responses: {
            /** @description Success. */
            202: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Same-origin URI of created resource/job when an ID is returned. */
                    Location?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Acknowledgment"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    cancelEmailChange: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            204: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    listCredentials: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Credentials"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    registerCredential: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RegistrationInput"];
            };
        };
        responses: {
            /** @description Success. */
            201: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Same-origin URI of created resource/job when an ID is returned. */
                    Location?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Credential"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    beginCredentialRegistration: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RegistrationOptions"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    revokeCredential: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
            };
            path: {
                credentialId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            204: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    requestOwnerExport: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            202: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Same-origin URI of created resource/job when an ID is returned. */
                    Location?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PrivacyRequest"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getOwnerExportStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                requestId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PrivacyRequest"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    downloadOwnerExport: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                requestId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    "Content-Disposition"?: "attachment; filename=\"export.zip\"";
                    [name: string]: unknown;
                };
                content: {
                    "application/zip": string;
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    deleteAccount: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DeleteAccountInput"];
            };
        };
        responses: {
            /** @description Success. */
            202: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Same-origin URI of created resource/job when an ID is returned. */
                    Location?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PrivacyRequest"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getDashboard: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Dashboard"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    listEnrollments: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                cursor?: components["parameters"]["cursor"];
                sort?: "created" | "-created";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EnrollmentPage"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    createEnrollment: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EnrollmentInput"];
            };
        };
        responses: {
            /** @description Success. */
            201: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    /** @description Same-origin URI of created resource/job when an ID is returned. */
                    Location?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Enrollment"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    listProgress: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                cursor?: components["parameters"]["cursor"];
                sort?: "created" | "-created";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProgressPage"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    listBookmarks: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                cursor?: components["parameters"]["cursor"];
                sort?: "created" | "-created";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookmarkPage"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    listNotes: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                cursor?: components["parameters"]["cursor"];
                sort?: "created" | "-created";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotePage"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    listAttempts: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                cursor?: components["parameters"]["cursor"];
                sort?: "created" | "-created";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AttemptPage"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    startOrResumeAttempt: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AttemptInput"];
            };
        };
        responses: {
            /** @description Success. */
            201: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    /** @description Same-origin URI of created resource/job when an ID is returned. */
                    Location?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Attempt"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    listOwnIssues: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                cursor?: components["parameters"]["cursor"];
                sort?: "created" | "-created";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["IssuePage"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    createIssue: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["IssueInput"];
            };
        };
        responses: {
            /** @description Success. */
            201: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    /** @description Same-origin URI of created resource/job when an ID is returned. */
                    Location?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Issue"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    listOwnAssessmentRequests: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                cursor?: components["parameters"]["cursor"];
                sort?: "created" | "-created";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssessmentRequestPage"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    requestFreshAssessment: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AssessmentRequestInput"];
            };
        };
        responses: {
            /** @description Success. */
            201: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    /** @description Same-origin URI of created resource/job when an ID is returned. */
                    Location?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssessmentRequest"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    listProjectWork: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                cursor?: components["parameters"]["cursor"];
                sort?: "created" | "-created";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProjectWorkPage"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    startProjectWork: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProjectWorkInput"];
            };
        };
        responses: {
            /** @description Success. */
            201: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    /** @description Same-origin URI of created resource/job when an ID is returned. */
                    Location?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProjectWork"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getEnrollment: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                enrollmentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Enrollment"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getEnrolledLesson: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                enrollmentId: string;
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. Owner requirement revision only; safe historical lesson from pinned enrollment, live withdrawal overlays apply. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Topic"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    previewEnrollmentMigration: {
        parameters: {
            query: {
                targetPathRevision: string;
            };
            header?: never;
            path: {
                enrollmentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MigrationPreview"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    migrateEnrollment: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                /** @description Exact strong ETag from the owned/admin representation; missing 428, stale 412. */
                "If-Match": components["parameters"]["IfMatch"];
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                enrollmentId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MigrationInput"];
            };
        };
        responses: {
            /** @description Success. */
            201: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    /** @description Same-origin URI of created resource/job when an ID is returned. */
                    Location?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Enrollment"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getProgress: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
                revision: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Progress"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    saveProgress: {
        parameters: {
            query?: never;
            header: {
                /** @description Required for conditional creation; mutually exclusive with If-Match. */
                "If-None-Match"?: components["parameters"]["CreateCondition"];
                /** @description Required for replacement; mutually exclusive with If-None-Match: *. */
                "If-Match"?: components["parameters"]["OptionalMatch"];
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
            };
            path: {
                id: string;
                revision: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProgressInput"];
            };
        };
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Progress"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getNote: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Note"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    saveNote: {
        parameters: {
            query?: never;
            header: {
                /** @description Required for conditional creation; mutually exclusive with If-Match. */
                "If-None-Match"?: components["parameters"]["CreateCondition"];
                /** @description Required for replacement; mutually exclusive with If-None-Match: *. */
                "If-Match"?: components["parameters"]["OptionalMatch"];
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["NoteInput"];
            };
        };
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Note"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    deleteNote: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                /** @description Exact strong ETag from the owned/admin representation; missing 428, stale 412. */
                "If-Match": components["parameters"]["IfMatch"];
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            204: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    saveBookmark: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Bookmark"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    deleteBookmark: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            204: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getOwnIssue: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                issueId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Issue"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getPractice: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
                revision: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PracticeRecord"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    savePractice: {
        parameters: {
            query?: never;
            header: {
                /** @description Required for conditional creation; mutually exclusive with If-Match. */
                "If-None-Match"?: components["parameters"]["CreateCondition"];
                /** @description Required for replacement; mutually exclusive with If-None-Match: *. */
                "If-Match"?: components["parameters"]["OptionalMatch"];
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
            };
            path: {
                id: string;
                revision: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PracticeInput"];
            };
        };
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PracticeRecord"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    deletePractice: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                /** @description Exact strong ETag from the owned/admin representation; missing 428, stale 412. */
                "If-Match": components["parameters"]["IfMatch"];
            };
            path: {
                id: string;
                revision: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            204: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    viewSavedPracticeSolution: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                /** @description Exact strong ETag from the owned/admin representation; missing 428, stale 412. */
                "If-Match": components["parameters"]["IfMatch"];
            };
            path: {
                id: string;
                revision: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SolutionInput"];
            };
        };
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PracticeRecord"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getAttempt: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                attemptId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Attempt"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    saveAttemptAnswers: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                /** @description Exact strong ETag from the owned/admin representation; missing 428, stale 412. */
                "If-Match": components["parameters"]["IfMatch"];
            };
            path: {
                attemptId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AnswersInput"];
            };
        };
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Attempt"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    submitAttempt: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                /** @description Exact strong ETag from the owned/admin representation; missing 428, stale 412. */
                "If-Match": components["parameters"]["IfMatch"];
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                attemptId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AnswersInput"];
            };
        };
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AttemptResult"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    abandonAttempt: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                /** @description Exact strong ETag from the owned/admin representation; missing 428, stale 412. */
                "If-Match": components["parameters"]["IfMatch"];
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                attemptId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Attempt"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getAttemptResult: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                attemptId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AttemptResult"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    completeRemediation: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                attemptId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RemediationInput"];
            };
        };
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Remediation"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getOwnAssessmentRequest: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                requestId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssessmentRequest"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getProjectWork: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                workId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProjectWork"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    saveProjectWork: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                /** @description Exact strong ETag from the owned/admin representation; missing 428, stale 412. */
                "If-Match": components["parameters"]["IfMatch"];
            };
            path: {
                workId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProjectResponsesInput"];
            };
        };
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProjectWork"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    selfReviewProject: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                /** @description Exact strong ETag from the owned/admin representation; missing 428, stale 412. */
                "If-Match": components["parameters"]["IfMatch"];
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                workId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SelfReviewInput"];
            };
        };
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProjectResult"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getProjectResult: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                workId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProjectResult"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    deleteProjectWriting: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. Erase own writing and self-review evidence across all versions/submissions of this project. Idempotent account-locked erasure; no content deletion. */
            204: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content?: never;
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    listDrafts: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                cursor?: components["parameters"]["cursor"];
                sort?: "title" | "-title";
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                kind?: ("PROGRAM" | "PHASE" | "MODULE" | "TOPIC" | "SUBTOPIC" | "RESOURCE" | "PATH" | "PROJECT" | "EXERCISE" | "QUIZ")[];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DraftPage"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getDraft: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Draft"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    saveDraft: {
        parameters: {
            query?: never;
            header: {
                /** @description Required for conditional creation; mutually exclusive with If-Match. */
                "If-None-Match"?: components["parameters"]["CreateCondition"];
                /** @description Required for replacement; mutually exclusive with If-None-Match: *. */
                "If-Match"?: components["parameters"]["OptionalMatch"];
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DraftInput"];
            };
        };
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Draft"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getDraftDiff: {
        parameters: {
            query?: {
                baseRevision?: string;
                proposedRevision?: string;
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Diff"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    requestDraftReview: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                /** @description Exact strong ETag from the owned/admin representation; missing 428, stale 412. */
                "If-Match": components["parameters"]["IfMatch"];
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Draft"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    reviewDraft: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                /** @description Exact strong ETag from the owned/admin representation; missing 428, stale 412. */
                "If-Match": components["parameters"]["IfMatch"];
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReviewInput"];
            };
        };
        responses: {
            /** @description Success. */
            201: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    /** @description Same-origin URI of created resource/job when an ID is returned. */
                    Location?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Review"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    previewRevision: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
                revision: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. Exact authorized draft revision, protected sections included; no public token preview, noindex/no-store. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Draft"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    proposeRetirement: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                /** @description Exact strong ETag from the owned/admin representation; missing 428, stale 412. */
                "If-Match": components["parameters"]["IfMatch"];
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RetirementInput"];
            };
        };
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Draft"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    stagePublication: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PublicationInput"];
            };
        };
        responses: {
            /** @description Success. */
            201: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    /** @description Same-origin URI of created resource/job when an ID is returned. */
                    Location?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Publication"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getPublication: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                publicationId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Publication"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    activatePublication: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                /** @description Exact strong ETag from the owned/admin representation; missing 428, stale 412. */
                "If-Match": components["parameters"]["IfMatch"];
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                publicationId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. Revalidate candidate expected active generation and all approvals; atomic search/publication switch. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContentVersion"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    rollbackPublication: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                /** @description Exact strong ETag from the owned/admin representation; missing 428, stale 412. */
                "If-Match": components["parameters"]["IfMatch"];
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RollbackInput"];
            };
        };
        responses: {
            /** @description Success. If-Match is current content-version ETag; create new event; preserve withdrawals and live exclusions. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContentVersion"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    withdrawContent: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WithdrawalInput"];
            };
        };
        responses: {
            /** @description Success. */
            201: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    /** @description Same-origin URI of created resource/job when an ID is returned. */
                    Location?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Withdrawal"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getWithdrawal: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                withdrawalId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Withdrawal"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    reinstateContent: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                /** @description Exact strong ETag from the owned/admin representation; missing 428, stale 412. */
                "If-Match": components["parameters"]["IfMatch"];
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                withdrawalId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReinstatementInput"];
            };
        };
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Withdrawal"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    validateAndStageImport: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/zip": string;
            };
        };
        responses: {
            /** @description Success. 100 MiB zip package, allowlisted paths; canonical manifest/base hashes; drafts only. */
            202: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    /** @description Same-origin URI of created resource/job when an ID is returned. */
                    Location?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ImportRun"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getImportRun: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                runId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ImportRun"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getImportReport: {
        parameters: {
            query?: {
                cursor?: components["parameters"]["cursor"];
            };
            header?: never;
            path: {
                runId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ImportReport"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    revalidateImport: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                /** @description Exact strong ETag from the owned/admin representation; missing 428, stale 412. */
                "If-Match": components["parameters"]["IfMatch"];
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                runId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            202: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    /** @description Same-origin URI of created resource/job when an ID is returned. */
                    Location?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ImportRun"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    applyImport: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                /** @description Exact strong ETag from the owned/admin representation; missing 428, stale 412. */
                "If-Match": components["parameters"]["IfMatch"];
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                runId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ImportRun"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    requestEditorialExport: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EditorialExportInput"];
            };
        };
        responses: {
            /** @description Success. */
            202: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Same-origin URI of created resource/job when an ID is returned. */
                    Location?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Job"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getEditorialExport: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                jobId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Job"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    downloadEditorialExport: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                jobId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    "Content-Disposition"?: "attachment; filename=\"export.zip\"";
                    [name: string]: unknown;
                };
                content: {
                    "application/zip": string;
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    listMaintenance: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                cursor?: components["parameters"]["cursor"];
                sort?: "created" | "-created";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["QueuePage"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getVolunteeredIssue: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                issueId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Issue"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    triageIssue: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                /** @description Exact strong ETag from the owned/admin representation; missing 428, stale 412. */
                "If-Match": components["parameters"]["IfMatch"];
            };
            path: {
                issueId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["IssueTriageInput"];
            };
        };
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Issue"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getAssessmentMaintenanceRequest: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                requestId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssessmentRequest"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    resolveAssessmentMaintenanceRequest: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                /** @description Exact strong ETag from the owned/admin representation; missing 428, stale 412. */
                "If-Match": components["parameters"]["IfMatch"];
            };
            path: {
                requestId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AssessmentResolutionInput"];
            };
        };
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssessmentRequest"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    certifyRule: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                /** @description Exact strong ETag from the owned/admin representation; missing 428, stale 412. */
                "If-Match": components["parameters"]["IfMatch"];
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RuleVerificationInput"];
            };
        };
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ContentVersion"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getAccountRoles: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                accountId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RoleState"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    grantRole: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                /** @description Exact strong ETag from the owned/admin representation; missing 428, stale 412. */
                "If-Match": components["parameters"]["IfMatch"];
                "Idempotency-Key": components["parameters"]["IdempotencyKey"];
            };
            path: {
                accountId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RoleInput"];
            };
        };
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RoleState"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    revokeRole: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                /** @description Exact strong ETag from the owned/admin representation; missing 428, stale 412. */
                "If-Match": components["parameters"]["IfMatch"];
            };
            path: {
                accountId: string;
                role: "EDITOR" | "REVIEWER_PUBLISHER" | "ADMIN";
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RoleState"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    listEditorialAudit: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                cursor?: components["parameters"]["cursor"];
                sort?: "created" | "-created";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AuditPage"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getAccountStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                accountId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AccountStatus"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    setAccountStatus: {
        parameters: {
            query?: never;
            header: {
                "X-CSRF-TOKEN": components["parameters"]["CSRF"];
                /** @description Unsafe browser calls require configured same origin; absent requires same-origin Referer. */
                Origin?: components["parameters"]["Origin"];
                /** @description Exact strong ETag from the owned/admin representation; missing 428, stale 412. */
                "If-Match": components["parameters"]["IfMatch"];
            };
            path: {
                accountId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AccountStatusInput"];
            };
        };
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description Strong opaque quoted resource version, scoped to representation. */
                    ETag?: string;
                    Vary?: "Cookie";
                    "X-Robots-Tag"?: "noindex, nofollow";
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AccountStatus"];
                };
            };
            400: components["responses"]["Problem400"];
            401: components["responses"]["Problem401"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            412: components["responses"]["Problem412"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            428: components["responses"]["Problem428"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    listCapstones: {
        parameters: {
            query?: {
                limit?: components["parameters"]["limit"];
                cursor?: components["parameters"]["cursor"];
                sort?: "title" | "-title" | "duration";
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                difficulty?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                topic?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                tag?: string[];
                /** @description OR within repeated values; AND across filter names. Exact case-sensitive canonical values. */
                path?: string[];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description publicationId:generation matching response contentVersion. */
                    "X-Content-Version"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CatalogPage"];
                };
            };
            400: components["responses"]["Problem400"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
    getCapstone: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success. */
            200: {
                headers: {
                    /** @description Server-generated UUID; never echo untrusted correlation input. */
                    "X-Request-ID"?: string;
                    /** @description R1 all dynamic API responses, including errors. */
                    "Cache-Control"?: "no-store";
                    /** @description publicationId:generation matching response contentVersion. */
                    "X-Content-Version"?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["Capstone"];
                };
            };
            400: components["responses"]["Problem400"];
            403: components["responses"]["Problem403"];
            404: components["responses"]["Problem404"];
            405: components["responses"]["Problem405"];
            409: components["responses"]["Problem409"];
            413: components["responses"]["Problem413"];
            415: components["responses"]["Problem415"];
            422: components["responses"]["Problem422"];
            429: components["responses"]["Problem429"];
            500: components["responses"]["Problem500"];
            503: components["responses"]["Problem503"];
        };
    };
}
