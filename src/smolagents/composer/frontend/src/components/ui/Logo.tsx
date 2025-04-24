import { FC } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface LogoProps {
  variant?: 'default' | 'small' | 'large';
}

const Logo: FC<LogoProps> = ({ variant = 'default' }) => {
  const sizeClasses = {
    small: 'text-xl',
    default: 'text-2xl',
    large: 'text-3xl',
  };

  return (
    <Link to="/" className="flex items-center no-underline">
      <div className="relative flex items-center">
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-accent-blue to-accent-purple rounded-full opacity-70 blur-sm"
          animate={{ 
            opacity: [0.5, 0.7, 0.5],
            scale: [0.98, 1.01, 0.98]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
        <div className="relative p-1 rounded-full bg-background-secondary">
          <svg 
            width={variant === 'small' ? 28 : variant === 'large' ? 40 : 32} 
            height={variant === 'small' ? 28 : variant === 'large' ? 40 : 32} 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-accent-blue"
          >
            <motion.path
              d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: 1
              }}
            />
            <motion.path
              d="M12 8L12 16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: 1.5
              }}
            />
            <motion.path
              d="M16 12L8 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
                repeatDelay: 1.5
              }}
            />
          </svg>
        </div>
      </div>
      <div className={`ml-2 font-bold tracking-tight ${sizeClasses[variant]}`}>
        <motion.span 
          className="bg-clip-text text-transparent bg-gradient-to-r from-accent-blue to-accent-purple"
          animate={{ 
            backgroundPosition: ['0% center', '100% center', '0% center'],
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            repeatType: 'mirror'
          }}
          style={{ backgroundSize: '200% auto' }}
        >
          SmolagentsUI
        </motion.span>
      </div>
    </Link>
  );
};

export default Logo;