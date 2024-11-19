const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());

app.get('/api/surveys', async (req, res) => {
  try {
    const response = await axios.get(
      'https://surveysupplysandbox.zamplia.com/api/v1/Surveys/GetAllocatedSurveys',
      {
        headers: {
          Accept: 'application/json',
          'ZAMP-KEY': 'bwiAtId0rUjSeFDB104BFp78zopVtOjs',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/languages', async (req, res) => {
    try {
      const response = await axios.get('https://surveysupplysandbox.zamplia.com/api/v1/Attributes/GetLanguages', {
        headers: {
          'ZAMP-KEY': 'bwiAtId0rUjSeFDB104BFp78zopVtOjs',
          Accept: 'application/json',
        },
      });
      res.json(response.data);
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  });
  
  app.get('/api/industry', async (req, res) => {
    try {
      const response = await axios.get('https://surveysupplysandbox.zamplia.com/api/v1/Attributes/GetIndustry', {
        headers: {
          'ZAMP-KEY': 'bwiAtId0rUjSeFDB104BFp78zopVtOjs',
          Accept: 'application/json',
        },
      });
      res.json(response.data);
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  });

  app.get('/api/stats/', async (req, res) => {
    try {
      let survey_id = req.query.survey_id
      let url = `https://surveysupplysandbox.zamplia.com/api/v1//Surveys/getProjectGlobalstats?SurveyId=${survey_id}`
      const response = await axios.get(url, {
        headers: {
          'ZAMP-KEY': 'bwiAtId0rUjSeFDB104BFp78zopVtOjs',
          Accept: 'application/json',
        },
      });
      res.json(response.data);
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  });

  app.get('/api/qualification', async (req, res) => {
    try {
      let survey_id = req.query.survey_id
      let url = `https://surveysupplysandbox.zamplia.com/api/v1//Surveys/GetSurveyQualifications?SurveyId=${survey_id}`
      const response = await axios.get(url, {
        headers: {
          'ZAMP-KEY': 'bwiAtId0rUjSeFDB104BFp78zopVtOjs',
          Accept: 'application/json',
        },
      });
      res.json(response.data);
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  });

  app.get('/api/demographic', async (req, res) => {
    try {
      let LanguageId = req.query.LanguageId
      let url = `https://surveysupplysandbox.zamplia.com/api/v1//Attributes/GetDemoGraphics?LanguageId=${LanguageId}`
      const response = await axios.get(url, {
        headers: {
          'ZAMP-KEY': 'bwiAtId0rUjSeFDB104BFp78zopVtOjs',
          Accept: 'application/json',
        },
      });
      res.json(response.data);
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  });

  app.get('/api/quota', async (req, res) => {
    try {
      let survey_id = req.query.survey_id
      let url = `https://surveysupplysandbox.zamplia.com/api/v1//Surveys/GetSurveyQuotas?SurveyId=${survey_id}`
      const response = await axios.get(url, {
        headers: {
          'ZAMP-KEY': 'bwiAtId0rUjSeFDB104BFp78zopVtOjs',
          Accept: 'application/json',
        },
      });
      res.json(response.data);
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  });

  app.get('/api/link', async (req, res) => {
    try {
      let survey_id = req.query.survey_id
      let IpAddress = req.query.IpAddress
      let TransactionId = req.query.TransactionId
      console.log(IpAddress)
      let url = `https://surveysupplysandbox.zamplia.com/api/v1/Surveys/GenerateLink?SurveyId=${survey_id}&IpAddress=${IpAddress}&TransactionId=${TransactionId}`
      console.log("url ==> ", url)
      const response = await axios.get(url, {
        headers: {
          'ZAMP-KEY': 'bwiAtId0rUjSeFDB104BFp78zopVtOjs',
          Accept: 'application/json',
        },
      });
      console.log("response: ", response)
      res.json(response.data);
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  });

  app.get('/api/ip', async (req, res) => {
    try {
      const response = await axios.get('https://geolocation-db.com/json/');
      res.json(response.data);
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      res.status(error.response?.status || 500).json({ error: error.message });
    }
  });

app.listen(4000, () => console.log('Proxy running on http://localhost:4000'));
