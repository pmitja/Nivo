# Database Schema — Neon PostgreSQL

Uporabljamo Neon PostgreSQL. Vse pomembne tabele morajo imeti `company_id`, kjer je relevantno, ker je sistem multi-tenant.

## companies

```sql
companies
- id
- name
- industry
- contact_name
- email
- phone
- address
- city
- domain
- status
- plan
- has_ai_addon
- google_review_url
- created_at
- updated_at
```

Statusi: active, setup, waiting_for_content, waiting_for_payment, suspended, cancelled.

## users

```sql
users
- id
- company_id
- name
- email
- role
- created_at
- updated_at
```

Role: super_admin, client_admin, client_user.

## leads

```sql
leads
- id
- company_id
- customer_id
- name
- phone
- email
- location
- service
- message
- status
- source
- ai_summary
- created_at
- updated_at
```

Statusi: new, contacted, quote_sent, won, completed, lost.

## customers

```sql
customers
- id
- company_id
- name
- phone
- email
- address
- city
- notes
- source
- status
- marketing_consent
- marketing_consent_at
- marketing_consent_source
- opt_out
- created_at
- updated_at
```

## sms_messages

```sql
sms_messages
- id
- company_id
- customer_id
- lead_id
- phone
- message
- type
- status
- provider
- cost
- error_message
- sent_at
- created_at
```

Tipi: contractor_new_lead, customer_auto_reply, google_review_request, campaign_sms, test_sms.

Statusi: pending, sent, delivered, failed.

## review_requests

```sql
review_requests
- id
- company_id
- customer_id
- lead_id
- phone
- review_url
- status
- sent_at
- created_at
```

## campaigns

```sql
campaigns
- id
- company_id
- name
- type
- channel
- status
- message
- scheduled_at
- sent_at
- created_at
- updated_at
```

Tipi: sms, referral, google_ads, facebook_ads, instagram_ads, tiktok_ads.

## campaign_recipients

```sql
campaign_recipients
- id
- campaign_id
- customer_id
- phone
- status
- sent_at
- error_message
```

## website_change_requests

```sql
website_change_requests
- id
- company_id
- user_id
- title
- message
- status
- priority
- created_at
- resolved_at
```

Statusi: new, in_progress, waiting_for_info, waiting_for_approval, completed, closed.

## website_change_request_comments

```sql
website_change_request_comments
- id
- request_id
- sender_id
- message
- attachments
- created_at
```

## support_tickets

```sql
support_tickets
- id
- company_id
- user_id
- category
- title
- message
- status
- created_at
- resolved_at
```

## services

```sql
services
- id
- company_id
- name
- type
- price
- billing_type
- status
- started_at
- completed_at
- notes
```

## audit_logs

```sql
audit_logs
- id
- company_id
- user_id
- action
- entity_type
- entity_id
- metadata
- created_at
```
