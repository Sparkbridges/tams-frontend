
const TTextBrand = ({ className }: { className?: string }) => {
  return (
    <img
      className={className ?? 'object-cover'}
      src="/images/text-logo.png"
    />
  )
}

export default TTextBrand
