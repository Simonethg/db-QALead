# DEF-002: RESTful Booker returns HTTP 500 for invalid booking payload

## Severity

Medium

## Priority

Medium

## Environment

- URL: https://restful-booker.herokuapp.com/booking
- Method: `POST`
- Tool: Playwright API request context
- Test: `tests/api/booking.spec.ts`

## Steps to reproduce

1. Send a `POST` request to `/booking` with a body that does not match the expected schema, for example:

   ```json
   { "invalid": "payload" }
   ```

2. Set header `Content-Type: application/json`.

## Expected result

The API returns `400 Bad Request` with a clear validation error indicating which fields are missing or invalid.

## Actual result

The API returns `500 Internal Server Error`. A server-side stack trace is exposed, which is also a security concern.

## Evidence

- Test run output from `npm test`:

  ```text
  Expected: 400
  Received: 500
  ```

- API response body includes a server error page instead of a structured validation message.

## Impact

- **Reliability:** Clients cannot distinguish between a malformed request and a server failure.
- **Security:** A 500 response may leak internal implementation details.
- **Testability:** Negative-path API tests must assert against `500` instead of the semantically correct `400`, which weakens contract validation.
- **SOC 2 Type II:** Unhandled exceptions in public APIs are control deficiencies if not logged, triaged, and fixed.

## Recommended action

1. Add request schema validation to the `/booking` endpoint.
2. Return `400 Bad Request` with a structured error body for invalid payloads.
3. Catch unexpected exceptions and return `500` only for genuine server errors, without exposing stack traces.
4. Add contract tests that assert on both happy-path and validation-error responses.

## Status

Open — covered by `tests/api/booking.spec.ts` (`should reject an invalid booking payload with a non-success status`), which asserts the current `500` and documents the preferred `400` once the API is fixed.
