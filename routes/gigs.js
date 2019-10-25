const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Gig = require('../models/Gig');
const Sequelize = require('sequelize');
const { Op } = Sequelize;


// Get gig list
router.get('/', async (req, res) => {
  try {
    const gigs = await Gig.findAll();
    console.log(gigs);
    res.render('gigs', {
      gigs,
    });
  } catch (error) {
    console.log(error.message);
  }
});

// Display add gig form
router.get('/add', (req, res) => res.render('add'));

// Add a gig
router.post('/add', async (req, res) => {
  // const data1 = {
  //   title: 'Looking for a React developer',
  //   technologies: 'react, js, html, css',
  //   budget: '$3000',
  //   description:
  //     'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam in nibh eget purusbibendum gravida ut quis dolor. Suspendisse ut nisl eu dui vestibulum auctor. Ut dictum lobortis massa sed ultrices. Phasellus sed commodo nisl',
  //   contact_email: 'user1@gmail.com',
  // };

  // const data2 = {
  //   title: 'Simple Wordpress website',
  //   technologies: 'wordpress, php, html, css',
  //   budget: '$1000',
  //   description:
  //     'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam in nibh eget purusbibendum gravida ut quis dolor. Suspendisse ut nisl eu dui vestibulum auctor. Ut dictum lobortis massa sed ultrices. Phasellus sed commodo nisl',
  //   contact_email: 'user2@gmail.com',
  // };

  let { title, technologies, budget, description, contact_email } = req.body;
  let errors = [];

  // Validate Fields
  if (!title) {
    errors.push({ text: 'Please add a title' });
  }
  if (!technologies) {
    errors.push({ text: 'Please add some technologies' });
  }
  if (!description) {
    errors.push({ text: 'Please add a description' });
  }
  if (!contact_email) {
    errors.push({ text: 'Please add a contact_email' });
  }

  // Check for errors
  if (errors.length > 0) {
    res.render('add', {
      errors,
      title,
      technologies,
      budget,
      description,
      contact_email,
    });
  } else {
    if(!budget) {
      budget = 'Unknown';
    } else {
      budget = `$${budget}`
    }

    // Make lowercase and remove space after comma
    technologies = technologies.toLowerCase().replace(/, /g, ',');

    try {
      // Insert into table
      const gig = await Gig.create({
        title,
        technologies,
        budget,
        description,
        contact_email,
      });
      res.redirect('/gigs');
    } catch (error) {
      console.log(error.message);
    }

  }

});

// Search for gigs
router.get('/search', async (req, res) => {
  let { term } = req.query;
  term = term.toLowerCase();

  try {
    const gigs = await Gig.findAll({ where: { technologies: { [Op.like]: '%' + term + '%' } } });
    console.log(gigs);
    res.render('gigs', {
      gigs,
    });
  } catch (error) {
    console.log(error.message);
  }


});

module.exports = router;
