const { Resend } = require('resend');
const { Queue } = require('bullmq');
const IORedis = require('ioredis');
const fs = require('fs').promises;
const path = require('path');
const { NotificationTemplate } = require('../models');
const connection = new IORedis({
    host: '127.0.0.1',
    port: 6379,
});

const emailQueue = new Queue('emailQueue', { connection });
const batchEmailQueue = new Queue('batchEmailQueue', { connection });

const resend = new Resend(process.env.RESEND_API_KEY);

// Cache for email templates
const templateCache = new Map();

async function loadTemplate(templateName) {
    if (templateCache.has(templateName)) {
        return templateCache.get(templateName);
    }

    const templatePath = path.join(__dirname, '..', 'emailTemplates', `${templateName}.html`);
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    templateCache.set(templateName, templateContent);
    return templateContent;
}

function replaceTemplateVariables(template, data) {
    let html = template;
    Object.entries(data).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        html = html.replace(regex, value);
    });
    return html;
}

async function getTemplateFromDatabase(templateId) {
    try {
        const templateRecord = await NotificationTemplate.findByPk(templateId);
        if (!templateRecord) {
            throw new Error('Template not found');
        }
        return templateRecord.emailTemplate;
    } catch (error) {
        console.error('Error fetching template from database:', error);
        throw error;
    }
}

async function sendEmailFromDatabase(templateId, data, subject) {
    try {
        const template = await getTemplateFromDatabase(templateId);
        const html = replaceTemplateVariables(template, data);
        await emailQueue.add('send-email', {
            from: 'Kunal from Pehchaan <notifications@comms.pehchaan.me>',
            to: data.email,
            subject: subject,
            html: html,
        });
        console.log(`Email queued for ${data.email}`);
        return true;
    } catch (error) {
        console.error('Error queueing email:', error);
        throw error;
    }
}

async function processEmailSend(jobData) {
    try {
        const { from, to, subject, html } = jobData;

        const data = await resend.emails.send({
            from,
            to,
            subject,
            html,
        });

        console.log('Email sent successfully:', data);
        return data;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

async function processBatchEmailSend(jobData) {
    // inside jobData we have userArray, jobData and templateId
    // userArray is an array of user objects
    // each user object has email, firstName, lastName
    // jobData has job_id , job_title, client_name 
    // fetch the notification template from database
    try {
        const template = await getTemplateFromDatabase(jobData.templateId);
        // creating the array for sending email for each user in userArray
        const bulkEmail = jobData.userArray.map(user => {
            const data = {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                jobTitle: jobData.jobData.jobTitle,
                JobTitle: jobData.jobData.jobTitle,
                Job_Title: jobData.jobData.jobTitle,
                jobId: jobData.jobData.jobId,
                clientName: jobData.jobData.clientName,
                Candidate_Name: user.firstName + ' ' + user.lastName
            };
            const html = replaceTemplateVariables(template, data);
            return {
                from: 'Kunal from Pehchaan <notifications@comms.pehchaan.me>',
                to: user.email,
                subject: `Regarding your recent job application at ${jobData.jobData.clientName} - ${jobData.jobData.jobTitle}`,
                html,
            }
        });
        // now send the emails
        const data = await resend.batch.send(bulkEmail);
        // const html = replaceTemplateVariables(template, jobData.userArray);
        console.log('Emails sent successfully using Resend Batch API:', data);
        console.log('Processing batch email job:', jobData);
        return data;
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}
async function sendEmail(templateName, data, subject) {
    try {
        const template = await loadTemplate(templateName);
        const html = replaceTemplateVariables(template, data);

        await emailQueue.add('send-email', {
            from: 'Kunal from Pehchaan <notifications@comms.pehchaan.me>',
            to: data.email,
            subject: subject,
            html: html,
        });

        console.log(`Email queued for ${data.email}`);
        return true;
    } catch (error) {
        console.error('Error queueing email:', error);
        throw error;
    }
}

// Specific email sending functions
async function sendSignupEmail(userData) {
    return sendEmailFromDatabase(1, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email
    }, 'Welcome to Pehchaan!');
}

async function sendJobApplicationEmail(userData, jobData, templateId) {
    return sendEmailFromDatabase(templateId, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        jobTitle: jobData.jobTitle,
        jobId: jobData.jobId
    }, `Application Started: ${jobData.jobTitle} - ${jobData.clientName}`);
}

async function sendInviteCandidateToJobEmail(userData, jobData, templateId) {
    return sendEmailFromDatabase(templateId, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        jobTitle: jobData.jobTitle,
        jobId: jobData.jobId
    }, `Invitation : ${jobData.jobTitle} - ${jobData.clientName}`);
}

// warning : do not change the hardcoded templateId without checking the database
async function sendOTPEmail(email, otp) {
    return sendEmailFromDatabase(5, {
        email: email,
        OTP: otp // yes, the field has to be in uppercase - check what is going on in database template
    }, 'OTP for Pehchaan');
}

async function sendJobDecisionEmail(userArray, jobData, templateId) {
    // Resend allows a maximum of 100 emails to be sent in a single batch
    // hence keeping the max limit as 90 to be on the safer side
    const MAX_BATCH_SIZE = Math.max(90, userArray.length);
    // divide the userArray in batches of size 90 at max
    const batches = [];
    for (let i = 0; i < userArray.length; i += MAX_BATCH_SIZE) {
        batches.push(userArray.slice(i, i + MAX_BATCH_SIZE));
    }
    // now send the emails
    for (const batch of batches) {
        const jobs = await batchEmailQueue.addBulk([
            {
                name: 'send-bulk-email',
                data: {
                    userArray: batch,
                    jobData: jobData,
                    templateId: templateId
                }
            }
        ])
    }
}

module.exports = {
    sendSignupEmail,
    sendJobApplicationEmail,
    sendInviteCandidateToJobEmail,
    processEmailSend,
    sendOTPEmail,
    sendJobDecisionEmail,
    processBatchEmailSend
};