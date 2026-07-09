function DetailField({ label, value, className = '' }) {
  if (value === undefined || value === null || value === '') {
    return null
  }

  return (
    <div className={className}>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-[#4E6B72]">{label}</p>
      <p className="mt-1 text-sm text-[#C7D6D9]">{value}</p>
    </div>
  )
}

export default DetailField