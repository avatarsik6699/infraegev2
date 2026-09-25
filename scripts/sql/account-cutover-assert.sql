SELECT CASE WHEN
  (SELECT count(*) FROM practice.account_user
   WHERE id = '00000000-0000-4000-8000-000000140001') = 1
  AND (SELECT count(*) FROM practice.account_identity
       WHERE user_id = '00000000-0000-4000-8000-000000140001'
         AND provider = 'vk' AND subject = 'cutover-rehearsal') = 1
  AND (SELECT count(*) FROM practice.account_password
       WHERE user_id = '00000000-0000-4000-8000-000000140001'
         AND email_verified_at IS NOT NULL) = 1
  AND (SELECT count(*) FROM practice.account_session
       WHERE user_id = '00000000-0000-4000-8000-000000140001'
         AND revoked_at IS NOT NULL) = 1
  AND (SELECT count(*) FROM practice.progress_result
       WHERE user_id = '00000000-0000-4000-8000-000000140001') = 1
THEN 'fixture-ok' ELSE 'fixture-missing' END;
