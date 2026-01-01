interface bannerProps {
    title: string;
    color: string;
    textColor: string;
}

const Banner = ({ title, color, textColor }: bannerProps) => {
  return (
    <div className={`${color} w-full flex align-center justify-center mb-4`}>
        <h2 className={`${textColor} p-4 rounded-md text-center text-lg font-semibold`}>
            {title}
        </h2>
    </div>
  )
}

export default Banner;