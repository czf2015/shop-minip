// 
import { format, adapt } from '../utils/Parse.js'
import { deepCopy } from '../utils/Object.js'
// 
import state from 'state.js'
// 
const record = {}


export const store = {
  state: { ...state },
  set({ key, value }) {
    if (typeof state[key] === 'object') {
      this.state[key] = deepCopy(value)
    } else {
      if (typeof state[key] === typeof value) {
        this.state[key] = value
      } else {
        throw new Error({
          name: 'TypeError',
          message: `${value} is not ${typeof state[key]}`,
          stack: `dispatch('set', ${{ key, value }})`
        })
      }
    }
  },
  reset({ key }) {
    this.state[key] = state[key]
  },
  step({ key, value }) {
    if (typeof state[key] === 'number' && typeof value === 'number') {
      this.state[key] += value
    } else {
      throw new Error({
        name: 'TypeError',
        message: `${key} or ${value} is not number`,
        stack: `dispatch('step', ${{ key, value }})`
      })
    }
  },
  toggle({ key, value }) {
    if (typeof state[key] === 'boolean' && typeof value === 'boolean') {
      this.state[key] = value
    } else {
      throw new Error({
        name: 'TypeError',
        message: `${key} or ${value} is not boolean`,
        stack: `dispatch('toggle', ${{ key, value }})`
      })
    }
  },
  replace({ key, value }) {
    if (typeof state[key] === 'string') {
      this.state[key] = this.state[key].replace(...value)
    } else {
      throw new Error({
        name: 'TypeError',
        message: `${key} is not string`,
        stack: `dispatch('replace', ${{ key, value }})`
      })
    }
  },
  prefix({ key, value }) {
    if (typeof state[key] === 'string' && typeof value === 'string') {
      this.state[key] = value.concat(this.state[key])
    } else {
      throw new Error({
        name: 'TypeError',
        message: `${key} or ${value} is not string`,
        stack: `dispatch('prefix', ${{ key, value }})`
      })
    }
  },
  suffix({ key, value }) {
    if (typeof state[key] === 'string' && typeof value === 'string') {
      this.state[key] = this.state[key].concat(value)
    } else {
      throw new Error({
        name: 'TypeError',
        message: `${key} or ${value} is not string`,
        stack: `dispatch('suffix', ${{ key, value }})`
      })
    }
  },
  slice({ key, value }) {
    if (typeof state[key] === 'string' && typeof value === 'string' ||
      Array.isArray(state[key])) {
      if (Array.isArray(value)) {
        this.state[key] = this.state[key].slice(...value)
      } else {
        this.state[key] = this.state[key].slice(value)
      }
    } else {
      throw new Error({
        name: 'TypeError',
        message: `${key} is not string or array`,
        stack: `dispatch('slice', ${{ key, value }})`
      })
    }
  },
  splice({ key, value }) {
    if (Array.isArray(state[key])) {
      this.state[key].splice(...value)
    } else {
      throw new Error({
        name: 'TypeError',
        message: `${key} is not array`,
        stack: `dispatch('splice', ${{ key, value }})`
      })
    }
  },
  push({ key, value }) {
    if (Array.isArray(state[key])) {
      if (Array.isArray(value)) {
        this.state[key].push(...value)
      } else {
        this.state[key].push(value)
      }
    } else {
      throw new Error({
        name: 'TypeError',
        message: `${key} is not array`,
        stack: `dispatch('push', ${{ key, value }})`
      })
    }
  },
  pop({ key }) {
    if (Array.isArray(state[key])) {
      this.state[key].pop()
    } else {
      throw new Error({
        name: 'TypeError',
        message: `${key} is not array`,
        stack: `dispatch('pop', ${{ key }})`
      })
    }
  },
  shift({ key }) {
    if (Array.isArray(state[key])) {
      this.state[key].shift()
    } else {
      throw new Error({
        name: 'TypeError',
        message: `${key} is not array`,
        stack: `dispatch('shift', ${{ key }})`
      })
    }
  },
  unshift({ key, value }) {
    if (Array.isArray(state[key])) {
      if (Array.isArray(value)) {
        this.state[key].unshift(...value)
      } else {
        this.state[key].unshift(value)
      }
    } else {
      throw new Error({
        name: 'TypeError',
        message: `${key} is not array`,
        stack: `dispatch('unshift', ${{ key, value }})`
      })
    }
  },
  format({ key, value }) {
    if (typeof state[key] === 'object') {
      this.state[key] = format(key, ...value)
    } else {
      throw new Error({
        name: 'TypeError',
        message: `${key} is not object`,
        stack: `dispatch('format', ${{ key, value }})`
      })
    }
  },
  adapt({ key, value }) {
    if (typeof state[key] === 'object') {
      this.state[key] = adapt(key, ...value)
    } else {
      throw new Error({
        name: 'TypeError',
        message: `${key} is not object`,
        stack: `dispatch('adapt', ${{ key, value }})`
      })
    }
  },
  append({ key, value }) {
    if (typeof state[key] === 'object') {
      this.state[key] = { ...this.state[key], ...value }
    } else {
      throw new Error({
        name: 'TypeError',
        message: `${key} is not object`,
        stack: `dispatch('append', ${{ key, value }})`
      })
    }
  },
  remove({ key, value }) {
    if (typeof state[key] === 'object') {
      delete this.state[key][value]
    } else {
      throw new Error({
        name: 'TypeError',
        message: `${key} is not object`,
        stack: `dispatch('remove', ${{ key, value }})`
      })
    }
  },
  record(action, payload) {
    if (action !== 'foreward' && action !== 'backward') {
      const { key } = payload
      if (record[key]) {
        record[key].position++
        record[key].sequence.push({ action, payload, value: this.state[key] })
      } else {
        record[key] = {
          position: 0,
          sequence: [{ action, payload, value: this.state[key] }],
        }
      }
      const target = record[key]
      console.log({ key, value: target.sequence[target.position].value, ...target })
    }
  },
  backward({ key }) {
    this.state[key] = record[key].sequence[record[key].position--].value
  },
  foreward({ key }) {
    this.state[key] = record[key].sequence[record[key].position++].value
  },
}

// 
export function dispatch(action, payload) {
  store[action](payload)
  // if (payload.key === 'suggestion' || payload.key === 'initData') {
  //   store.record(action, payload)
  // }
}


// 可结合Object.js中keyValues函数使用
export function dispatches(action, payloads) {
  payloads.forEach(payload => dispatch(action, payload))
}
