import React from 'react'
import CartCard from './CartCard'

describe('<CartCard />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<CartCard />)
  })
})