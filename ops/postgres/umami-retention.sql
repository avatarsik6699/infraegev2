\set ON_ERROR_STOP on

BEGIN;
DELETE FROM event_data
WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '13 months';
DELETE FROM website_event
WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '13 months';
DELETE FROM session_data
WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '13 months';
DELETE FROM session_replay
WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '13 months';
DELETE FROM heatmap_event
WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '13 months';
DELETE FROM session
WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '13 months';
COMMIT;

VACUUM (ANALYZE) event_data;
VACUUM (ANALYZE) website_event;
VACUUM (ANALYZE) session_data;
VACUUM (ANALYZE) session;
