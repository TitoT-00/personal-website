export default function Background() {
    return(
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#02030a]"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(60,100,180,0.15), transparent_45%)]" />
       
       <div className="stars stars-small"/>
       <div className="stars stars-medium"/>
       <div className="stars stars-large" />
       
       
        </div>
    )
}