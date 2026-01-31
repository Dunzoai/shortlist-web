export interface Service {
  id: string
  name: string
  description: string | null
  created_at: string
}

export interface Affiliate {
  id: string
  name: string
  email: string | null
  phone: string | null
  payment_type: 'percentage' | 'flat' | null
  payment_amount: number | null
  payment_frequency: 'one_time' | 'monthly' | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  name: string
  email: string | null
  phone: string | null
  notes: string | null
  affiliate_id: string | null
  representative_id: string | null
  created_at: string
  updated_at: string
}

export interface ClientService {
  id: string
  client_id: string
  service_id: string
  monthly_cost: number
  one_time_cost: number
  status: 'active' | 'paused' | 'cancelled'
  start_date: string
  notes: string | null
  performed_by_id: string | null
  commission_rate: number
  created_at: string
  updated_at: string
}

export interface ClientWithRelations extends Client {
  affiliate?: Affiliate | null
  client_services?: (ClientService & { service: Service })[]
}

export interface AffiliateWithClients extends Affiliate {
  clients?: Client[]
}

export interface Representative {
  id: string
  name: string
  email: string | null
  role: string | null
  created_at: string
}

export interface Expense {
  id: string
  name: string
  description: string | null
  amount: number
  category: 'subscription' | 'software' | 'contractor' | 'marketing' | 'other'
  is_recurring: boolean
  start_date: string | null
  created_at: string
  updated_at: string
}

// ==================
// Billing Types
// ==================

export interface ClientBilling {
  id: string
  client_id: string
  stripe_customer_id: string | null
  autopay_enabled: boolean
  default_payment_method_id: string | null
  send_invoice_emails: boolean
  send_receipt_emails: boolean
  send_reminder_emails: boolean
  billing_day: number
  created_at: string
  updated_at: string
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled' | 'refunded'

export interface Invoice {
  id: string
  client_id: string
  invoice_number: string
  status: InvoiceStatus
  subtotal: number
  tax_rate: number
  tax_amount: number
  total: number
  amount_paid: number
  amount_due: number
  issue_date: string
  due_date: string
  paid_at: string | null
  period_start: string | null
  period_end: string | null
  stripe_invoice_id: string | null
  stripe_payment_intent_id: string | null
  stripe_hosted_invoice_url: string | null
  pdf_url: string | null
  notes: string | null
  internal_notes: string | null
  reminder_sent_at: string | null
  reminder_count: number
  created_at: string
  updated_at: string
}

export interface InvoiceItem {
  id: string
  invoice_id: string
  description: string
  service_id: string | null
  client_service_id: string | null
  quantity: number
  unit_price: number
  amount: number
  period_start: string | null
  period_end: string | null
  sort_order: number
  created_at: string
}

export type PaymentMethod = 'card' | 'ach' | 'check' | 'cash' | 'other' | 'credit'
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'cancelled'

export interface Payment {
  id: string
  client_id: string
  invoice_id: string | null
  amount: number
  payment_method: PaymentMethod | null
  status: PaymentStatus
  stripe_payment_intent_id: string | null
  stripe_charge_id: string | null
  stripe_refund_id: string | null
  card_brand: string | null
  card_last4: string | null
  failure_reason: string | null
  failure_code: string | null
  notes: string | null
  refunded_amount: number
  refunded_at: string | null
  created_at: string
  updated_at: string
}

export interface ClientUser {
  id: string
  client_id: string
  email: string
  auth_user_id: string | null
  name: string | null
  phone: string | null
  is_primary: boolean
  can_view_invoices: boolean
  can_make_payments: boolean
  can_manage_autopay: boolean
  last_login_at: string | null
  invited_at: string | null
  accepted_at: string | null
  created_at: string
  updated_at: string
}

export type BillingEmailType = 'invoice' | 'receipt' | 'reminder' | 'overdue' | 'autopay_failed' | 'autopay_success'
export type BillingEmailStatus = 'queued' | 'sent' | 'delivered' | 'failed' | 'bounced'

export interface BillingEmail {
  id: string
  client_id: string
  invoice_id: string
  email_type: BillingEmailType
  recipient_email: string
  subject: string | null
  status: BillingEmailStatus
  sent_at: string | null
  error_message: string | null
  created_at: string
}

// With relations
export interface InvoiceWithItems extends Invoice {
  invoice_items?: InvoiceItem[]
  client?: Client
  payments?: Payment[]
}

export interface InvoiceWithClient extends Invoice {
  client?: Client
}

// Client Portal Types
export interface Invoice {
  id: string
  client_id: string
  invoice_number: string
  amount: number
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  due_date: string | null
  paid_at: string | null
  stripe_payment_intent_id: string | null
  stripe_invoice_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  invoice_id: string
  client_id: string
  amount: number
  stripe_payment_intent_id: string | null
  payment_method_last4: string | null
  status: 'pending' | 'succeeded' | 'failed'
  paid_at: string | null
  created_at: string
}

export interface RecurringBilling {
  id: string
  client_id: string
  stripe_subscription_id: string | null
  stripe_customer_id: string | null
  status: 'active' | 'cancelled' | 'paused'
  next_billing_date: string | null
  created_at: string
}
