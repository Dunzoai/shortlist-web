import { redirect } from 'next/navigation'

export default function DashboardRedirect() {
  redirect('/client-portal/services')
}
