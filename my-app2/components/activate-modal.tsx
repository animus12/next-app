'use client'

import { Dialog, Portal } from "@chakra-ui/react"
import { ReactNode } from "react"

interface CustomModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full"
}

export const CustomModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  size = "md" 
}: CustomModalProps) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(e) => !e.open && onClose()}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          {/* Dito natin nako-control ang lapad ng modal */}
          <Dialog.Content width={size === "full" ? "100vw" : undefined} maxWidth={size !== "full" ? size : "100vw"}>
            <Dialog.Header>
              <Dialog.Title fontSize="xl" fontWeight="bold">
                {title}
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              {children}
            </Dialog.Body>

            {footer && (
              <Dialog.Footer>
                {footer}
              </Dialog.Footer>
            )}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}