import LimitHunter from './LimitHunter'
import SlopeSniper from './SlopeSniper'
import AreaEstimator from './AreaEstimator'

export default function MiniGame({ type }) {
  if (type === 'limitHunter') return <LimitHunter />
  if (type === 'slopeSniper') return <SlopeSniper />
  if (type === 'areaEstimator') return <AreaEstimator />
  return null
}
