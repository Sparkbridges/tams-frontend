import { TamsButton } from '#/components/atoms'
import type { TamsTableEmptyState } from '#/lib'
import { EmptyState } from '@mantine/core'

type Props = {
  empty?: TamsTableEmptyState
  height?: number
}

const TamsEmptyState = ({ empty, height }: Props) => {
  return (
    <EmptyState className="flex items-center justify-center" h={height ?? 300}>
      <EmptyState.Indicator>
        {typeof empty?.icon === 'string' ? (
          <img
            className="object-cover"
            src={empty.icon}
            alt="empty state icon"
            height={150}
            width={150}
          />
        ) : (
          empty?.icon && <empty.icon />
        )}
      </EmptyState.Indicator>
      <EmptyState.Title>{empty?.title ?? 'No results found'}</EmptyState.Title>
      <EmptyState.Description>
        {empty?.description ??
          "We couldn't find anything matching your search. Try adjusting your filters or searching with different keywords to see more results."}
      </EmptyState.Description>
      <EmptyState.Actions>
        {empty?.actions?.map((action, i) => (
          <TamsButton key={i} variant="default" onClick={action.onClick}>
            {action.label}
          </TamsButton>
        ))}
      </EmptyState.Actions>
    </EmptyState>
  )
}

export default TamsEmptyState
