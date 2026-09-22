import { TamsButton, TamsNumberInput } from '#/components/atoms'
import { Pagination } from '@mantine/core'
import { useState } from 'react'

type TamsPaginationProps = {
  page: number
  total?: number
  limit: number
  onPageChange: (page: number) => void
}
const TamsPagination = ({
  page,
  total,
  limit,
  onPageChange,
}: TamsPaginationProps) => {
  const numberOfPages = Math.ceil((total ?? 0) / limit)
  const [gotoPage, setGotoPage] = useState<number>(page)
  return (
    <div className="flex items-center justify-center gap-10">
      <Pagination
        total={numberOfPages}
        size="md"
        value={page}
        onChange={(value) => onPageChange(value)}
      />
      <div className="flex items-center gap-2">
        <p className="text-sm">Go to page:</p>
        <TamsNumberInput
          value={gotoPage}
          onChange={(value) => setGotoPage(value as number)}
          min={1}
          max={numberOfPages}
          styles={{
            input: { width: 40, border: '1px solid #ccc', borderRadius: 4 },
          }}
          hideControls
          allowDecimal={false}
          allowNegative={false}
        />
        / {numberOfPages}
        <TamsButton
          onClick={() => onPageChange(gotoPage)}
          radius="xl"
          variant="subtle"
        >
          View Page
        </TamsButton>
      </div>
    </div>
  )
}

export default TamsPagination
