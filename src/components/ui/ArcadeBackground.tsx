import { motion } from 'framer-motion';

export function ArcadeBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-[#131f24]" style={{ contain: 'strict', willChange: 'auto' }}>
      {/* Subtle Duolingo green & blue ambient glows */}
      <motion.div
        className="absolute -top-32 -left-32 w-96 h-96 md:w-[500px] md:h-[500px] rounded-full blur-[120px] opacity-20"
        style={{
          background: 'radial-gradient(circle, #58cc02 0%, #1cb0f6 70%, transparent 100%)',
        }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, 30, -30, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="absolute -bottom-32 -right-32 w-96 h-96 md:w-[500px] md:h-[500px] rounded-full blur-[130px] opacity-15"
        style={{
          background: 'radial-gradient(circle, #ce82ff 0%, #ffc800 60%, transparent 100%)',
        }}
        animate={{
          x: [0, -30, 20, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Very subtle minimal grid for clean structure */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Floating minimal sparkles ✦ */}
      <div className="absolute inset-0">
        {[
          { top: '15%', left: '10%', size: 14, color: '#ffc800', delay: 0 },
          { top: '25%', left: '88%', size: 16, color: '#58cc02', delay: 1 },
          { top: '55%', left: '5%', size: 12, color: '#1cb0f6', delay: 2 },
          { top: '75%', left: '90%', size: 14, color: '#ff9600', delay: 0.5 },
          { top: '85%', left: '20%', size: 16, color: '#ce82ff', delay: 1.5 },
        ].map((star, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute select-none pointer-events-none font-bold"
            style={{
              top: star.top,
              left: star.left,
              color: star.color,
              fontSize: `${star.size}px`,
            }}
            animate={{
              scale: [0.7, 1.2, 0.7],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 3 + (i % 2),
              repeat: Infinity,
              delay: star.delay,
              ease: 'easeInOut',
            }}
          >
            ✦
          </motion.div>
        ))}
      </div>
    </div>
  );
}
