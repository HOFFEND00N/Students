import { createAction } from 'redux-actions'

export const init = createAction('INIT')

export const markToUpdate = createAction('MARKTOUPDATE')

export const unmarkToUpdate = createAction('UNMARKTOUPDATE')

export const commit = createAction('COMMIT')

export const close = createAction('CLOSE')

export const setCurrentTestIndex = createAction('SETCURRENTTESTINDEX')

export const removeUnread = createAction('REMOVEUNREAD')