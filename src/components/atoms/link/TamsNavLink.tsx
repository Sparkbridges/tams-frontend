import * as React from 'react'
import { createLink } from '@tanstack/react-router'
import type { LinkComponent } from '@tanstack/react-router'
import { NavLink } from '@mantine/core'
import type { NavLinkProps } from '@mantine/core'

interface MantineAnchorProps extends Omit<NavLinkProps, 'href'> {
  // Add any additional props you want to pass to the anchor
}

const MantineLinkComponent = React.forwardRef<
  HTMLAnchorElement,
  MantineAnchorProps
>((props, ref) => {
  return <NavLink ref={ref} {...props} />
})

const CreatedLinkComponent = createLink(MantineLinkComponent)

const TamsNavLink: LinkComponent<typeof MantineLinkComponent> = (props) => {
  return <CreatedLinkComponent preload="intent" {...props} />
}

export default TamsNavLink
