
const ShowCard = ({ value, heading, color ,className,headerClassName,valueClassName}) => {
  return (
    <div style={{ background: color }} className={`h-[100%] w-[32%] p-2 flex flex-col rounded-lg justify-around items-center ${className}`}>
      <p className={`font-semibold text-[14px]  sm:text-[12px] lg:text-[16px]  ${headerClassName}`}>{heading}</p>
      <p className={`text-black text-center font-bold text-[20px] sm:text-[14px] lg:text-[28px] ${valueClassName}`}>{value}</p>
    </div>
  )
}

export default ShowCard
