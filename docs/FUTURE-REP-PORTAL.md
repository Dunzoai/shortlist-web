# Rep Portal - Future Feature

## Overview
Allow representatives (account managers) to login to their own portal and manage their assigned clients. Each rep sees only their data, while admins see everything.

---

## User Stories

### As a Rep:
- Login with my own credentials
- See dashboard with only MY clients and revenue
- Add new clients (auto-assigned to me)
- Edit my assigned clients
- View my monthly/one-time earnings
- Cannot see other reps' clients or company-wide data

### As an Admin:
- See all clients, all reps, all revenue (current behavior)
- Assign/reassign clients to any rep
- View revenue breakdown by rep
- Manage rep accounts (add/remove team members)

---

## Technical Implementation

### 1. Rep Authentication
- Option A: Use same Supabase auth, add `role` to users table (admin vs rep)
- Option B: Reps login with email in `representatives` table, separate auth flow
- Store `user_id` on representatives table to link auth to rep profile

### 2. Row-Level Security (RLS)
```sql
-- Reps can only see their assigned clients
CREATE POLICY "Reps see own clients" ON clients
  FOR SELECT USING (
    representative_id = (
      SELECT id FROM representatives WHERE user_id = auth.uid()
    )
    OR
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- Similar policies for client_services, etc.
```

### 3. Conditional UI
- Check user role on login
- Admin → full portal (current)
- Rep → filtered portal (their data only)
- Could be same routes with conditional queries, or separate `/rep` routes

### 4. Auto-Assignment
- When rep adds a client, auto-set `representative_id` to their ID
- Rep cannot change assignment (only admin can reassign)

---

## Database Changes Needed

```sql
-- Link representatives to auth users
ALTER TABLE representatives ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Or create admin_users table to distinguish roles
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## UI/UX Considerations

### Rep Dashboard
- Simpler than admin dashboard
- Their clients list
- Their monthly revenue
- Their one-time revenue (by year)
- "Add Client" button (auto-assigns to them)

### Rep Navigation
- Dashboard
- My Clients
- (No access to Affiliates, Team, or company-wide Revenue)

---

## Security Considerations
- RLS is critical - data isolation must be enforced at database level
- Frontend filtering alone is NOT sufficient
- Test thoroughly: rep should never see another rep's data
- Admin override for support/reassignment

---

## Implementation Order

1. **Phase 1**: Add `user_id` to representatives, link to Supabase auth
2. **Phase 2**: Create RLS policies for data isolation
3. **Phase 3**: Build rep-specific UI (or conditional rendering)
4. **Phase 4**: Auto-assignment on client creation
5. **Phase 5**: Testing & security audit

---

## Notes
- Current foundation: representatives table, representative_id on clients
- Admin portal works as-is
- This feature adds rep-specific access layer on top
