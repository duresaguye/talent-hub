import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">TalentHub</h3>
            <p className="text-muted-foreground text-sm">Connecting talent with opportunities worldwide.</p>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">For Job Seekers</h4>
            <div className="space-y-2 text-sm">
              <Link href="/jobs" className="block text-muted-foreground hover:text-foreground transition-colors">
                Browse Jobs
              </Link>
              <Link href="/applicant" className="block text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link href="/register" className="block text-muted-foreground hover:text-foreground transition-colors">
                Create Account
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">For Employers</h4>
            <div className="space-y-2 text-sm">
              <Link href="/employer" className="block text-muted-foreground hover:text-foreground transition-colors">
                Post Jobs
              </Link>
              <Link href="/employer" className="block text-muted-foreground hover:text-foreground transition-colors">
                Manage Applications
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Company</h4>
            <div className="space-y-2 text-sm">
              <Link href="/about" className="block text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/contact" className="block text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
              <Link href="/privacy" className="block text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 TalentHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
