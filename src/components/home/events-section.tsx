// components/home/events-section.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, MapPin, Clock, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const upcomingEvents = [
  {
    id: 1,
    title: 'Annual Alumni Reunion 2024',
    date: 'July 15, 2024',
    time: '6:00 PM - 10:00 PM',
    location: 'University Main Campus',
    attendees: 250,
    category: 'Social',
    gradient: 'from-blue-500 to-indigo-600',
  },
  {
    id: 2,
    title: 'Tech Industry Networking Night',
    date: 'August 5, 2024',
    time: '7:00 PM - 9:00 PM',
    location: 'Tech Hub Downtown',
    attendees: 120,
    category: 'Networking',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    id: 3,
    title: 'Career Development Workshop',
    date: 'September 10, 2024',
    time: '10:00 AM - 2:00 PM',
    location: 'Online - Zoom',
    attendees: 300,
    category: 'Workshop',
    gradient: 'from-emerald-500 to-teal-600',
  },
]

export function EventsSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Upcoming Events
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Join our events to network, learn, and reconnect with fellow alumni.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              <div className={`relative h-48 bg-gradient-to-r ${event.gradient} flex items-end p-6`}>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 text-gray-800 rounded-full text-xs font-semibold uppercase tracking-wide">
                    {event.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
                  <Users className="h-3 w-3" />
                  <span>{event.attendees} attending</span>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-3 text-blue-500 flex-shrink-0" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-3 text-blue-500 flex-shrink-0" />
                    <span className="text-sm">{event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-3 text-blue-500 flex-shrink-0" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                </div>
                <Button className="w-full" variant="outline">
                  RSVP Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/events">
            <Button variant="outline" size="lg">
              View All Events
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}