import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { levaStore } from '../../store'
import { LevaRoot, LevaRootProps } from './LevaRoot'

let rootInitialized = false
let rootEl: HTMLDivElement | null = null

type LevaProps = Omit<Partial<LevaRootProps>, 'store'> & { isRoot?: boolean }

// uses global store
export function Leva({
  theme,
  isRoot = false,
  detached = true,
  collapsed = false,
  oneLineLabels = false,
  hideTitleBar = false,
  hidden = false,
}: LevaProps) {
  useEffect(() => {
    rootInitialized = true
    // if this panel was attached somewhere in the app and there is already
    // a floating panel, we remove it.
    if (!isRoot && rootEl) {
      rootEl.remove()
      rootEl = null
    }
    return () => {
      if (!isRoot) rootInitialized = false
    }
  }, [isRoot])

  return (
    <LevaRoot
      store={levaStore}
      theme={theme}
      detached={detached}
      oneLineLabels={oneLineLabels}
      hideTitleBar={hideTitleBar}
      collapsed={collapsed}
      hidden={hidden}
    />
  )
}

/**
 * This hook is used by Leva useControls, and ensures that we spawn a Leva Panel
 * without the user having to put it into the component tree. This should only
 * happen when using the global store
 * @param isGlobalPanel
 */
export function useRenderRoot(isGlobalPanel: boolean) {
  useEffect(() => {
    if (isGlobalPanel && !rootInitialized) {
      if (!rootEl) {
        rootEl = document.createElement('div')
        if (document.body) {
          document.body.appendChild(rootEl)
          ReactDOM.render(<Leva isRoot />, rootEl)
        }
      }
      rootInitialized = true
    }
  }, [isGlobalPanel])
}
