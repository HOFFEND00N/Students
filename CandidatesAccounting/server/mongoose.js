import mongoose from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'
import {
  AccountSchema,
  CandidateSchema,
  IntervieweeSchema,
  StudentSchema,
  TraineeSchema,
  TagSchema
} from './schemas'

mongoose.Promise = Promise

export function connect() {
  return mongoose.connect('mongodb://localhost:27017/CandidateAccounting')
}

AccountSchema.plugin(passportLocalMongoose)
export const Account = mongoose.model('Account', AccountSchema, 'accounts')
const Candidate = mongoose.model('Candidate', CandidateSchema, 'candidates')
const Interviewee = mongoose.model('Interviewee', IntervieweeSchema, 'candidates')
const Student = mongoose.model('Student', StudentSchema, 'candidates')
const Trainee = mongoose.model('Trainee', TraineeSchema, 'candidates')
const Tag = mongoose.model('Tag', TagSchema, 'tags')

function identifyModel(status) {
  switch (status) {
    case 'Interviewee':
      return Interviewee
    case 'Student':
      return Student
    case 'Trainee':
      return Trainee
    default:
      return Candidate
  }
}

export function getCandidates(status, sortingField, sortDirection) {
  const findSettings = status === 'Candidate' ? {} : { status }
  if (sortingField !== '' && sortDirection !== '') {
    const sortingSettings = { [sortingField] : sortDirection }
    return identifyModel(status).find(findSettings).sort(sortingSettings).exec()
  }
  return identifyModel(status).find(findSettings).exec()
}

export function getCandidateByID(id) {
  return Candidate.findById(mongoose.Types.ObjectId(id)).exec()
}

export function getAllTags() {
  return Tag.find({}).exec()
    .then(tags => tags.map(tag => tag.title))
}

export function getNotifications(username) {
  return Account.findOne({username: username}).exec()
    .then(account => account.notifications)
}

export function addCandidate(newCandidate) {
  return identifyModel(newCandidate.status).create(newCandidate)
    .then(candidate => {
      updateTags(candidate.tags)
      return candidate._id
    })
}

export function updateCandidate(candidateID, candidateNewState, comments) {
  return identifyModel(candidateNewState.status).updateOne({_id: candidateID}, {
    '$set': { ...candidateNewState },
    '$push': { comments }
  })
    .then(candidate => {
      updateTags(candidate.tags)
      return candidate
    })
}

export function deleteCandidate(candidateID) {
  return Candidate.findByIdAndRemove(candidateID).exec()
}

export function addComment(candidateID, comment) {
  const id = mongoose.Types.ObjectId()
  comment._id = id
  return Candidate.findByIdAndUpdate(candidateID, {$push: {comments: comment}}).exec()
    .then(candidate => {
      candidate.subscribers.forEach(subscriber => {
        if (subscriber !== comment.author) {
          addNotification(candidate, subscriber, comment)
        }
      })
      return id
    })
}

export function deleteComment(candidateID, commentID) {
  return Candidate.findByIdAndUpdate(candidateID, {$pull: {comments: {_id: commentID}}}).exec()
}

export function subscribe(candidateID, email) {
  return Candidate.findByIdAndUpdate(candidateID, {$push: {subscribers: email}}).exec()
}

export function unsubscribe(candidateID, email) {
  return Candidate.findByIdAndUpdate(candidateID, {$pull: {subscribers: email}}).exec()
}

export function noticeNotification(username, notificationID) {
  return Account.updateOne({username, 'notifications._id': notificationID}, {$set: {'notifications.$.recent': false}}).exec()
}

export function deleteNotification(username, notificationID) {
  return Account.updateOne({username}, {$pull: {notifications: {_id: notificationID}}}).exec()
}

export function getResume(intervieweeID) {
  return getCandidateByID(intervieweeID)
    .then(interviewee => {
      return {
        resumeName: interviewee.resume,
        resumeData: interviewee.resumeFile
      }
    })
}

export function addResume(intervieweeID, resumeName, resumeData) {
  return getCandidateByID(intervieweeID)
    .then(interviewee => {
      interviewee.resume = resumeName
      interviewee.resumeFile = resumeData
      return updateCandidate(intervieweeID, interviewee)
    })
}

export function getAttachment(candidateID, commentID) {
  return getCandidateByID(candidateID)
    .then(candidate => {
      for (let i = 0; i < candidate.comments.length; i++) {
        if (candidate.comments[i]._id.toString() === commentID) {
          return {
            attachmentName: candidate.comments[i].attachment,
            attachmentData: candidate.comments[i].attachmentFile
          }
        }
      }
      return {
        attachmentName: '',
        attachmentData: null
      }
    })
}

export function addAttachment(candidateID, commentID, attachmentName, attachmentData) {
  return getCandidateByID(candidateID)
    .then(candidate => {
      for (let i = 0; i < candidate.comments.length; i++) {
        if (candidate.comments[i]._id.toString() === commentID) {
          candidate.comments[i].attachment = attachmentName
          candidate.comments[i].attachmentFile = attachmentData
          return updateCandidate(candidateID, candidate)
        }
      }
    })
}

function updateTags(probablyNewTags) {
  getAllTags()
    .then(tags => {
      const tagsToAdd = [];
      probablyNewTags.forEach(tag => {
        if (!tags.includes(tag)) {
          tagsToAdd.push({title: tag})
        }
      })
      if (tagsToAdd.length > 0) {
        addTags(tagsToAdd)
      }
    })
}

function addTags(tags) {
  Tag.create(tags)
}

function addNotification(source, recipient, notification) {
  Account.findOneAndUpdate({username: recipient}, {$push: {notifications: {recent: true, source: source, content: notification}}}).exec()
}