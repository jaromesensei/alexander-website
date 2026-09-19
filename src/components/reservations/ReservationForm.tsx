'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input, Label, Textarea } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

const schema = z.object({
  name: z.string().trim().min(2, 'יש להזין שם'),
  phone: z.string().trim().min(9, 'מספר טלפון לא תקין'),
  party_size: z.number().int().min(1).max(30),
  wanted_date: z.string().min(1, 'יש לבחור תאריך'),
  wanted_time: z.string().min(1, 'יש לבחור שעה'),
  notes: z.string().trim().max(500).optional(),
})

type FormValues = z.infer<typeof schema>

export function ReservationForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>(
    'idle',
  )
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { party_size: 2 },
  })

  async function onSubmit(values: FormValues) {
    setStatus('submitting')
    const supabase = createClient()
    const { error } = await supabase.from('reservation_leads').insert({
      name: values.name,
      phone: values.phone,
      party_size: values.party_size,
      wanted_date: values.wanted_date,
      wanted_time: values.wanted_time,
      notes: values.notes || null,
      status: 'new',
    })

    if (error) {
      setStatus('error')
      return
    }
    setStatus('success')
    reset()
  }

  if (status === 'success') {
    return (
      <div className="bg-forest/10 flex flex-col items-center gap-3 rounded-2xl p-8 text-center">
        <CheckCircle2 className="text-forest size-10" />
        <p className="text-lg font-semibold">הבקשה נשלחה בהצלחה!</p>
        <p className="text-charcoal-soft">ניצור איתכם קשר בהקדם לאישור השולחן.</p>
        <Button variant="outline" onClick={() => setStatus('idle')}>
          שליחת בקשה נוספת
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">שם מלא</Label>
          <Input id="name" {...register('name')} />
          {errors.name && (
            <p className="text-ketchup mt-1 text-sm">{errors.name.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="phone">טלפון</Label>
          <Input id="phone" dir="ltr" {...register('phone')} />
          {errors.phone && (
            <p className="text-ketchup mt-1 text-sm">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <Label htmlFor="wanted_date">תאריך</Label>
          <Input id="wanted_date" type="date" {...register('wanted_date')} />
          {errors.wanted_date && (
            <p className="text-ketchup mt-1 text-sm">{errors.wanted_date.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="wanted_time">שעה</Label>
          <Input id="wanted_time" type="time" {...register('wanted_time')} />
          {errors.wanted_time && (
            <p className="text-ketchup mt-1 text-sm">{errors.wanted_time.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="party_size">מספר סועדים</Label>
          <Select id="party_size" {...register('party_size', { valueAsNumber: true })}>
            {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="notes">הערות (אופציונלי)</Label>
        <Textarea
          id="notes"
          rows={3}
          placeholder="חגיגה, ישיבה מיוחדת, אלרגיות…"
          {...register('notes')}
        />
      </div>

      {status === 'error' && (
        <p className="text-ketchup text-sm">
          משהו השתבש בשליחה. אפשר לנסות שוב, או ליצור קשר בטלפון/וואטסאפ.
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={status === 'submitting'}
        className="w-full sm:w-auto"
      >
        {status === 'submitting' ? 'שולח…' : 'שליחת בקשה'}
      </Button>
    </form>
  )
}
