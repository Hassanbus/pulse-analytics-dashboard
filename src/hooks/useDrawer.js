import { useEffect, useRef, useState } from 'react'

const DESKTOP = '(min-width: 1024px)'

// Open/close logic for the mobile menu drawer.
export function useDrawer() {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef(null) // the menu button, so we can give focus back to it
  const returnFocus = useRef(false)

  // Escape closes the drawer, like most menus and dialogs.
  useEffect(() => {
    if (!open) return
    function onKeyDown(event) {
      if (event.key !== 'Escape') return
      returnFocus.current = true
      setOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  // On a desktop-sized window the sidebar is always visible, so the drawer must not stay open.
  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP)
    const onChange = () => desktop.matches && setOpen(false)
    desktop.addEventListener('change', onChange)
    return () => desktop.removeEventListener('change', onChange)
  }, [])

  // Give focus back to the menu button after closing. This runs after React has updated
  // the page, when the button can receive focus again.
  useEffect(() => {
    if (!open && returnFocus.current) {
      returnFocus.current = false
      buttonRef.current?.focus()
    }
  }, [open])

  // Close by Escape, the X button or the dark backdrop: focus goes back to the menu button.
  function close() {
    returnFocus.current = true
    setOpen(false)
  }

  // Close because a link was clicked: the new page takes the focus instead.
  function closeAfterNavigation() {
    setOpen(false)
  }

  return { open, buttonRef, toggle: () => setOpen((value) => !value), close, closeAfterNavigation }
}
