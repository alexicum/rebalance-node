# Task description

## Payment terminal for the cell providers

Develop (HTML/CSS-coding and implement client-side logic) application interface for the terminal providing the service of refilling the balance of cellular operators. The application should have the following screens / basic input and control elements:

### Main screen

- The list of supported telecom operators: MTS, Beeline, Megafon (list of available operators should be returned from the server).
- Click on certain operator should redirect to the refilling screen.
- Ability to add new operator.

### Refill balance form

- Identifier of the selected operator
- Current balance
- Phone number input field (with mask and validation)
- The field for entering the amount of refill (with mask and validation, min possible amount - 1, max - 1000)
- Submit button - should wait for a response from the server, show a message about the success or error. In case of success, return to the main screen.

# Project description

### Libs & conceptions
- cra - React project builder;
- github for hosting sources
- Continuous deployment: github > heroku
- node.js + express for static and REST API endpoints
- used functional setState: setState((state, props) => {});
- wrote stateUtils - functions helping in component state control of:
  - UI state (errors, touched controls),
  - fields values of the form.
- axios;
- [trashable-react](https://github.com/hjylewis/trashable-react):
  - request promise would be cancelled & nulled in componentWillUnmount and Component would be garbage collected.
- react-router (HashRouter)
- Components: `React.Semantic-UI` (contains ComboBox)

### TODO
- Move state, fetching and logic to HOC's (recompose) and to React Hooks in the future,
- Testing,
- BrowserRouter instead of HashRouter,
- redirect to / on full refresh on not home page,
- Use axios.cancel instead of trashable-react,
- css,
- refactoring of stateUtils.
