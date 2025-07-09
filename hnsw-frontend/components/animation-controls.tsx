"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Square } from "lucide-react"

interface AnimationControlsProps {
  isPlaying: boolean
  currentStep: number
  totalSteps: number
  currentLayer: number
  onPlay: () => void
  onPause: () => void
  onStop: () => void
  onStepChange: (step: number) => void
  onNext: () => void
  onPrevious: () => void
  animationSpeed: number
  onSpeedChange: (speed: number) => void
}

export const AnimationControls: React.FC<AnimationControlsProps> = ({
  isPlaying,
  currentStep,
  totalSteps,
  currentLayer,
  onPlay,
  onPause,
  onStop,
  onStepChange,
  onNext,
  onPrevious,
  animationSpeed,
  onSpeedChange,
}) => {
  if (totalSteps === 0) {
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Animation Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Playback Controls */}
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" onClick={onPrevious} disabled={currentStep === 0}>
            <SkipBack className="w-4 h-4" />
          </Button>

          <Button variant="outline" size="sm" onClick={isPlaying ? onPause : onPlay}>
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>

          <Button variant="outline" size="sm" onClick={onStop}>
            <Square className="w-4 h-4" />
          </Button>

          <Button variant="outline" size="sm" onClick={onNext} disabled={currentStep === totalSteps - 1}>
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Step Slider */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Step: {currentStep + 1} / {totalSteps} (Layer {currentLayer})
          </label>
          <Slider
            value={[currentStep]}
            onValueChange={(value) => onStepChange(value[0])}
            min={0}
            max={totalSteps - 1}
            step={1}
          />
        </div>

        {/* Speed Control */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Animation Speed: {animationSpeed}ms</label>
          <Slider
            value={[animationSpeed]}
            onValueChange={(value) => onSpeedChange(value[0])}
            min={100}
            max={2000}
            step={100}
          />
        </div>
      </CardContent>
    </Card>
  )
}
