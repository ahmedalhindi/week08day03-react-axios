# ![](https://ga-dash.s3.amazonaws.com/production/assets/logo-9f88ae6c9c3871690e33280fcf557f33.png) React Axios

 
Just about every project needs to interface with a REST API at some stage. [Axios](https://github.com/axios/axios) is a lightweight HTTP client based on the $http service within Angular.js v1.x and similar to the [Fetch API](/js/fetch-api/).

Axios is promise-based and thus we can take advantage of [async and await](/js/async-functions/) for more readable asynchronous code. We can also intercept and cancel requests, and there’s built-in client side protection against cross site request forgery. But the best part about Axios? The easy to use API!

Using it inside a React project is simple! In this example we’ll use Axios to access the common [JSON Placeholder](https://jsonplaceholder.typicode.com/) API within a React application. We can start by adding Axios to our project:

    # Yarn
    $ yarn add axios
    
    # npm
    $ npm install axios --save
    
    
Lets create our App and add it to our project component using
`import axios from "axios";`

[](#get-requests)GET Requests
-----------------------------

If we then create a new component named _PersonList_, we’d be able to hook into the `componentDidMount` lifecycle hook and perform a GET request after importing `axios`.

    import React from 'react';
    
    import axios from 'axios';
    
    export default class PersonList extends React.Component {
      state = {
        persons: []
      }
    
      componentDidMount() {
        axios.get(`https://jsonplaceholder.typicode.com/users`)
          .then(res => {
            const persons = res.data;
            this.setState({ persons });
          })
      }
    
      render() {
        return (
          <ul>
            { this.state.persons.map(person => <li>{person.name}</li>)}
          </ul>
        )
      }
    }
    

Using `axios.get(url)` we then get a promise which returns a response object. As we’re looking for the response data, we’ve assigned the value of `person` to `res.data`.

We can also get other information about our request such as the status code under `res.status` or more information inside of `res.request`.

[](#post-requests)POST Requests
-------------------------------

We can handle other verbs such as POST and PUT in a similar fashion. Let’s create a form that allows for user input and subsequently POST the content to an API:

    import React from 'react';
    import axios from 'axios';
    
    export default class PersonList extends React.Component {
      state = {
        name: '',
      }
    
      handleChange = event => {
        this.setState({ name: event.target.value });
      }
    
      handleSubmit = event => {
        event.preventDefault();
    
        const user = {
          name: this.state.name
        };
    
        axios.post(`https://jsonplaceholder.typicode.com/users`, { user })
          .then(res => {
            console.log(res);
            console.log(res.data);
          })
      }
    
      render() {
        return (
          <div>
            <form onSubmit={this.handleSubmit}>
              <label>
                Person Name:
                <input type="text" name="name" onChange={this.handleChange} />
              </label>
              <button type="submit">Add</button>
            </form>
          </div>
        )
      }
    }
    

Using POST gives us that same response object with information that we can use inside of our `then` call.

[](#delete-requests)DELETE Requests
-----------------------------------

We can delete items from our API using `axios.delete` and passing the URL as a parameter. Let’s change our form to delete a user instead of adding a new one:

    import React from 'react';
    import axios from 'axios';
    
    export default class PersonList extends React.Component {
      state = {
        id: '',
      }
    
      handleChange = event => {
        this.setState({ id: event.target.value });
      }
    
      handleSubmit = event => {
        event.preventDefault();
    
        axios.delete(`https://jsonplaceholder.typicode.com/users/${this.state.id}`)
          .then(res => {
            console.log(res);
            console.log(res.data);
          })
      }
    
      render() {
        return (
          <div>
            <form onSubmit={this.handleSubmit}>
              <label>
                Person ID:
                <input type="text" name="id" onChange={this.handleChange} />
              </label>
              <button type="submit">Delete</button>
            </form>
          </div>
        )
      }
    }
    

Once again our `res` object provides us with information about our request.

[](#base-instance)Base Instance
-------------------------------

Axios allows us to define a **base instance** in which we can define a URL and any other configuration elements. Let’s create a file named `api.js` and export a new `axios` instance with these defaults:

api.js

    import axios from 'axios';
    
    export default axios.create({
      baseURL: `http://jsonplaceholder.typicode.com/`
    });
    

It can then be used inside of our component by importing our new instance like so:

    // Omitted
    import API from '../api';
    
    export default class PersonList extends React.Component {
      handleSubmit = event => {
        event.preventDefault();
    
        API.delete(`users/${this.state.id}`)
          .then(res => {
            console.log(res);
            console.log(res.data);
          })
      }
    }
    

[](#using-async-and-await)Using async and await (can use .then and .catch as well)
----------------------------------------------------------------------------------

We can make working with promises even simpler with `async` and `await`. The `await` keyword resolves the promise and returns the value which we can assign to a variable. Here’s an example:

    // Promise using async await
      handleSubmit = async event => {
      event.preventDefault()
      // Promise is resolved and value is inside of the response const.
      const response = await API.delete(`users/${this.state.id}`);
      console.log(response);
      console.log(response.data);
    };
    
    // Promise using .then
      handleSubmit = event => {
      event.preventDefault()
      // Promise is resolved and value is inside of the response const.
     API.delete(`users/${this.state.id}`).then(response => {
     console.log(response);
     console.log(response.data);
    })
    }
    
   # Codealong
   
   Lets see how we can combine these functionality so as we can easily see the state changes based on the response from the API.
