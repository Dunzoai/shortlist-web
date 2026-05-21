export default function SuspendedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        {/* Icon */}
        <div className="mb-8">
          <svg 
            className="w-20 h-20 mx-auto text-slate-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
            />
          </svg>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          Site Temporarily Unavailable
        </h1>

        {/* Message */}
        <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
          <p>
            This website is currently unavailable due to a subscription issue.
          </p>
          <p>
            <strong>Are you the site owner?</strong> Please contact your hosting provider 
            to reactivate your subscription and restore access to your site.
          </p>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            All your content and settings are safely preserved and will be restored immediately upon payment.
          </p>
        </div>

        {/* Subtle branding */}
        <div className="mt-8">
          <p className="text-xs text-slate-400">
            Powered by Shortlist Pass
          </p>
        </div>
      </div>
    </div>
  );
}
