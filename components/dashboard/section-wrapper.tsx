import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface SectionWrapperProps {
  title: string
  description?: string
  children: React.ReactNode
  isLoading?: boolean
}

export function SectionWrapper({
  title,
  description,
  children,
  isLoading,
}: SectionWrapperProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold text-foreground">
          {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-48 w-full" />
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  )
}
