/**
 * Example component showing various modern card layouts with irregular structures
 * using shadcn/ui Card component
 */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function CardExamples() {
  return (
    <div className="space-y-8 p-8">
      <h2 className="text-2xl font-semibold mb-6">Modern Card Layout Examples</h2>
      
      {/* Example 1: Asymmetric Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Featured Card</CardTitle>
            <CardDescription>This card spans 2 columns</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Content for the featured card with more space.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Side Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Compact side card.</p>
          </CardContent>
        </Card>
      </div>

      {/* Example 2: Masonry-style Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="lg:row-span-2">
          <CardHeader>
            <CardTitle>Tall Card</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>This card has more vertical space.</p>
            <p>Additional content here.</p>
            <p>More content to demonstrate height.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Card 2</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Regular card.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Card 3</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Regular card.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Card 4</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Regular card.</p>
          </CardContent>
        </Card>
      </div>

      {/* Example 3: Overlapping Cards */}
      <div className="relative">
        <Card className="relative z-10">
          <CardHeader>
            <CardTitle>Overlapping Card 1</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This card overlaps the next one.</p>
          </CardContent>
        </Card>
        <Card className={cn(
          "relative -mt-8 ml-8 z-0 opacity-90",
          "border-card-hover"
        )}>
          <CardHeader>
            <CardTitle>Overlapping Card 2</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This card is positioned behind the first.</p>
          </CardContent>
        </Card>
      </div>

      {/* Example 4: Irregular Shapes with Custom Styling */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-tl-[3rem] rounded-br-[2rem]">
          <CardHeader>
            <CardTitle>Rounded Corners</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Custom border radius for irregular shapes.</p>
          </CardContent>
        </Card>
        <Card className="transform rotate-1 hover:rotate-0 transition-transform">
          <CardHeader>
            <CardTitle>Tilted Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Card with slight rotation for visual interest.</p>
          </CardContent>
        </Card>
        <Card className="rounded-full aspect-square flex items-center justify-center">
          <CardContent className="text-center">
            <CardTitle>Circular</CardTitle>
            <p>Fully rounded card.</p>
          </CardContent>
        </Card>
      </div>

      {/* Example 5: Staggered Layout */}
      <div className="flex flex-wrap gap-4">
        <Card className="flex-1 min-w-[200px]">
          <CardHeader>
            <CardTitle>Flexible Width</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This card adapts to available space.</p>
          </CardContent>
        </Card>
        <Card className="flex-1 min-w-[200px]">
          <CardHeader>
            <CardTitle>Flexible Width</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This card adapts to available space.</p>
          </CardContent>
        </Card>
        <Card className="flex-1 min-w-[200px]">
          <CardHeader>
            <CardTitle>Flexible Width</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This card adapts to available space.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

