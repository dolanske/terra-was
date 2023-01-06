import { isArray } from 'lodash-es'

export function searchInStr(match: string | string[], search: string) {
  if (!match)
    return false

  const joint: string = isArray(match) ? match.join(' ') : match

  const split = search.trim().split(/\s+/)
  return split.every(s => joint.toLowerCase().includes(s.toLowerCase()))
}
