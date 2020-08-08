export const state = () => ({
  breakpoint: 0,
})

export const mutations = {
  setBreakpoint (state, breakpoint) {
    state.breakpoint = breakpoint
  },
}