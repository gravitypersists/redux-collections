import snake from 'to-snake-case'
import { reduce } from 'lodash'

const types = [
  'pend',
  'add',
  'failedToAdd',
  'pendCreation',
  'create',
  'failedToCreate',
  'pendUpdate',
  'update',
  'failedToUpdate',
  'pendDeletion',
  'delete',
  'failedToDelete',
  'empty',
  'invalidate'
]

const appendName = (forKeyword, accumulator, type) => {
  accumulator[type] = `${snake(type)}_${snake(forKeyword)}`.toUpperCase();
  return accumulator;
}

export default function(forKeyword) {
  return reduce(types, appendName.bind(null, forKeyword), {})
}
