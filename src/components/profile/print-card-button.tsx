'use client'

import { Button } from '@/components/ui/button'

export function PrintCardButton() {
  return (
    <Button className="print:hidden" onClick={() => window.print()}>
      Download / Print card
    </Button>
  )
}
