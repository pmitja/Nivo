UPDATE contact_forms
SET
  fields = (
    SELECT jsonb_agg(
      CASE
        WHEN field->>'name' = 'email'
          THEN field || '{"enabled": true, "required": true}'::jsonb
        ELSE field
      END
      ORDER BY position
    )
    FROM jsonb_array_elements(fields) WITH ORDINALITY AS items(field, position)
  ),
  updated_at = now();
