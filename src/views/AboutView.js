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
              Welcome to Digital Fuse, the platform designed to teach Arabic
              speaking seniors how to use technology to stay connected and start
              businesses. Our mission is to empower older individuals in the
              Arabic speaking community by providing them with the skills and
              knowledge necessary to navigate the digital world.
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
                      How to Use the app as a vendor:
                    </Typography>
                    <Typography variant="body1" color="text.primary" paragraph>
                      1. Get started by signing up as a vendor or log in if you
                      already have an account.
                    </Typography>
                    <Typography variant="body1" color="text.primary" paragraph>
                      2. Create tasty products that customers will love and
                      learn from.
                    </Typography>
                    <Typography variant="body1" color="text.primary" paragraph>
                      3. Confirm your orders.
                    </Typography>
                    <Typography variant="body1" color="text.primary" paragraph>
                      4. View your charts.
                    </Typography>
                    <Typography variant="body1" color="text.primary" paragraph>
                      5. Get ready to teach and share your passion with the
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
                      How to use the app as a customer:
                    </Typography>
                    <Typography variant="body1" color="text.primary" paragraph>
                      1. Get started by signing up as a customr or log in if you
                      already have an account.
                    </Typography>
                    <Typography variant="body1" color="text.primary" paragraph>
                      2. Look for the kitchens you are interested in and click
                      on them.
                    </Typography>
                    <Typography variant="body1" color="text.primary" paragraph>
                      3. Add the products to your cart.
                    </Typography>
                    <Typography variant="body1" color="text.primary" paragraph>
                      4. Make an order.
                    </Typography>
                    <Typography variant="body1" color="text.primary" paragraph>
                      5. Enjoy your food!
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
                      Material UI, ASP.NET Core 6, and PostgreSQL to build the
                      app! The backend is hosted on Heroku, the database on AWS,
                      and the frontend on Netlify. And guess what? The source
                      code is available on{" "}
                      <Link href="https://github.com/orgs/boardwalkabp/repositories">
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
