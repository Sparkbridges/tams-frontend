import { useEffect, useState } from 'react'
import classes from '@/styles/css/modules/Brand.module.css'

type BrandProps = {
  width?: number
  className?: string
  height?: number
  showDigitalClock?: boolean
  showDivider?: boolean
  clockWidth?: number
  clockHeight?: number
  showTamsText?: boolean
}

const TBrand = ({
  width,
  height,
  className,
  showDigitalClock = false,
  showDivider = false,
  clockHeight = 110,
  clockWidth = 110,
  showTamsText = true,
}: BrandProps) => {
  const [degrees, setDegrees] = useState({
    hourDeg: 0,
    minuteDeg: 0,
    secondDeg: 0,
  })

  const [time, setTime] = useState({
    hh: '00',
    mm: '00',
    ss: '00',
  })
  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      setDegrees({
        hourDeg:
          ((now.getHours() % 12) +
            now.getMinutes() / 60 +
            now.getSeconds() / 3600) *
          30,
        minuteDeg:
          (now.getMinutes() +
            now.getSeconds() / 60 +
            now.getMilliseconds() / 60000) *
          6,
        secondDeg: (now.getSeconds() + now.getMilliseconds() / 1000) * 6,
      })
      setTime({
        hh: String(now.getHours()).padStart(2, '0'),
        mm: String(now.getMinutes()).padStart(2, '0'),
        ss: String(now.getSeconds()).padStart(2, '0'),
      })
    }
    const rafId = requestAnimationFrame(function frame() {
      updateClock()
      requestAnimationFrame(frame)
    })
    return () => cancelAnimationFrame(rafId)
  }, [])
  const defaultWrapper = className
    ? `${className}`
    : 'flex flex-col items-center gap-2 w-full'
  return (
    <div
      className={defaultWrapper}
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
      }}
    >
      <div className={classes['tams-clock__mark']}>
        <svg
          viewBox="0 0 200 200"
          style={{ width: clockWidth, height: clockHeight }}
          className={classes['tams-clock__svg']}
        >
          {/* outer blue ring */}
          <circle cx="100" cy="100" r="100" fill="#016AEA" />
          {/* white face */}
          <circle cx="100" cy="100" r="72" fill="#f2f6f9" />

          {/* tick marks */}
          <g>
            {Array.from({ length: 12 }, (_, n) => (
              <rect
                key={n}
                x="96.5"
                y="10"
                width="7"
                height="14"
                rx="3.5"
                fill="#f2f6f9"
                transform={`rotate(${n * 30} 100 100)`}
              />
            ))}
          </g>

          {/* hour hand */}
          <rect
            x="97"
            y="52"
            width="6.5"
            height="52"
            rx="3"
            fill="#1A1A1A"
            transform={`rotate(${degrees.hourDeg} 100 100)`}
          />

          {/* minute hand */}
          <rect
            x="97.75"
            y="34"
            width="5"
            height="70"
            rx="2.25"
            fill="#1A1A1A"
            transform={`rotate(${degrees.minuteDeg} 100 100)`}
          />

          {/* second hand */}
          <rect
            x="99.25"
            y="24"
            width="1.5"
            height="78"
            fill="#E4372C"
            transform={`rotate(${degrees.secondDeg} 100 100)`}
            style={{ zIndex: 99999999 }}
          />

          {/* center pin */}
          <circle cx="100" cy="100" r="8" fill="#FFFFFF" />
          <circle cx="100" cy="100" r="6" fill="#1A1A1A" />
        </svg>
        {showTamsText && (
          <div className={classes['tams-clock-block']}>
            <img
              className={classes['tams-clock__wordmark-image']}
              src="/images/tams-textt.png"
            />
          </div>
        )}
      </div>

      {showDivider && <hr className={classes['tams-clock_divider']} />}
      {showDigitalClock && (
        <div
          className={classes['tams-clock__digital']}
          role="timer"
          aria-live="off"
        >
          <span className={classes['tams-clock__digit']}>{time.hh}</span>
          <span className={classes['tams-clock__colon']}>:</span>
          <span className={classes['tams-clock__digit']}>{time.mm}</span>
          <span className={classes['tams-clock__colon']}>:</span>
          <span className={classes['tams-clock__digit']}>{time.ss}</span>
        </div>
      )}
    </div>
  )
}

export default TBrand
