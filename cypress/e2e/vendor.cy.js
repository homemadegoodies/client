describe("login as a vendor", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
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
    }).type("janet");

    cy.get("#password").type("123Pass!");

    cy.findByRole("button", {
      name: /role/i,
    }).click();

    cy.findByRole("option", {
      name: /vendor/i,
    }).click();

    cy.findByRole("button", {
      name: /login/i,
    }).click();
  });

  it("can add, edit a kitchen", () => {
    cy.visit("http://localhost:3000/vendor/home");
    // can add a kitchen if they don't have one
    // cy.findByRole("button", {
    //   name: /add a kitchen/i,
    // }).click({ force: true });

    // cy.findByRole("textbox", {
    //   name: /name/i,
    // }).type("Thai Spice Garden");

    // cy.findByRole("textbox", {
    //   name: /description/i,
    // }).type("Authentic Thai flavors.");

    // cy.get('label:contains("Category") + div').click();

    // cy.findByRole("option", {
    //   name: /thai/i,
    // }).click();

    // cy.get('label:contains("City") + div').click();

    // cy.findByRole("option", {
    //   name: /hamilton/i,
    // }).click();

    // cy.get('label:contains("Prices") + div').click();

    // cy.findByRole("option", {
    //   name: /\$\$\$/i,
    // }).click();

    // // can upload an image
    // cy.findByRole("button", {
    //   name: /upload/i,
    // }).click();

    // cy.fixture("thai-spice-garden.jpg").then((fileContent) => {
    //   cy.get('input[type="file"]').then((input) => {
    //     const blob = Cypress.Blob.base64StringToBlob(fileContent, "image/jpeg");
    //     const file = new File([blob], "thai-spice-garden.jpg", {
    //       type: "image/jpeg",
    //     });
    //     const dataTransfer = new DataTransfer();
    //     dataTransfer.items.add(file);
    //     input[0].files = dataTransfer.files;
    //     cy.wrap(input).trigger("change", { force: true });
    //   });
    // });

    // cy.wait(1000);
    // cy.findByRole("button", {
    //   name: /save/i,
    // }).click();

    // can't add a kitchen if they already have one
    cy.findByRole("button", {
      name: /add a kitchen/i,
    }).should("not.exist");

    // can view their kitchen
    // cy.wait(2000);
    // cy.visit("http://localhost:3000/kitchens/");
    // cy.findByRole("heading", {
    //   name: /thai spice garden/i,
    // })
    //   .click({ force: true })
    //   .url();

    // can edit their kitchen
    // cy.findByTestId("EditIcon").click({ force: true });

    // cy.findByRole("textbox", {
    //   name: /name/i,
    // })
    //   .clear({ force: true })
    //   .type("Spicy Thai Garden");

    // cy.findByRole("textbox", {
    //   name: /description/i,
    // })
    //   .clear({ force: true })
    //   .type("Authentic and tasty Thai flavors.");

    // cy.findByRole("button", {
    //   name: /update/i,
    // }).click();

    // can delete their kitchen
    // cy.findByTestId("DeleteIcon").click();

    // cy.findByRole("button", {
    //   name: /delete/i,
    // }).click();
  });

  it("can add, edit, delete a product", () => {
    // cy.visit("http://localhost:3000/vendor/home");
    // can add products to kitchen
    // cy.findByRole("heading", {
    //   name: /spicy thai garden/i,
    // })
    //   .click({ force: true })
    //   .url();

    // cy.findByRole("button", {
    //   name: /add a product/i,
    // }).click({ force: true });

    // adding a product requires a mock server for the kitchenId
    // cy.intercept("POST", "/api/products", {
    //   statusCode: 200,
    //   body: {
    //     product: {
    //       kitchen_id: "9099a1e1-965d-43cf-a14d-86b82a5217bd",
    //     },
    //   },
    // });

    // cy.findByRole("textbox", {
    //   name: /name/i,
    // }).type("Pad Thai");

    // cy.findByRole("textbox", {
    //   name: /description/i,
    // }).type("Rice noodles with chicken, egg, tofu and peanuts.");

    // cy.findByRole("button", {
    //   name: /upload image/i,
    // }).click();

    // cy.fixture("pad-thai.jpg").then((fileContent) => {
    //   cy.get('input[type="file"]').then((input) => {
    //     const blob = Cypress.Blob.base64StringToBlob(fileContent, "image/jpeg");
    //     const file = new File([blob], "pad-thai.jpg", {
    //       type: "image/jpeg",
    //     });
    //     const dataTransfer = new DataTransfer();
    //     dataTransfer.items.add(file);
    //     input[0].files = dataTransfer.files;
    //     cy.wrap(input).trigger("change", { force: true });
    //   });
    // });

    // cy.findByRole("spinbutton", {
    //   name: /price/i,
    // })
    //   .clear()
    //   .type("13");

    // cy.findByRole("spinbutton", {
    //   name: /calories/i,
    // })
    //   .clear()
    //   .type("500");

    // cy.wait(1000);
    // cy.findByRole("button", {
    //   name: /save product/i,
    // }).click();

    // can view products in kitchen
    cy.visit("http://localhost:3000/vendor/home");
    // can add products to kitchen
    cy.findByRole("heading", {
      name: /spicy thai garden/i,
    })
      .click({ force: true })
      .url();
    cy.contains("Pad Thai").click({ force: true });

    // can edit products in kitchen
    cy.findByRole("button", {
      name: /edit product/i,
    }).click();

    cy.findByRole("textbox", {
      name: /name/i,
    })
      .clear({ force: true })
      .type("Pad Thai");

    cy.findByRole("textbox", {
      name: /description/i,
    })
      .clear({ force: true })
      .type("Rice noodles with chicken, egg, tofu and peanuts.");

    cy.findByRole("button", {
      name: /update product/i,
    }).click();

    cy.findByRole("button", {
      name: /close/i,
    }).click();

    // can delete products in kitchen
    // cy.findByRole("button", {
    //   name: /delete product/i,
    // }).click();

    // cy.findByRole("button", {
    //   name: /delete/i,
    // }).click();
  });

  it("can view, accept, reject, update orders", () => {
    cy.visit("http://localhost:3000/vendor/home");
    // can view orders
    cy.findByTestId("ReceiptIcon").click({ force: true });

    // can accept orders
    // cy.findByRole("button", { name: /accept/i, timeout: 10000 })
    //   .eq(0)
    //   .click({ force: true});

    // cy.findByRole("button", {
    //   name: /in progress/i,
    // }).click();

    // cy.findByRole("option", {
    //   name: /ready/i,
    // }).click();

    // cy.findByRole("button", {
    //   name: /update/i,
    // }).click();

    // can reject orders
    cy.findByRole("button", {
      name: /reject/i,
    }).click({ force: true });

    cy.findByRole("button", {
      name: /yes/i,
    }).click();

    // can update orders
    // cy.findByRole("button", {
    //   name: /update order/i,
    // }).click();

    // cy.findByRole("button", {
    //   name: /update/i,
    // }).click();

    // can view charts
    cy.contains("Charts").click({ force: true });

    cy.findByRole("button", {
      name: /chart total sales/i,
    }).click();

    cy.findByRole("option", {
      name: /recent sales/i,
    }).click();

    cy.findByRole("button", {
      name: /time 7 days/i,
    }).click();

    cy.findByRole("option", {
      name: /30 days/i,
    }).click();
  });

  it("can view, edit, delete profile and logout", () => {
    cy.visit("http://localhost:3000/vendor/home");
    // can view profile
    cy.contains("Profile").click({ force: true });

    // can edit proile
    cy.findByTestId("EditIcon").click();

    cy.findByRole("textbox", {
      name: /first name/i,
    })
      .clear()
      .type("Jane");

    cy.findByRole("textbox", {
      name: /last name/i,
    })
      .clear()
      .type("Doe");

    cy.findByRole("textbox", {
      name: /email/i,
    })
      .clear()
      .type("jane@doe.com");

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

    // can delete profile
    // cy.findByTestId("DeleteIcon").click({ force: true });

    // cy.findByRole("button", {
    //   name: /delete/i,
    // }).click();

    // can logout
    cy.findByTestId("LogoutIcon").click({ force: true });
  });
});
