'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input, Label } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError('אימייל או סיסמה שגויים')
      return
    }
    router.replace('/admin')
    router.refresh()
  }

  return (
    <div className="bg-charcoal flex min-h-svh items-center justify-center px-4">
      <Card className="w-full max-w-sm p-8">
        <p className="font-display text-ketchup mb-1 text-2xl">אלכסנדר</p>
        <p className="text-charcoal-soft mb-6 text-sm">כניסה לניהול האתר</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">אימייל</Label>
            <Input
              id="email"
              type="email"
              dir="ltr"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="password">סיסמה</Label>
            <Input
              id="password"
              type="password"
              dir="ltr"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-ketchup text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'מתחבר…' : 'כניסה'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
