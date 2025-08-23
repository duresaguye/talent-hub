import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MapPin, Users, TrendingUp, Shield, ArrowRight, Star } from "lucide-react"
import Link from "next/link"

// Mock featured jobs data
const featuredJobs = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120k - $160k",
    description: "Join our team to build cutting-edge web applications using React, TypeScript, and modern tools.",
    tags: ["React", "TypeScript", "Remote"],
  },
  {
    id: 2,
    title: "Product Manager",
    company: "StartupXYZ",
    location: "New York, NY",
    type: "Full-time",
    salary: "$130k - $180k",
    description: "Lead product strategy and work with cross-functional teams to deliver exceptional user experiences.",
    tags: ["Strategy", "Leadership", "SaaS"],
  },
  {
    id: 3,
    title: "UX Designer",
    company: "Design Studio",
    location: "Remote",
    type: "Contract",
    salary: "$80k - $110k",
    description: "Create beautiful and intuitive user experiences for mobile and web applications.",
    tags: ["Figma", "User Research", "Mobile"],
  },
  {
    id: 4,
    title: "Data Scientist",
    company: "DataFlow Labs",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$140k - $190k",
    description: "Analyze complex datasets and build machine learning models to drive business insights.",
    tags: ["Python", "ML", "Analytics"],
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "CloudTech Solutions",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$110k - $150k",
    description: "Manage cloud infrastructure and implement CI/CD pipelines for scalable applications.",
    tags: ["AWS", "Docker", "Kubernetes"],
  },
  {
    id: 6,
    title: "Marketing Manager",
    company: "GrowthCo",
    location: "Los Angeles, CA",
    type: "Full-time",
    salary: "$90k - $120k",
    description: "Drive marketing campaigns and growth strategies for our expanding customer base.",
    tags: ["Digital Marketing", "Growth", "Analytics"],
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-foreground mb-8 font-heading leading-tight">
              Find Your
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {" "}
                Dream Job
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Connect with top employers and discover opportunities that match your skills and ambitions. Your next
              career move starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                asChild
                className="text-lg px-10 py-7 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
              >
                <Link href="/jobs" className="flex items-center gap-2">
                  Browse Jobs
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-lg px-10 py-7 border-2 hover:bg-muted/50 font-semibold transition-all duration-300 bg-transparent"
              >
                <Link href="/register">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-muted/30 to-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-card rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl">
                  <Users className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h3 className="text-4xl font-black text-foreground mb-2 font-heading">50K+</h3>
              <p className="text-muted-foreground font-medium">Active Job Seekers</p>
            </div>
            <div className="text-center p-8 bg-card rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-2xl">
                  <TrendingUp className="h-12 w-12 text-secondary" />
                </div>
              </div>
              <h3 className="text-4xl font-black text-foreground mb-2 font-heading">10K+</h3>
              <p className="text-muted-foreground font-medium">Job Opportunities</p>
            </div>
            <div className="text-center p-8 bg-card rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl">
                  <Shield className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h3 className="text-4xl font-black text-foreground mb-2 font-heading">95%</h3>
              <p className="text-muted-foreground font-medium">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-foreground mb-6 font-heading">
              Featured Opportunities
            </h2>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover hand-picked job opportunities from top companies looking for talented professionals like you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {featuredJobs.map((job) => (
              <Card
                key={job.id}
                className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg bg-card/50 backdrop-blur-sm"
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <Badge
                      variant="secondary"
                      className="text-xs font-semibold px-3 py-1 bg-gradient-to-r from-secondary/20 to-secondary/10 text-secondary border-secondary/20"
                    >
                      {job.type}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-primary fill-primary" />
                      <span className="text-sm font-bold text-primary">{job.salary}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors duration-200">
                    {job.title}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 text-muted-foreground font-medium">
                    <MapPin className="h-4 w-4" />
                    {job.company} • {job.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-6">
                  <p className="text-muted-foreground mb-6 leading-relaxed">{job.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs font-medium px-3 py-1 hover:bg-primary/10 hover:border-primary/30 transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full font-semibold group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary transition-all duration-300 bg-transparent"
                    variant="outline"
                  >
                    Apply Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg px-10 py-6 border-2 font-semibold hover:bg-muted/50 transition-all duration-300 bg-transparent"
            >
              <Link href="/jobs">View All Jobs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary via-primary to-secondary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-4xl lg:text-5xl font-black mb-6 font-heading">Ready to Take the Next Step?</h2>
          <p className="text-xl lg:text-2xl mb-12 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Join thousands of professionals who have found their dream jobs through TalentHub. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="text-lg px-10 py-7 font-bold shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Link href="/register">Get Started Free</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-lg px-10 py-7 border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary font-semibold transition-all duration-300 bg-transparent"
            >
              <Link href="/employer">Post a Job</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
