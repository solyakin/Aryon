import { Boxes } from 'lucide-react'
import ValueScoreIndicator from './ValueScoreIndicator'
import { VscAzure } from 'react-icons/vsc'
import { FaAws } from 'react-icons/fa'
import type { RecommendationDataProps } from '@/types/global'

const DetailHeader = ({item}: {item: RecommendationDataProps}) => {
  return (
    <div>
        <div className="flex gap-2">
            <div className="bg-primary p-4 rounded-sm" aria-hidden="true">
                <Boxes className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="text-left space-y-1 mt-1.5">
                <h2 className="text-xl font-semibold">{item?.title}</h2>
                <div className="flex gap-2 items-center">
                <h4 className="text-sm font-semibold">Value score</h4>
                <ValueScoreIndicator score={item?.score} recommendationId={item?.recommendationId} />
                <p className="text-xs text-muted-foreground">({item?.score} / 100)</p>
                </div>
            </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
            {item?.title?.toLowerCase().includes('azure') ? (
                <div className="flex items-center gap-2">
                <VscAzure className="w-4 h-4 text-muted-foreground" aria-hidden="true"/>
                <p className="text-sm text-muted-foreground">Azure Environment</p>
                </div>
            ) : item?.title?.toLowerCase().includes('aws') ? (
                <div className="flex items-center gap-2">
                <FaAws className="w-4 h-4 text-muted-foreground" aria-hidden="true"/>
                <p className="text-sm text-muted-foreground">AWS Environment</p>
                </div>
            ) : null}
        </div>
    </div>
  )
}

export default DetailHeader