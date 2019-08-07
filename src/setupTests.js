import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import 'jest-localstorage-mock'

// configure DOM assertions for jest
import '@testing-library/jest-dom/extend-expect'
import '@testing-library/react/cleanup-after-each'
import 'jest-styled-components'

// this is just a little hack to silence a warning that we'll get until react
// fixes this: https://github.com/facebook/react/pull/14853
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})

// set up adapter
configure({ adapter: new Adapter() })
