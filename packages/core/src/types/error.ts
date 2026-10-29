import type { Component } from 'vue'

export type ErrorProps = {
  as?: Component | string
}

export type ErrorSlots = {
  default?: (props: {
    message?: string
  }) => void
}
