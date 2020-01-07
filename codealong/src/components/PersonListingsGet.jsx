import React from 'react'
import axios from 'axios'

class PersonListingsGet  extends React.Component {
    state = {
        persons: []
    }
    render () {
        return (
            <ul>
                {this.state.persons.map(person => <li>{person.name}</li>)}
            </ul>
        )
    }
    componentDidMount() {
        axios.get(`https://jsonplaceholder.typicode.com/users`)
        .then(response => {
            const persons = response.data
            this.setState({persons: persons}) // ({persons})
        })
    }
}

export default PersonListingsGet