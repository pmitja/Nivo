ALTER TABLE sms_messages
  ADD COLUMN IF NOT EXISTS provider_message_id text;

CREATE INDEX IF NOT EXISTS sms_messages_provider_message_id_idx
  ON sms_messages USING btree (provider_message_id);
