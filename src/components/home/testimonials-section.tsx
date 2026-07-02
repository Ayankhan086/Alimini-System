// components/home/testimonials-section.tsx
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Software Engineer at Google',
    batch: 'Class of 2018',
    avatar: '/api/placeholder/64/64',
    content: 'AlumniConnect helped me find my dream job through a connection I made at the networking event. The platform is invaluable for professional growth.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Product Manager at Microsoft',
    batch: 'Class of 2015',
    avatar: '/api/placeholder/64/64',
    content: 'The mentorship program connected me with an amazing mentor who guided me through my career transition. Forever grateful!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'CEO at TechStart',
    batch: 'Class of 2012',
    avatar: '/api/placeholder/64/64',
    content: 'I found my co-founder through AlumniConnect. The platform helped me build a network that was crucial for our startup\'s success.',
    rating: 5,
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Data Scientist at Amazon',
    batch: 'Class of 2020',
    avatar: '/api/placeholder/64/64',
    content: 'As a recent graduate, AlumniConnect was instrumental in helping me navigate the job market and connect with industry professionals.',
    rating: 4,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Alumni Say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Hear from alumni who have benefited from our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback>
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role}
                      </p>
                      <p className="text-sm text-blue-600">
                        {testimonial.batch}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}