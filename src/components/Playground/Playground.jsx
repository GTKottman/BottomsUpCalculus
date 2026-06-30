import SecantSandbox from './SecantSandbox'
import LimitTableSandbox from './LimitTableSandbox'
import ContinuitySculptor from './ContinuitySculptor'
import DerivativePairing from './DerivativePairing'
import RuleComposer from './RuleComposer'
import OptimizationExplorer from './OptimizationExplorer'
import RiemannComparator from './RiemannComparator'
import AntiderivativeSandbox from './AntiderivativeSandbox'

export default function Playground({ type }) {
  if (type === 'secantSandbox') return <SecantSandbox />
  if (type === 'limitTableSandbox') return <LimitTableSandbox />
  if (type === 'continuitySculptor') return <ContinuitySculptor />
  if (type === 'derivativePairing') return <DerivativePairing />
  if (type === 'ruleComposer') return <RuleComposer />
  if (type === 'optimizationExplorer') return <OptimizationExplorer />
  if (type === 'riemannComparator') return <RiemannComparator />
  if (type === 'antiderivativeSandbox') return <AntiderivativeSandbox />
  return null
}
