import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SearchIcon from 'material-ui-icons/search'
import Input from '../common/UIComponentDecorators/input'
import IconButton from '../common/UIComponentDecorators/iconButton'
import { CenteredDiv } from '../common/styledComponents'

export default class SearchForm extends Component {
  constructor(props) {
    super(props)
    this.state = { isOpen: this.props.searchRequest !== '' }
    this.timer = null
  }

  handleOpen = () => {
    this.setState({isOpen: true})
  }

  handleClose = () => {
    this.setState({isOpen: false})
  }

  handleClick = () => {
    if (this.props.searchRequest !== '' && this.state.isOpen) {
      this.timer = null
      this.search(this.props.searchRequest)
    } else {
      if (this.state.isOpen) {
        this.handleClose()
      } else {
        this.handleOpen()
      }
    }
  }

  handleChange = (value) => {
    this.props.setState({searchRequest: value})
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      if (this.timer) {
        this.search(value)
      }
      this.timer = null
    }, 900)
  }

  search = (searchRequest) => {
    this.props.loadCandidates(
      {
        applicationStatus: 'refreshing',
        searchRequest: searchRequest
      },
      this.props.history)
  }

  render() {
    const searchInput =
      this.state.isOpen || this.props.searchRequest !== '' ?
        <Input
          id='search-input'
          onChange={this.handleChange}
          value={this.props.searchRequest}
          className='search'
          placeholder='search'
          onFocus={() => {this.handleOpen()}}
          onBlur={() => {
            if (this.props.searchRequest === '') {
              this.handleClose();
            }
          }}
          disableUnderline
          autoFocus
        />
        : ''

    return (
      <CenteredDiv>
        <IconButton
          color='inherit'
          icon={<SearchIcon/>}
          onClick={this.handleClick}
          placeholder='search'
        />
        { searchInput }
      </CenteredDiv>
    )
  }
}

SearchForm.propTypes = {
  searchRequest: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  loadCandidates: PropTypes.func.isRequired,
  setState: PropTypes.func.isRequired,
}