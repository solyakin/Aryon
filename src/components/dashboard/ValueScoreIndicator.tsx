
const ValueScoreIndicator = ({score, recommendationId}: {score: number, recommendationId: string}) => {
  return (
    <div 
        className="flex items-center gap-1" 
        role="meter"
        aria-labelledby={`value-score-${recommendationId}`}
        aria-valuenow={score || 0}
        aria-valuemin={0}
        aria-valuemax={100}
    >
        <div data-testid="score-indicator" className={`w-2.5 h-2.5 ${score >= 25 ? 'bg-teal-600' : 'bg-gray-300'} rounded-[1.5px]`} aria-hidden="true"></div>
        <div data-testid="score-indicator" className={`w-2.5 h-2.5 ${score >= 50 ? 'bg-teal-600' : 'bg-gray-300'} rounded-[1.5px]`} aria-hidden="true"></div>
        <div data-testid="score-indicator" className={`w-2.5 h-2.5 ${score >= 75 ? 'bg-teal-600' : 'bg-gray-300'} rounded-[1.5px]`} aria-hidden="true"></div>
        <div data-testid="score-indicator" className={`w-2.5 h-2.5 ${score >= 100 ? 'bg-teal-600' : 'bg-gray-300'} rounded-[1.5px]`} aria-hidden="true"></div>
        <span className="sr-only">Score: {score} out of 100</span>
    </div>
  )
}

export default ValueScoreIndicator