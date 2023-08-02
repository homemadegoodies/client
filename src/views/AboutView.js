import React from "react";
import { Grid, Typography, Link, Box, Card, Container } from "@mui/material";
import Section from "../components/layout/Section";

export default function AboutView() {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: "100%",
          py: 3,
        }}
      >
        <Grid container spacing={6}>
          <Grid item xs={12} md={12}>
            <Typography
              fontWeight={500}
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Homemade Goodies
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              paragraph
            >
              Welcome to Homemade Goodies - your one-stop digital marketplace
              for delicious homemade foods! We believe that the heart and soul
              of authentic cuisine lie in cherished family recipes, lovingly
              prepared by professional home cooks. Our platform is designed to
              connect these culinary artisans from across Ontario with food
              enthusiasts who crave wholesome and genuine flavors.
            </Typography>

            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              paragraph
            >
              At Homemade Goodies, we understand that not everyone has the time
              or expertise to cook gourmet meals, but everyone deserves to savor
              the delight of homemade goodness. Whether you're a talented home
              cook looking to share your culinary creations or a food lover
              seeking authentic dishes, our application is here to cater to your
              cravings.
            </Typography>

            <Typography
              variant="h5"
              align="center"
              color="text.secondary"
              paragraph
            >
              Join us in celebrating the joy of home-cooked meals, where every
              bite tells a unique story of tradition, passion, and mouthwatering
              flavors. Embrace the warmth of homemade goodness today!
            </Typography>
            <Section />

            <Grid item xs={12} md={12}>
              <Typography
                variant="h5"
                align="center"
                color="text.secondary"
                paragraph
              >
                How to use the application?
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      p: 2,
                      boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
                      borderRadius: "10px",
                      "&:hover": {
                        transform: "scale(1.02)",
                        transition: "transform 0.3s ease-in-out",
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      align="center"
                      color="text.primary"
                      paragraph
                    >
                      How to use the app as a Vendor:
                    </Typography>
                    <Typography variant="body1" color="text.primary" paragraph>
                      1. Join the vendor community: Sign up or log in to your
                      account.
                    </Typography>
                    <Typography variant="body1" color="text.primary" paragraph>
                      2. Craft irresistible products and inspire customers.
                    </Typography>
                    <Typography variant="body1" color="text.primary" paragraph>
                      3. Seal the deal: Confirm orders like a pro.
                    </Typography>
                    <Typography variant="body1" color="text.primary" paragraph>
                      4. Track your success: Check out your charts for growth
                      insights.
                    </Typography>
                    <Typography variant="body1" color="text.primary" paragraph>
                      5. Embrace your stage: Share your passion and teach the
                      world!
                    </Typography>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Card
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      p: 2,
                      boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
                      borderRadius: "10px",
                      "&:hover": {
                        transform: "scale(1.02)",
                        transition: "transform 0.3s ease-in-out",
                      },
                    }}
                  >
                    <Typography
                      variant="h6"
                      align="center"
                      color="text.primary"
                      paragraph
                    >
                      How to use the app as a Customer:
                    </Typography>
                    <Typography variant="body1" color="text.primary" paragraph>
                      1. Kickstart your journey by signing up or logging in.
                    </Typography>
                    <Typography variant="body1" color="text.primary" paragraph>
                      2. Discover exciting kitchens and explore their offerings.
                    </Typography>
                    <Typography variant="body1" color="text.primary" paragraph>
                      3. Tap to add favorites and fill your carts with delight.
                    </Typography>
                    <Typography variant="body1" color="text.primary" paragraph>
                      4. Place an order securely without real credit cards.
                    </Typography>
                    <Typography variant="body1" color="text.primary" paragraph>
                      5. Savor the goodness – bon appétit!
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            <br />
            <Grid item xs={12} md={12}>
              <Typography
                variant="h5"
                align="center"
                color="text.secondary"
                paragraph
              >
                What's the technology stack behind the app?
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <Card
                    sx={{
                      height: "100%",
                      p: 2,
                      boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
                      borderRadius: "10px",
                      "&:hover": {
                        transform: "scale(1.02)",
                        transition: "transform 0.3s ease-in-out",
                      },
                    }}
                  >
                    <Typography
                      align="center"
                      variant="body1"
                      color="text.primary"
                      paragraph
                    >
                      We've used cutting-edge technologies like React 18,
                      Material UI, ASP.NET Core 6, Docker, and PostgreSQL to
                      build the app! The backend and database are hosted on
                      Render, and the frontend on Netlify. And guess what? The
                      source code is available on{" "}
                      <Link href="https://github.com/orgs/homemadegoodies/repositories">
                        GitHub
                      </Link>{" "}
                      too!
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
