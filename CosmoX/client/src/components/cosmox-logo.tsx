
interface CosmoxLogoProps {
  className?: string;
  size?: number;
}

export function CosmoxLogo({ className = "", size = 32 }: CosmoxLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer cosmic ring */}
      <circle
        cx="50"
        cy="50"
        r="45"
        stroke="url(#gradient1)"
        strokeWidth="3"
        fill="none"
        opacity="0.6"
      />
      
      {/* Inner celestial circle */}
      <circle
        cx="50"
        cy="50"
        r="35"
        fill="url(#gradient2)"
      />
      
      {/* Star points */}
      <path
        d="M50 20 L55 40 L75 35 L60 50 L75 65 L55 60 L50 80 L45 60 L25 65 L40 50 L25 35 L45 40 Z"
        fill="url(#gradient3)"
        opacity="0.9"
      />
      
      {/* Central cosmic dot */}
      <circle
        cx="50"
        cy="50"
        r="8"
        fill="white"
        opacity="0.95"
      />
      
      {/* Orbital ring accent */}
      <circle
        cx="50"
        cy="50"
        r="28"
        stroke="url(#gradient4)"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="4 6"
        opacity="0.4"
      />
      
      {/* Gradients */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
        
        <radialGradient id="gradient2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4C1D95" />
          <stop offset="100%" stopColor="#1E1B4B" />
        </radialGradient>
        
        <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        
        <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
    </svg>
  );
}
