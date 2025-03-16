import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-sky-50">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="mb-4 text-2xl font-bold text-blue-800">
            Cabelaleila<span className="text-teal-500"> Leila</span>
          </div>
          <div className="relative h-16 w-16">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full bg-blue-500 blur-xl"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="absolute inset-0 rounded-full border-t-4 border-blue-600"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
