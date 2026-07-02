// components/home/features-section.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Network, Briefcase, Calendar, MessageSquare, GraduationCap, Users } from 'lucide-react'

const features = [
  {
    icon: Network,
    title: 'Networking',
    description: 'Connect with alumni from your batch and across different years',
  },
  {
    icon: Briefcase,
    title: 'Job Portal',
    description: 'Access exclusive job opportunities posted by fellow alumni',
  },
  {
    icon: Calendar,
    title: 'Events',
    description: 'Stay updated with reunions, webinars, and networking events',
  },
  {
    icon: MessageSquare,
    title: 'Mentorship',
    description: 'Find mentors or become one to guide current students',
  },
  {
    icon: GraduationCap,
    title: 'Learning Resources',
    description: 'Access shared knowledge, research papers, and courses',
  },
  {
    icon: Users,
    title: 'Groups',
    description: 'Join interest-based groups and communities',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to Stay Connected
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Our platform provides all the tools you need to maintain and grow 
            your professional network within the alumni community.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}