import React from 'react'

type Props = {
    theme?: "primary" | "neutral"
}

const LoadingPage = ({ theme = 'neutral' }: Props) => {
    return (
        <div className={`min-h-screen flex items-center justify-center ${theme === 'primary' ? 'bg-primary' : 'bg-transparent'}`}>
            <div>
                <div className='text-6xl font-bold text-primary-content'>
                    Loading...
                </div>
                <progress className="progress w-56"></progress>
            </div>
        </div>
    )
}

export default LoadingPage