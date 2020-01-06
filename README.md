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
    

[](#using-async-and-await)Using async and await
-----------------------------------------------

We can make working with promises even simpler with `async` and `await`. The `await` keyword resolves the promise and returns the value which we can assign to a variable. Here’s an example:

    handleSubmit = async event => {
      event.preventDefault();
    
      // Promise is resolved and value is inside of the response const.
      const response = await API.delete(`users/${this.state.id}`);
    
      console.log(response);
      console.log(response.data);
    };
    

# ![](https://ga-dash.s3.amazonaws.com/production/assets/logo-9f88ae6c9c3871690e33280fcf557f33.png) React Router

## Objectives

By the end of this, developers should be able to:

- Understand front-end routing
- Understand the React Router model
- Create front-end routes
- Create routes with dynamic segments
- Create nested routes

## Discussion: Routing, Then and Now

In web development, "routing" is the concept of delivering different content
depending on the specific URL path that is accessed. For example, we'd expect
`https://cool-company.biz/products` to show us a different page than
`https://cool-company.biz/about`.

Before the advent of single-page applications, this was achieved by serving
up completely separate HTML documents at those two endpoints. Soon, frameworks
were built around the idea of making it easier for those two documents to share
back-end functionality, like a database and ORM. Before SPAs, this was the major
use case for Ruby-on-Rails and other back-end frameworks.

Fast forward a number of years where browsers are more advanced, the internet
is faster and users expect quick results. This round-trip to the server is
costly and slow. Instead of serving separate HTML documents (and thus requiring
a HTTP request and server response for each path), we can load our whole
application on the first page load, and use JS to change what gets rendered
depending on the current URL path. When new information is needed on the server,
an asynchronous request can be made to the server for any new information.

Changing routes is now nearly instantaneous!

`Data:

const movies = [
  {
    id: 1,
    title: 'Dr. Strangelove',
    director: 'Stanley Kubrick',
    cast: [
      {
        name: 'Peter Sellers',
        role: 'President Merkin Muffley'
      },
      {
        name: 'George C. Scott',
        role: 'General Buck Turgidson'
      },
      {
        name: 'Slim Pickens',
        role: 'Major T.J. "King" Kong'
      }
    ]
  },
  {
    id: 2,
    title: 'Eraserhead',
    director: 'David Lynch',
    cast: [
      {
        name: 'Jack Nance',
        role: 'Henry Spencer'
      },
      {
        name: 'Charlotte Stewart',
        role: 'Mary X'
      },
      {
        name: 'Jeanne Bates',
        role: 'Mrs. X'
      }
    ]
  },
  {
    id: 3,
    title: 'Fantastic Mr. Fox',
    director: 'Wes Anderson',
    cast: [
      {
        name: 'George Clooney',
        role: 'Mr. Fox'
      },
      {
        name: 'Meryl Streep',
        role: 'Mrs. Fox'
      },
      {
        name: 'Bill Murray',
        role: 'Badger'
      }
    ]
  }
]`

Lets create an app and add the home page to it.

## Discussion: React Router

Take a few minutes with your team to explore the code in this repo. Try to make
some educated guesses about how the behaviour we saw a minutes ago is achieved.
As you explore, refer to the [React Router docs](https://reacttraining.com/react-router/core/guides/philosophy/).
Stop reading before the "Nested Routes" section for now. Discuss answers to the
following questions:

- Is React Router built in to react?
- What components (in the React sense) are involved in React Router?
- What is "dynamic" routing? How is it different from "static" routing?
- Can you find a `<BrowserRouter>` anywhere in this app?
- Why does the `Nav` component show up on every route?
- Why does the message "Welcome! Click a link." not show up when we click
   `/movies`?

## Code-Along: Add an "About" Route

Let's add a simple route to our app together. Its path should be `/about`
and it should render a new component that displays some basic info about the
amazing `MyMDB` app.

## Lab: Add a "Team" Route

Add another route, `/team` and have it render a new `Team` component that
displays the following HTML:

```html
<h3> Our Team </h3>

<p> Our team is composed of the best folks around. </p>
```

## Code-Along: Add a route for individual movies

Right now, our app can show all the movies at once, but can't show just one
movie at a time. Our `Movie` component, though, does exactly that! Let's add
IDs to our movie objects in the `movies` array, and the make it so we can visit
`/movies/1` to see just the movie with an ID of `1`.

Once that's working, we'll make it so that we click the title of each movie to
bring us to a page with just that movie.

## Lab: Add subroutes for team

Using [these docs](https://reacttraining.com/react-router/core/guides/philosophy/nested-routes),
Google, and some hacker determination, figure out how to render a nested routes.
Create two routes nested under `/team`: `/engineering` and `/legal`. Both of
these routes should display the content currently visible at `/team`, plus

```HTML
<h4>Engineering</h4>
<ul>
  <li>Toni Langley</li>
  <li>Jordan Allain</li>
  <li>Caleb Pearce</li>
</ul>
```

and

```HTML
<h4>Legal</h4>
<ul>
  <li>Atticus Finch</li>
  <li>Saul Goodman</li>
  <li>Sam Seaborn</li>
</ul>
```

respectively.

**If you can't get it working, don't worry!**
Once you've had a chance to attempt this, I'll demonstrate and discuss the
solution.

## Discussion - State Persistence

Have you noticed that if you like a movie, then travel to the Home route and
back to the Movies route, your movie is no longer liked?

Why do you think that is?

How could we solve this problem?

What would be different about this problem if we were receiving our data from
an API?

## React Router Tips

Here are some things to keep in mind when working with React Router:

- React routes are rendered _inclusively_, meaning that if we have routes for
  `/`, `/books`, and `/books/create`, navigating to `/books/create` will render
  the content from all three of those routes. To avoid this, we can use, we can
  add the `exact` attribute to some of these `<Route />`s.
- If we want to avoid inclusive rendering altogether, we could use a
  [`<Switch />`](https://reacttraining.com/react-router/core/api/Switch).
- `<Route />`s can use either `render=` or `component=` to render JSX, but if we
  need to pass props to a component, we **must** use `render=`.

## Lab - Game of Thrones views

Let's get some more practice with routing in React. There is a large javascript
array for which you to work with located in [gameOfThrones.js](gameOfThrones.js).

The goal of the lab is to display this data with the following routes:

- `/families` -  show all family names as links to view that family.
- `/families/:id` - show a single family's data with links to view individual
  members of that family.
- `/families/new` - create a new family.
- `/families/:family_id/members/:id` -  show a single family member's data.
- `/families/:family_id/members/new` - create a new member for a family.

## Additional Resources

- [React Router Training](https://reacttraining.com/react-router/)
- [A Simple React Router Tutorial - Paul Sherman](https://medium.com/@pshrmn/a-simple-react-router-v4-tutorial-7f23ff27adf)
- [Why are we using `<HashRouter>` instea of `BrowserRouter`?](https://stackoverflow.com/questions/27928372/react-router-urls-dont-work-when-refreshing-or-writting-manually)

## [License](LICENSE)

1. All content is licensed under a CC­BY­NC­SA 4.0 license.
1. All software code is licensed under GNU GPLv3. For commercial use or
    alternative licensing, please contact legal@ga.co.

