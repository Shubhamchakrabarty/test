// controllers/clientJobInterviewController.js
const { ClientJobInterview, Interview } = require('../models');

const linkInterviewToJob = async (req, res) => {
  const { job_id, interview_id, interview_order, question_set_selection_method, question_set_fixed, number_of_question_sets } = req.body;
  console.log(`Received request to link interview to job: ${JSON.stringify(req.body)}`);

  try {
    // Create the ClientJobInterview record
    const newLink = await ClientJobInterview.create({
      job_id,
      interview_id,
      interview_order, 
      question_set_selection_method, 
      question_set_fixed, 
      number_of_question_sets
    });

    console.log(`Interview linked to job: ${JSON.stringify(newLink)}`);
    res.status(201).json(newLink);
  } catch (error) {
    console.error('Error linking interview to job:', error.message || error);
    res.status(500).json({ message: 'Error linking interview to job' });
  }
};

const updateClientJobInterview = async (req, res) => {
  const { client_job_interview_id } = req.params;
  const { interview_order, question_set_selection_method, question_set_fixed, number_of_question_sets } = req.body;

  try {
    const clientJobInterview = await ClientJobInterview.findByPk(client_job_interview_id);

    if (!clientJobInterview) {
      return res.status(404).json({ message: 'Client Job Interview not found' });
    }

    clientJobInterview.interview_order = interview_order;
    clientJobInterview.question_set_selection_method = question_set_selection_method;
    clientJobInterview.question_set_fixed = question_set_fixed;
    clientJobInterview.number_of_question_sets = number_of_question_sets;

    await clientJobInterview.save();

    console.log(`Updated client job interview with ID ${client_job_interview_id}: ${JSON.stringify(clientJobInterview)}`);
    res.status(200).json(clientJobInterview);
  } catch (error) {
    console.error('Error updating the client job interview:', error.message || error);
    res.status(500).json({ message: 'Error updating the client job interview' }); 
  }
}

const getClientJobInterview = async (req, res) => {
  const { client_job_interview_id } = req.params;

  try {
    const clientJobInterview = await ClientJobInterview.findByPk(client_job_interview_id, {
      include: [
        {
          model: Interview,
          as: 'interview',
          attributes: ['id', 'interview_name', 'interview_time_limit', 'time_limit_per_answer', 'status'],
        }
      ]
    });

    if (!clientJobInterview) {
      return res.status(404).json({ message: 'Client Job Interview not found' });
    }

    res.status(200).json(clientJobInterview);
  } catch (error) {
    console.error('Error fetching the client job interview:', error.message || error);
    res.status(500).json({ message: 'Error fetching the client job interview' }); 
  }
}

module.exports = {
  getClientJobInterview,
  linkInterviewToJob,
  updateClientJobInterview,
};
