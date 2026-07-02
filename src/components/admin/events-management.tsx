// components/admin/events-management.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Plus,
  Search,
  Filter,
  Calendar,
  MapPin,
  Users,
  Edit,
  Trash2,
  Eye,
} from 'lucide-react'

interface Event {
  id: number
  title: string
  date: string
  location: string
  attendees: number
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled'
  type: string
}

const mockEvents: Event[] = [
  {
    id: 1,
    title: 'Annual Alumni Meet 2024',
    date: '2024-03-15',
    location: 'Main Campus Auditorium',
    attendees: 250,
    status: 'Upcoming',
    type: 'Reunion',
  },
  {
    id: 2,
    title: 'Tech Career Fair',
    date: '2024-04-20',
    location: 'Convention Center',
    attendees: 500,
    status: 'Upcoming',
    type: 'Career',
  },
  {
    id: 3,
    title: 'Webinar: AI in Industry',
    date: '2024-02-10',
    location: 'Online',
    attendees: 150,
    status: 'Completed',
    type: 'Webinar',
  },
]

export function EventsManagement() {
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      case 'Ongoing':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      case 'Completed':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
      case 'Cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Events Management</CardTitle>
              <CardDescription>
                Manage all alumni events and activities
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search events..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Event
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Location
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {events
                  .filter((event) =>
                    event.title.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((event) => (
                    <tr
                      key={event.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {event.title}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4 mr-2" />
                          {event.date}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-2" />
                          {event.location}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{event.type}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Event</CardTitle>
            <CardDescription>
              Fill in the details to create a new event
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" placeholder="Enter event title" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" />
                </div>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Enter event location" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter event description"
                  rows={4}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Event</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}