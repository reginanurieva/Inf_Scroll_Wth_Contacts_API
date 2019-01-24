import React from 'react'
import fetch from 'isomorphic-fetch'
import Contact from './contact'

class ContactList extends React.Component {
  state = {
    contacts: [],
    per: 8,
    page: 1,
    totalPages: null,
    hasMore: true,
  }

  componentWillMount() {
    this.loadContacts()
    this.scrollListener = window.addEventListener('scroll', (e) => {
        this.handleScroll(e)
    })
  }

  handleScroll = (e) => {
      const { scrolling, totalPages, page } = this.state
      if(scrolling) return
      if(totalPages <= page) return
      const lastLi = document.querySelector('ul.contacts > li:last-child')
      const lastLiOffset = lastLi.offsetTop + lastLi.clientHeight
      const pageOffset = window.pageYOffset + window.innerHeight
      var bottomOffset = 20
      if(pageOffset > lastLiOffset -bottomOffset) this.loadMore()
  }

  loadContacts = () => {
    const { per, page, contacts } = this.state
    const url = `https://student-example-api.herokuapp.com/v1/contacts.json?per=${per}&page=${page}`
    fetch(url)
      .then(response => response.json())
      .then(json => this.setState({
        contacts: [...contacts, ...json.contacts],
        scrolling: false,
        totalPages: json.total_pages

      }))
  }

  loadMore = () => {
    this.setState(prevState => ({
      page: prevState.page+1,
      scrolling: true,
    }), this.loadContacts)
  }

  render() {
    return <div>
      <ul className="contacts">
        {
          this.state.contacts.map(contact => <li key={contact.id}>
            <Contact {...contact} />
          </li>)
        }
      </ul>
    </div>
  }
}

export default ContactList