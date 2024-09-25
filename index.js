let express = require('express');
let app = express();
let { company } = require('./models/company.model');
let { sequelize } = require('./lib/index');

app.use(express.json());

// Data
let companies = [
  {
    id: 1,
    name: 'Tech Innovators',
    industry: 'Technology',
    foundedYear: 2010,
    headquarters: 'San Francisco',
    revenue: 75000000,
  },
  {
    id: 2,
    name: 'Green Earth',
    industry: 'Renewable Energy',
    foundedYear: 2015,
    headquarters: 'Portland',
    revenue: 50000000,
  },
  {
    id: 3,
    name: 'Innovatech',
    industry: 'Technology',
    foundedYear: 2012,
    headquarters: 'Los Angeles',
    revenue: 65000000,
  },
  {
    id: 4,
    name: 'Solar Solutions',
    industry: 'Renewable Energy',
    foundedYear: 2015,
    headquarters: 'Austin',
    revenue: 60000000,
  },
  {
    id: 5,
    name: 'HealthFirst',
    industry: 'Healthcare',
    foundedYear: 2008,
    headquarters: 'New York',
    revenue: 80000000,
  },
  {
    id: 6,
    name: 'EcoPower',
    industry: 'Renewable Energy',
    foundedYear: 2018,
    headquarters: 'Seattle',
    revenue: 55000000,
  },
  {
    id: 7,
    name: 'MediCare',
    industry: 'Healthcare',
    foundedYear: 2012,
    headquarters: 'Boston',
    revenue: 70000000,
  },
  {
    id: 8,
    name: 'NextGen Tech',
    industry: 'Technology',
    foundedYear: 2018,
    headquarters: 'Chicago',
    revenue: 72000000,
  },
  {
    id: 9,
    name: 'LifeWell',
    industry: 'Healthcare',
    foundedYear: 2010,
    headquarters: 'Houston',
    revenue: 75000000,
  },
  {
    id: 10,
    name: 'CleanTech',
    industry: 'Renewable Energy',
    foundedYear: 2008,
    headquarters: 'Denver',
    revenue: 62000000,
  },
];

app.get('/seed_db', async (req, res) => {
  try {
    await sequelize.sync({ force: true });

    await company.bulkCreate(companies);

    res.status(200).json({ message: 'Database seeding successful.' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error while seeding the Data.', error: error.message });
  }
});

// 1
async function fetchAllCompanies() {
  let companyData = await company.findAll();

  return { companyData };
}

app.get('/companies', async (req, res) => {
  try {
    let response = await fetchAllCompanies();

    if (response.companyData.length === 0) {
      return res.status(404).json({ message: 'No companies found.' });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2
async function addNewCompany(newCompany) {
  let newData = await company.create(newCompany);

  return newData;
}

app.post('/companies/new', async (req, res) => {
  try {
    let newCompany = req.body.newCompany;
    let response = await addNewCompany(newCompany);

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3
async function updateCompanyById(id, newCompanyData) {
  let companyDetails = await company.findOne({ where: { id } });

  if (!companyDetails) return {};

  companyDetails.set(newCompanyData);

  let updtData = await companyDetails.save();

  return { message: 'Company updatyed successfully', updtData };
}

app.post('/companies/update/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let newCompanyData = req.body;
    let response = await updateCompanyById(id, newCompanyData);

    if (!response.message) {
      return res.status(404).json({ message: 'Company not found.' });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4
async function deleteCompanyById(id) {
  let destroyComp = await company.destroy({ where: { id } });

  if (!destroyComp) return {};

  return { message: 'Company deleted successfully.' };
}

app.post('/companies/delete', async (req, res) => {
  try {
    let id = parseInt(req.body.id);
    let response = await deleteCompanyById(id);

    if (!response.message) {
      return res.status(404).json({ message: 'Company not found.' });
    }

    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Port
app.listen(3000, () => {
  console.log('Server is running on Port 3000');
});
