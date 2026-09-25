-- Synthetic facts are inserted only into an isolated rehearsal database.
BEGIN;
INSERT INTO practice.account_user (id)
VALUES ('00000000-0000-4000-8000-000000140001');
INSERT INTO practice.account_identity (id, user_id, provider, subject)
VALUES ('00000000-0000-4000-8000-000000140002',
        '00000000-0000-4000-8000-000000140001', 'vk', 'cutover-rehearsal');
INSERT INTO practice.account_password
  (user_id, email_normalized, password_hash, email_verified_at)
VALUES ('00000000-0000-4000-8000-000000140001',
        'cutover-rehearsal@example.invalid', 'not-a-real-password-hash', now());
INSERT INTO practice.account_session
  (id, user_id, token_hash, authenticated_at, expires_at, revoked_at)
VALUES ('00000000-0000-4000-8000-000000140003',
        '00000000-0000-4000-8000-000000140001', repeat('a', 64),
        now() - interval '1 hour', now() + interval '1 hour', now());
INSERT INTO practice.progress_result
  (user_id, context_kind, context_id, task_id, solution_revision)
SELECT '00000000-0000-4000-8000-000000140001', 'standalone',
       id, id, solution_revision
FROM practice.task ORDER BY id LIMIT 1;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM practice.progress_result
                 WHERE user_id = '00000000-0000-4000-8000-000000140001') THEN
    RAISE EXCEPTION 'rehearsal needs at least one production task';
  END IF;
END $$;
COMMIT;
