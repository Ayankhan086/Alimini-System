'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, Camera } from 'lucide-react'
import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'

// Validation schema matching the backend
const profileSchema = z.object({
  avatarUrl: z.string().trim().url().max(500).optional().or(z.literal('')),
  currentEmployer: z.string().trim().max(100).optional().or(z.literal('')),
  jobTitle: z.string().trim().max(100).optional().or(z.literal('')),
  industry: z.string().trim().max(100).optional().or(z.literal('')),
  city: z.string().trim().max(100).optional().or(z.literal('')),
  country: z.string().trim().max(100).optional().or(z.literal('')),
  linkedinUrl: z.string().trim().url("Please enter a valid LinkedIn URL").max(200).optional().or(z.literal('')),
  phone: z.string().trim().regex(/^\+?[0-9]{10,15}$/, "Phone must be a valid number with 10-15 digits").optional().or(z.literal('')),
  skills: z.string().max(300, "Skills list is too long").optional(), // We'll process this string into an array
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function EditProfileForm({ initialData }: { initialData: any }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      avatarUrl: initialData?.avatarUrl || '',
      currentEmployer: initialData?.currentEmployer || '',
      jobTitle: initialData?.jobTitle || '',
      industry: initialData?.industry || '',
      city: initialData?.city || '',
      country: initialData?.country || '',
      linkedinUrl: initialData?.linkedinUrl || '',
      phone: initialData?.phone || '',
      skills: initialData?.skills ? initialData.skills.join(', ') : '',
    },
  })

  // Watch avatarUrl to render preview
  const avatarUrl = form.watch('avatarUrl')

  async function onSubmit(data: ProfileFormValues) {
    setIsSubmitting(true)
    setError('')

    try {
      // Convert skills string to array
      const skillsArray = data.skills 
        ? data.skills.split(',').map(s => s.trim()).filter(s => s !== '')
        : []

      const payload = {
        ...data,
        skills: skillsArray,
      }

      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        // If it's a Zod array error, join the messages. Otherwise use the string, or fallback.
        let errorMessage = 'Failed to update profile. Please check your inputs and try again.';
        if (errorData && Array.isArray(errorData.error)) {
          errorMessage = errorData.error.map((e: any) => e.message).join(', ');
        } else if (errorData && errorData.error) {
          errorMessage = errorData.error;
        }
        throw new Error(errorMessage);
      }

      // Add a small delay for better UX before redirecting
      setTimeout(() => {
        router.push('/profile?updated=true')
        router.refresh() // Force next.js to refetch data on the profile page
      }, 500)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto shadow-sm border-gray-200 dark:border-slate-800 dark:bg-slate-900 overflow-hidden transition-colors glass-card anim-fadeInUp">
      <CardHeader className="bg-[#1a365d] dark:bg-gradient-to-r dark:from-[#0B0F19] dark:to-[#1a2b4c] text-white rounded-t-xl transition-colors">
        <CardTitle className="text-xl">Edit Your Profile</CardTitle>
        <CardDescription className="text-blue-200 dark:text-blue-200/70">
          Update your professional career information, skills, and profile picture.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
              {error}
            </div>
          )}

          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center justify-center space-y-4 mb-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 bg-gray-50 flex items-center justify-center shadow-sm">
              {avatarUrl ? (
                <Image src={avatarUrl} alt="Profile Avatar" fill className="object-cover" />
              ) : (
                <Camera className="w-8 h-8 text-gray-300" />
              )}
            </div>
            <CldUploadWidget 
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              onSuccess={(result: any) => {
                form.setValue('avatarUrl', result.info.secure_url)
              }}
              options={{
                maxFiles: 1,
                clientAllowedFormats: ['jpeg', 'png', 'jpg', 'webp'],
                cropping: true,
                croppingAspectRatio: 1,
              }}
            >
              {({ open }) => {
                return (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => open()}
                    className="btn btn-outline bg-transparent"
                  >
                    Upload New Picture
                  </Button>
                )
              }}
            </CldUploadWidget>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="currentEmployer" className="form-label">Current Employer</Label>
              <Input
                id="currentEmployer"
                placeholder="e.g. TechCorp Ltd."
                className="form-input"
                {...form.register('currentEmployer')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="jobTitle" className="form-label">Job Title</Label>
              <Input
                id="jobTitle"
                placeholder="e.g. Software Engineer"
                className="form-input"
                {...form.register('jobTitle')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="form-label">City</Label>
              <Input
                id="city"
                placeholder="e.g. Lahore"
                className="form-input"
                {...form.register('city')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country" className="form-label">Country</Label>
              <Input
                id="country"
                placeholder="e.g. Pakistan"
                className="form-input"
                {...form.register('country')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry" className="form-label">Industry</Label>
              <Input
                id="industry"
                placeholder="e.g. Information Technology"
                className="form-input"
                {...form.register('industry')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="form-label">Phone Number</Label>
              <Input
                id="phone"
                placeholder="e.g. +92 300 1234567"
                className="form-input"
                {...form.register('phone')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedinUrl" className="form-label">LinkedIn URL</Label>
            <Input
              id="linkedinUrl"
              placeholder="https://linkedin.com/in/username"
              className="form-input"
              {...form.register('linkedinUrl')}
            />
            {form.formState.errors.linkedinUrl && (
              <p className="text-xs text-red-500 transition-colors">{form.formState.errors.linkedinUrl.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills" className="form-label">Skills & Certifications</Label>
            <Input
              id="skills"
              placeholder="e.g. React.js, Node.js, Python, Agile"
              className="form-input"
              {...form.register('skills')}
            />
            <p className="text-[11px] text-gray-500 dark:text-gray-400 transition-colors">Separate skills with a comma.</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800 transition-colors">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/profile')}
              disabled={isSubmitting}
              className="btn btn-outline bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="btn btn-primary min-w-[120px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
