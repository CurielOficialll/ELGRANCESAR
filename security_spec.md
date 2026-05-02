# Security Specification - ELGRANCESAR

## Data Invariants
1. A **Bet** cannot be created without a valid `userId` matching the authenticated user.
2. A **Bet** must reference an existing **Market**.
3. Users cannot modify their own `balance` directly via client SDKs; this should ideally be handled by a backend trigger or admin, but for this app's logic, we will strictly control the fields they can update.
4. Users can only read their own profile and bets.
5. Admins have full read/write access to all collections except potentially sensitive PII if isolated.

## The Dirty Dozen Payloads (Rejection Tests)

1. **Identity Spoofing**: Attempt to create a bet with a `userId` that is not mine.
2. **Infinite Stakes**: Attempt to create a bet with a negative stake or a stake larger than 1M.
3. **Ghost Odds injection**: Attempt to create a bet with odds of 1,000,000.
4. **Self-Balance Boost**: Attempt to update my own `balance` field in `users/{uid}`.
5. **Market Sabotage**: Non-admin attempting to update a market status to `FINISHED`.
6. **Time Travel**: Attempting to create a bet with a `createdAt` in the past (not matching `request.time`).
7. **Role Escalation**: Attempting to update `role` from `STANDARD` to `ADMIN`.
8. **Shadow Field injection**: Adding a field `isVerified: true` to a Market document.
9. **Document ID Poisoning**: Creating a market with a 2KB junk string as ID.
10. **Resource Exhaustion**: Sending an array with 10,000 fake runners in a racing market.
11. **Negative Score**: Setting a team's score to -5 in a Live market.
12. **Outcome Overwrite**: Changing the `status` of a bet from `LOST` to `WON` after settlement.

## The Test Runner (firestore.rules.test.ts)
(This will be implemented in the next turn or verified via logic).
