import { XCircleIcon } from '@heroicons/react/solid'
import { AnimatePresence, motion } from 'framer-motion'
import React, { FC } from 'react'

interface Props {
  open: boolean
  onClose?: (status: boolean) => void
  children: React.ReactNode
}
const Modal: FC<Props> = ({ open, children, onClose }) => {
  return (
    <AnimatePresence exitBeforeEnter initial={false}>
      {open && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed left-0 bottom-0 isolate z-50 h-screen w-full"
        >
          <motion.div
            variants={{
              visible: { opacity: 1, y: 0, x: '-50%' },
              hidden: { opacity: 0, y: '100%', x: '-50%' },
            }}
            className="absolute bottom-0 left-1/2 z-10 h-[90vh] w-full max-w-2xl rounded-t-[2rem] bg-white py-8 px-6 shadow-lg"
          >
            <XCircleIcon
              onClick={onClose?.bind(null, false)}
              className="absolute right-6 w-10 cursor-pointer text-red-500 z-10"
            />
            <div className='overflow-y-auto h-full'>{children}</div>
          </motion.div>
          <div
            onClick={onClose?.bind(null, false)}
            className="-z-1 absolute inset-0 h-full w-full bg-black/30"
          ></div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Modal
