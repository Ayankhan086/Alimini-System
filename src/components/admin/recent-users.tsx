// components/admin/recent-users.tsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const recentUsers = [
  {
    id: 1,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    department: 'Computer Science',
    graduationYear: 2020,
    status: 'Active',
    joinDate: '2024-01-15',
    avatar: '/api/placeholder/32/32',
  },
  {
    id: 2,
    name: 'Bob Smith',
    email: 'bob@example.com',
    department: 'Electrical Engineering',
    graduationYear: 2019,
    status: 'Pending',
    joinDate: '2024-01-14',
    avatar: '/api/placeholder/32/32',
  },
  {
    id: 3,
    name: 'Carol Williams',
    email: 'carol@example.com',
    department: 'Business Administration',
    graduationYear: 2021,
    status: 'Active',
    joinDate: '2024-01-14',
    avatar: '/api/placeholder/32/32',
  },
  {
    id: 4,
    name: 'David Brown',
    email: 'david@example.com',
    department: 'Mechanical Engineering',
    graduationYear: 2018,
    status: 'Inactive',
    joinDate: '2024-01-13',
    avatar: '/api/placeholder/32/32',
  },
  {
    id: 5,
    name: 'Eva Martinez',
    email: 'eva@example.com',
    department: 'Computer Science',
    graduationYear: 2022,
    status: 'Active',
    joinDate: '2024-01-13',
    avatar: '/api/placeholder/32/32',
  },
]

export function RecentUsers() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              User
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              Department
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
              Year
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
          {recentUsers.map((user) => (
            <tr
              key={user.id}
              className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <td className="py-3 px-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                {user.department}
              </td>
              <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                {user.graduationYear}
              </td>
              <td className="py-3 px-4">
                <Badge
                  variant={
                    user.status === 'Active'
                      ? 'default'
                      : user.status === 'Pending'
                      ? 'secondary'
                      : 'outline'
                  }
                >
                  {user.status}
                </Badge>
              </td>
              <td className="py-3 px-4">
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}