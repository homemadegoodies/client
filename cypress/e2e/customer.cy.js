import "cypress-plugin-stripe-elements";

describe("Customer", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("can login as a customer, add dishes to faves, carts, checkout, update profile", () => {
    cy.findByRole("button", {
      name: /account/i,
    })
      .click()
      .url()
      .should("include", "/account");

    cy.findByRole("button", {
      name: /login/i,
    }).click();

    cy.findByRole("textbox", {
      name: /username/i,
    }).type("johnny");

    cy.get("#password").type("123Pass!");

    cy.findByRole("button", {
      name: /login/i,
    }).click();

    cy.contains("Cedar")
      .click({ force: true })
      .url()
      .should("include", "/kitchens/d186d373-155b-452c-8d30-c2e04c7e4d7e");

    cy.findByRole("img", {
      name: /mezze magic/i,
    }).click({ force: true });

    // can add to faves
    cy.findByRole("button", {
      name: /add to faves/i,
    }).click();

    // can remove from faves
    cy.findByRole("button", {
      name: /remove from faves/i,
    }).click();

    // can add to cart
    cy.findByRole("spinbutton", {
      name: /quantity/i,
    })
      .click()
      .clear()
      .type("5");

    cy.findByRole("button", {
      name: /add to cart/i,
    }).click();

    // can close the dialog
    cy.findByRole("button", {
      name: /close/i,
    }).click();

    // can view faves
    cy.contains("Faves").click({ force: true });

    // can add all faves to cart
    cy.findByRole("button", {
      name: /add all to cart/i,
    }).click();

    // can dekete faves
    cy.findByRole("button", {
      name: /delete fave/i,
    });
    // can view carts
    cy.contains("Carts").click({ force: true });
    // can checkout
    cy.findByRole("button", {
      name: /checkout/i,
    }).click();

    cy.get("#card-element").within(() => {
      cy.fillElementsInput("cardNumber", "4242424242424242");
      cy.fillElementsInput("cardExpiry", "1025");
      cy.fillElementsInput("cardCvc", "123");
      cy.fillElementsInput("postalCode", "90210");
    });

    cy.findByRole("button", {
      name: /confirm order/i,
    }).click();

    // can view order history
    cy.contains("Orders").click({ force: true });
    // can view profile
    cy.contains("Profile").click({ force: true });

    // can edit proile
    cy.findByTestId("EditIcon").click();

    cy.findByRole("textbox", {
      name: /first name/i,
    })
      .clear()
      .type("John");

    cy.findByRole("textbox", {
      name: /last name/i,
    })
      .clear()
      .type("Doe");

    cy.findByRole("textbox", {
      name: /email/i,
    })
      .clear()
      .type("johnny@doe.com");

    cy.findByRole("textbox", {
      name: /phone/i,
    })
      .clear()
      .type("987 654 3210");

    cy.findByRole("textbox", {
      name: /address/i,
    })
      .clear()
      .type("123 Main St");

    cy.findByRole("textbox", {
      name: /postal code/i,
    })
      .clear()
      .type("N1N 1N1");

    cy.findByRole("button", {
      name: /city/i,
    }).click();

    cy.findByRole("option", {
      name: /hamilton/i,
    }).click();

    cy.findByRole("button", {
      name: /province/i,
    }).click();

    cy.findByRole("option", {
      name: /on/i,
    }).click();

    cy.findByRole("button", {
      name: /update/i,
    });

    // // can delete profile
    // cy.findByTestId("DeleteIcon").click({ force: true });

    // cy.findByRole("button", {
    //   name: /delete/i,
    // }).click();

    // can logout
    cy.findByTestId("LogoutIcon").click({ force: true });
  });
});
