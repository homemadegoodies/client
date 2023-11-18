describe("Guest", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("can see the about page", () => {
    cy.findByRole("button", {
      name: /about/i,
    })
      .click()
      .url()
      .should("include", "/about");
  });

  it("can see the contact page", () => {
    cy.findByRole("button", {
      name: /contact us/i,
    })
      .click()
      .url()
      .should("include", "/contact");

    cy.findByRole("textbox", {
      name: /full name/i,
    }).type("Johnny Doe");

    cy.findByRole("textbox", {
      name: /email/i,
    }).type("johnny@email.com");

    cy.findByRole("textbox", {
      name: /subject/i,
    }).type("General Inquiry");

    cy.findByRole("textbox", {
      name: /message/i,
    }).type("Hello, I have a question about your service.");

    cy.findByRole("button", {
      name: /send/i,
    }).click();
  });

  it("can see landing page", () => {
    // can search for kitchens
    cy.findByRole("textbox", {
      name: /search kitchens/i,
    }).type("Bella");
    // can filter kitchens by category
    cy.findByRole("button", {
      name: /category ​/i,
    }).click();

    cy.findByRole("option", {
      name: /italian/i,
    }).click();

    // can filter kitchens by city
    cy.findByRole("button", {
      name: /city ​/i,
    }).click();

    cy.findByRole("option", {
      name: /toronto/i,
    }).click();
    // can filter kitchens by prices
    cy.findByRole("button", {
      name: /prices ​/i,
    }).click();

    cy.findByRole("option", {
      name: /\$\$\$/i,
    }).click();
    // can click on a kitchen to see its details
    cy.contains("Bella")
      .click()
      .url()
      .should("include", "/kitchens/ae9140ca-300e-43fb-8df5-aba9beebdd60");

    // can search for products
    cy.findByRole("textbox", {
      name: /search dishes/i,
    }).type("Margherita");

    // can filter products by price
    cy.findByRole("button", {
      name: /price ​/i,
    }).click();

    cy.findByRole("option", {
      name: /\$10 - \$20/i,
    }).click();

    // can filter products by calories
    cy.findByRole("button", {
      name: /calories ​/i,
    }).click();

    cy.findByRole("option", {
      name: /500 - 1000/i,
    }).click();

    // can view product details
    cy.contains("Margherita").click();

    // when they click on add to cart, they are redirected to login page
    cy.findByRole("button", {
      name: /add to cart/i,
    })
      .click()
      .url()
      .should("include", "/account");
  });

  it("can register as a customer", () => {
    cy.findByRole("button", {
      name: /account/i,
    })
      .click()
      .url()
      .should("include", "/account");

    cy.findByRole("button", {
      name: /register/i,
    }).click();

    cy.findByRole("textbox", {
      name: /first name/i,
    }).type("Johnny");

    cy.findByRole("textbox", {
      name: /last name/i,
    }).type("Doe");

    cy.findByRole("textbox", {
      name: /email/i,
    }).type("johnny@email.com");

    cy.findByRole("textbox", {
      name: /username/i,
    }).type("johnny");

    cy.get("#password").type("123Pass!");

    cy.get("#confirmPassword").type("123Pass!");

    cy.findByRole("textbox", {
      name: /phone number/i,
    }).type("123 456 7890");

    cy.findByRole("textbox", {
      name: /address/i,
    }).type("1234 Main St");

    cy.findByRole("textbox", {
      name: /postal code/i,
    }).type("M1M1M1");

    cy.findByRole("button", {
      name: /city ​/i,
    }).click();

    cy.findByRole("option", {
      name: /toronto/i,
    }).click();

    cy.findByRole("button", {
      name: /province/i,
    }).click();

    cy.findByRole("option", {
      name: /on/i,
    }).click();

    cy.findByRole("button", {
      name: /sign up/i,
    }).click();
  });

  it("can register as a vendor", () => {
    cy.findByRole("button", {
      name: /account/i,
    })
      .click()
      .url()
      .should("include", "/account");

    cy.findByRole("button", {
      name: /register/i,
    }).click();

    cy.findByRole("textbox", {
      name: /first name/i,
    }).type("Janet");

    cy.findByRole("textbox", {
      name: /last name/i,
    }).type("Doe");

    cy.findByRole("textbox", {
      name: /email/i,
    }).type("janet@email.com");

    cy.findByRole("textbox", {
      name: /username/i,
    }).type("janet");

    cy.get("#password").type("123Pass!");

    cy.get("#confirmPassword").type("123Pass!");

    cy.findByRole("textbox", {
      name: /phone number/i,
    }).type("123 456 7890");

    cy.findByRole("textbox", {
      name: /address/i,
    }).type("1234 Main St");

    cy.findByRole("textbox", {
      name: /postal code/i,
    }).type("M1M1M1");

    cy.findByRole("button", {
      name: /city ​/i,
    }).click();

    cy.findByRole("option", {
      name: /toronto/i,
    }).click();

    cy.findByRole("button", {
      name: /province/i,
    }).click();

    cy.findByRole("option", {
      name: /on/i,
    }).click();

    cy.findByRole("button", {
      name: /role/i,
    }).click();

    cy.findByRole("option", {
      name: /vendor/i,
    }).click();

    cy.findByRole("button", {
      name: /sign up/i,
    }).click();
  });
});
