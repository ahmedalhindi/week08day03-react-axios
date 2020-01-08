import React from 'react'
import axios from 'axios'

export default class PersonListingsPost extends React.Component {
    state= {
        name: ''
    }
handleChange = event => this.setState({name: event.target.value})

handleSubmit = event => {
    event.preventDefault()
    const user = {
        name: this.state.name
    }
    axios.post(`https://jsonplaceholder.typicode.com/users`, user)
    .then(response => {
        console.log(response)
        console.log(response.data)
    })
}

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        person name:
                        <input type="text" name="name" onChange={this.handleChange} />
                    </label>
                    <button type="submit">Add name</button>
                </form>
            </div>
        )
    }
}